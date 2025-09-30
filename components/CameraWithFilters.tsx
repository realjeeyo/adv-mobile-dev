import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { GLView } from "expo-gl";
import * as ImageManipulator from "expo-image-manipulator";
import React, { memo, useCallback, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import * as FileSystem from 'expo-file-system';
// @ts-ignore - ensure module exists after installing dependency
import { captureRef } from 'react-native-view-shot';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Slider from "@react-native-community/slider";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

type FilterType = "none" | "grayscale" | "sepia";

interface CameraWithFiltersProps {
  visible: boolean;
  onClose: () => void;
  onImageCapture: (uri: string) => void;
}

// Memoized filter preview component for performance
const FilterPreview = memo(({ 
  filterType, 
  intensity, 
  isActive, 
  onPress 
}: {
  filterType: FilterType;
  intensity: number;
  isActive: boolean;
  onPress: () => void;
}) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.filterButton,
        isActive && { backgroundColor: colors.primary },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterButtonText,
          { color: isActive ? "#fff" : colors.text },
        ]}
      >
        {filterType === "none" ? "Original" : filterType}
        {filterType !== "none" && ` (${Math.round(intensity * 100)}%)`}
      </Text>
    </TouchableOpacity>
  );
});

// Memoized camera controls for performance
const CameraControls = memo(({ 
  onClose, 
  onCapture, 
  onToggleFacing, 
  isCapturing,
  captureButtonStyle 
}: {
  onClose: () => void;
  onCapture: () => void;
  onToggleFacing: () => void;
  isCapturing: boolean;
  captureButtonStyle: any;
}) => (
  <View style={styles.controlsContainer}>
    {/* Close Button */}
    <TouchableOpacity style={styles.controlButton} onPress={onClose}>
      <Ionicons name="close" size={30} color="#fff" />
    </TouchableOpacity>

    {/* Capture Button */}
    <Animated.View style={captureButtonStyle}>
      <TouchableOpacity
        style={[
          styles.captureButton,
          isCapturing && styles.captureButtonDisabled,
        ]}
        onPress={onCapture}
        disabled={isCapturing}
      >
        <View style={styles.captureButtonInner} />
      </TouchableOpacity>
    </Animated.View>

    {/* Toggle Camera Button */}
    <TouchableOpacity style={styles.controlButton} onPress={onToggleFacing}>
      <Ionicons name="camera-reverse" size={30} color="#fff" />
    </TouchableOpacity>
  </View>
));

const CameraWithFilters: React.FC<CameraWithFiltersProps> = ({
  visible,
  onClose,
  onImageCapture,
}) => {
  const { colors } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [currentFilter, setCurrentFilter] = useState<FilterType>("none");
  const [filterIntensity, setFilterIntensity] = useState(1.0);
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const [showEditingTools, setShowEditingTools] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  // gesture-based interactive crop
  const cropContainerRef = useRef<View | null>(null);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedTranslate = useRef({ x: 0, y: 0 });
  const savedScale = useRef(1);
  const pinchScale = useSharedValue(1);
  const MIN_SCALE = 1;
  const MAX_SCALE = 5;

  const composedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value * pinchScale.value }
    ]
  }));

  const pan = Gesture.Pan()
    .onUpdate(e => {
      translateX.value = savedTranslate.current.x + e.translationX;
      translateY.value = savedTranslate.current.y + e.translationY;
    })
    .onEnd(() => {
      savedTranslate.current = { x: translateX.value, y: translateY.value };
    });

  const pinch = Gesture.Pinch()
    .onUpdate(e => {
      const next = savedScale.current * e.scale;
      if (next < MIN_SCALE) {
        pinchScale.value = MIN_SCALE / savedScale.current;
      } else if (next > MAX_SCALE) {
        pinchScale.value = MAX_SCALE / savedScale.current;
      } else {
        pinchScale.value = e.scale;
      }
    })
    .onEnd(() => {
      savedScale.current = Math.min(MAX_SCALE, Math.max(MIN_SCALE, savedScale.current * pinchScale.value));
      scale.value = savedScale.current;
      pinchScale.value = 1;
    });

  const gesture = Gesture.Simultaneous(pan, pinch);
  
  const cameraRef = useRef<CameraView>(null);
  const glViewRef = useRef<GLView>(null);
  
  // Animation values
  const captureScale = useSharedValue(1);
  const filterPanelOpacity = useSharedValue(1);

  // Animated styles
  const captureButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: captureScale.value }],
  }));

  const filterPanelStyle = useAnimatedStyle(() => ({
    opacity: filterPanelOpacity.value,
  }));

  // Apply filters using WebGL shaders
  const applyFilter = useCallback((gl: any) => {
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec2 position;
      attribute vec2 texCoord;
      varying vec2 vTexCoord;
      
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
        vTexCoord = texCoord;
      }
    `;

    let fragmentShaderSource = `
      precision mediump float;
      uniform sampler2D texture;
      uniform float intensity;
      varying vec2 vTexCoord;
      
      void main() {
        vec4 color = texture2D(texture, vTexCoord);
        
        ${currentFilter === "grayscale" 
          ? `
            float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
            vec3 grayColor = vec3(gray);
            color.rgb = mix(color.rgb, grayColor, intensity);
          `
          : currentFilter === "sepia"
          ? `
            vec3 sepia = vec3(
              dot(color.rgb, vec3(0.393, 0.769, 0.189)),
              dot(color.rgb, vec3(0.349, 0.686, 0.168)),
              dot(color.rgb, vec3(0.272, 0.534, 0.131))
            );
            color.rgb = mix(color.rgb, sepia, intensity);
          `
          : ""
        }
        
        gl_FragColor = color;
      }
    `;

    // Create and compile shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // Create program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Set uniforms
    const intensityLocation = gl.getUniformLocation(program, "intensity");
    gl.uniform1f(intensityLocation, filterIntensity);

    // Note: In a full implementation, you'd set up vertex buffers and render here
    // For now, we'll handle filtering in post-processing
    gl.endFrameEXP();
  }, [currentFilter, filterIntensity]);

  // Toggle camera facing
  const toggleCameraFacing = useCallback(() => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }, []);

  // Capture photo
  const capturePhoto = useCallback(async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      captureScale.value = withSpring(0.9, {}, () => {
        captureScale.value = withSpring(1);
      });

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo?.uri) {
        setCapturedImageUri(photo.uri);
        if (photo.width && photo.height) {
          setImageSize({ width: photo.width, height: photo.height });
        } else {
          // Fallback: query size asynchronously
          Image.getSize(photo.uri, (w, h) => setImageSize({ width: w, height: h }), () => {});
        }
        setShowEditingTools(true);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to capture photo");
      console.error("Capture error:", error);
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing]);

  // Apply editing (crop and rotate)
  const applyEditing = useCallback(async (
    uri: string,
    actions: ImageManipulator.Action[]
  ) => {
    try {
      const result = await ImageManipulator.manipulateAsync(uri, actions, {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
      });
      if ((result as any).width && (result as any).height) {
        setImageSize({ width: (result as any).width, height: (result as any).height });
      } else {
        // Attempt to re-fetch size if not provided
        Image.getSize(result.uri, (w, h) => setImageSize({ width: w, height: h }), () => {});
      }
      return result.uri;
    } catch (error) {
      console.error("Editing error:", error);
      return uri;
    }
  }, []);

  // Crop is now interactive (handled at save time via view-shot capture) – keep placeholder
  const cropImage = useCallback(async () => {}, []);

  // Rotate image
  const rotateImage = useCallback(async () => {
    if (!capturedImageUri) return;
    const rotateActions: ImageManipulator.Action[] = [{ rotate: 90 }];
    const rotatedUri = await applyEditing(capturedImageUri, rotateActions);
    setCapturedImageUri(rotatedUri);
  }, [capturedImageUri, applyEditing]);

  // Close / reset camera modal
  const handleClose = useCallback(() => {
    setCapturedImageUri(null);
    setShowEditingTools(false);
    setCurrentFilter('none');
    setFilterIntensity(1.0);
    onClose();
  }, [onClose]);

  // Save edited photo (with fallback directory)
  const savePhoto = useCallback(async () => {
    if (!capturedImageUri || isSaving) return;
    setIsSaving(true);
    try {
      let finalUri = capturedImageUri;
      // 1. Capture the interactive crop viewport (includes filter overlay if applied visually)
      if (cropContainerRef.current) {
        try {
          const capturePath = await captureRef(cropContainerRef.current, {
            format: 'jpg',
            quality: 0.9,
          });
          if (capturePath) {
            finalUri = capturePath;
          }
        } catch (e) {
          console.warn('Viewport capture failed, falling back to original', e);
        }
      }
      const fileName = `profile_${Date.now()}.jpg`;
      const { documentDirectory, cacheDirectory } = FileSystem as any;
      const baseDir: string | undefined = documentDirectory || cacheDirectory;
      if (!baseDir) {
        // Environment (web?) without writable FS – just pass existing uri
        onImageCapture(finalUri);
        handleClose();
        return;
      }
      const dest = baseDir + fileName;
      if (!finalUri.startsWith(baseDir)) {
        await FileSystem.copyAsync({ from: finalUri, to: dest });
      }
      const storedUri = finalUri.startsWith(baseDir) ? finalUri : dest;
      if (documentDirectory) {
        try {
          const files = await FileSystem.readDirectoryAsync(documentDirectory);
          const profileFiles = files.filter((f: string) => f.startsWith('profile_') && f.endsWith('.jpg')).sort();
          if (profileFiles.length > 5) { // keep last 5 now
            const excess = profileFiles.slice(0, profileFiles.length - 5);
            for (const f of excess) {
              await FileSystem.deleteAsync(documentDirectory + f, { idempotent: true });
            }
          }
        } catch {}
      }
      onImageCapture(storedUri);
      // Dismiss editing modal first
      setShowEditingTools(false);
      // Delay closing camera to avoid black flash
      setTimeout(() => {
        handleClose();
      }, 120);
    } catch (e) {
      Alert.alert('Save Failed', 'Could not save photo.');
      console.error('Save photo error', e);
    } finally {
      setIsSaving(false);
    }
  }, [capturedImageUri, currentFilter, onImageCapture, handleClose, isSaving]);

  // Permission handling
  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}> 
          <Text style={[styles.permissionText, { color: colors.text }]}>We need your permission to show the camera</Text>
          <TouchableOpacity style={[styles.permissionButton, { backgroundColor: colors.primary }]} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        
        {/* Camera View */}
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            mode="picture"
          >
            {/* GL View for real-time filters */}
            {currentFilter !== "none" && (
              <GLView
                ref={glViewRef}
                style={styles.glOverlay}
                onContextCreate={applyFilter}
              />
            )}
          </CameraView>
        </View>

        {/* Filter Controls */}
        <Animated.View style={[styles.filterPanel, filterPanelStyle]}>
          <View style={styles.filterButtons}>
            {(["none", "grayscale", "sepia"] as FilterType[]).map((filter) => (
              <FilterPreview
                key={filter}
                filterType={filter}
                intensity={filterIntensity}
                isActive={currentFilter === filter}
                onPress={() => setCurrentFilter(filter)}
              />
            ))}
          </View>

          {/* Filter Intensity Slider */}
          {currentFilter !== "none" && (
            <View style={styles.sliderContainer}>
              <Text style={[styles.sliderLabel, { color: colors.text }]}>
                Intensity
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={filterIntensity}
                onValueChange={setFilterIntensity}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.textSecondary}
                thumbTintColor={colors.primary}
              />
              <Text style={[styles.sliderValue, { color: colors.textSecondary }]}>
                {Math.round(filterIntensity * 100)}%
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Camera Controls */}
        <CameraControls
          onClose={handleClose}
          onCapture={capturePhoto}
          onToggleFacing={toggleCameraFacing}
          isCapturing={isCapturing}
          captureButtonStyle={captureButtonStyle}
        />

        {/* Editing Tools Modal */}
        <Modal
          visible={showEditingTools}
          animationType="slide"
          presentationStyle="formSheet"
        >
          <View style={[styles.editingContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.editingHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.editingTitle, { color: colors.text }]}>
                Edit Photo
              </Text>
            </View>

            {/* Captured Image Preview */}
            <View style={styles.previewWrapper} ref={r => { cropContainerRef.current = r; }}>
              {capturedImageUri ? (
                <GestureDetector gesture={gesture}>
                  <Animated.Image
                    source={{ uri: capturedImageUri }}
                    style={[styles.previewImage, composedStyle]}
                    resizeMode="cover"
                  />
                </GestureDetector>
              ) : (
                <View style={styles.previewPlaceholder}>
                  <ActivityIndicator color={colors.primary} />
                </View>
              )}
              {/* Square frame overlay */}
              <View pointerEvents="none" style={styles.cropOverlay} />
            </View>

            {/* Editing Tools */}
            <View style={styles.editingTools}>
              <TouchableOpacity style={styles.editButton} onPress={rotateImage}>
                <Ionicons name="refresh" size={24} color={colors.primary} />
                <Text style={[styles.editButtonText, { color: colors.text }]}>Rotate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton} onPress={() => {
                // reset transforms
                translateX.value = 0; translateY.value = 0; savedTranslate.current = { x:0,y:0 };
                scale.value = 1; pinchScale.value = 1; savedScale.current = 1;
              }}>
                <Ionicons name="refresh-circle" size={24} color={colors.primary} />
                <Text style={[styles.editButtonText, { color: colors.text }]}>Reset</Text>
              </TouchableOpacity>
            </View>

            {/* Save/Cancel Buttons */}
            <View style={styles.editingActions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.surface }]}
                onPress={() => setShowEditingTools(false)}
              >
                <Text style={[styles.actionButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={savePhoto}
                disabled={isSaving}
              >
                <Text style={styles.actionButtonText}>{isSaving ? 'Saving...' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {isSaving && (
          <View style={styles.savingOverlay} pointerEvents="none">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.savingText, { color: colors.text }]}>Saving...</Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  permissionButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cameraContainer: {
    flex: 1,
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  glOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.8,
  },
  filterPanel: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 20,
  },
  filterButtons: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  sliderContainer: {
    paddingHorizontal: 30,
    alignItems: "center",
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderValue: {
    fontSize: 12,
    marginTop: 5,
  },
  controlsContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 50,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonInner: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#ff4444",
  },
  editingContainer: {
    flex: 1,
  },
  editingHeader: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  editingTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  editingTools: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  editButton: {
    alignItems: "center",
    padding: 20,
  },
  editButtonText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
  },
  editingActions: {
    flexDirection: "row",
    padding: 20,
    gap: 15,
  },
  previewWrapper: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  previewImage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '120%',
    height: '120%',
    marginLeft: '-60%',
    marginTop: '-60%',
  },
  cropOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)'
  },
  savingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  savingText: {
    fontSize: 16,
    fontWeight: '600'
  },
  previewPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default memo(CameraWithFilters);