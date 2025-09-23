import { useTheme } from '@/hooks/useTheme';
import { useAppDispatch } from '@/store/hooks';
import { saveThemeToStorage, setCustomColor, setThemeMode } from '@/store/themeSlice';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

const PRESET_COLORS = [
  '#1DB954', // Spotify Green
  '#FF6B35', // Orange
  '#E91E63', // Pink
  '#2196F3', // Blue
  '#9C27B0', // Purple
  '#FF9800', // Amber
  '#4CAF50', // Green
  '#F44336', // Red
];

export default function ThemeSettings() {
  const { colors, mode } = useTheme();
  const dispatch = useAppDispatch();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColorKey, setCurrentColorKey] = useState<string>('');
  const [customColorValue, setCustomColorValue] = useState('');

  // Animation values
  const lightAnim = useSharedValue(mode === 'light' ? 1 : 0);
  const darkAnim = useSharedValue(mode === 'dark' ? 1 : 0);
  const customAnim = useSharedValue(mode === 'custom' ? 1 : 0);

  const handleThemeChange = (newMode: 'light' | 'dark' | 'custom') => {
    dispatch(setThemeMode(newMode));
    
    // Save to storage with the new theme
    const updatedTheme = {
      mode: newMode,
      colors: newMode === 'light' ? { ...colors } : 
              newMode === 'dark' ? { ...colors } : colors,
      customColors: colors,
      isLoading: false,
    };
    dispatch(saveThemeToStorage(updatedTheme) as any);

    // Animate selection
    lightAnim.value = withTiming(newMode === 'light' ? 1 : 0, { duration: 300 });
    darkAnim.value = withTiming(newMode === 'dark' ? 1 : 0, { duration: 300 });
    customAnim.value = withTiming(newMode === 'custom' ? 1 : 0, { duration: 300 });
  };

  const handleColorChange = (colorKey: string) => {
    setCurrentColorKey(colorKey);
    setCustomColorValue('');
    setShowColorPicker(true);
  };

  const applyCustomColor = (color: string) => {
    if (currentColorKey && color) {
      dispatch(setCustomColor({ key: currentColorKey as any, color }));
      
      // Save updated theme to storage
      const updatedCustomColors = { ...colors, [currentColorKey]: color };
      const updatedTheme = {
        mode,
        colors: mode === 'custom' ? updatedCustomColors : colors,
        customColors: updatedCustomColors,
        isLoading: false,
      };
      dispatch(saveThemeToStorage(updatedTheme) as any);
      setShowColorPicker(false);
    }
  };

  const ThemeOption = ({ 
    title, 
    description, 
    themeMode, 
    animValue, 
    icon 
  }: { 
    title: string; 
    description: string; 
    themeMode: 'light' | 'dark' | 'custom'; 
    animValue: Animated.SharedValue<number>;
    icon: string;
  }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        animValue.value,
        [0, 1],
        [colors.surface, colors.primary]
      );
      
      return {
        backgroundColor,
        transform: [{ scale: withTiming(animValue.value === 1 ? 1.02 : 1) }],
      };
    });

    const textAnimatedStyle = useAnimatedStyle(() => {
      const textColor = interpolateColor(
        animValue.value,
        [0, 1],
        [colors.text, '#FFFFFF']
      );
      
      return { color: textColor };
    });

    return (
      <TouchableOpacity onPress={() => handleThemeChange(themeMode)}>
        <Animated.View style={[styles.themeOption, animatedStyle]}>
          <View style={styles.themeOptionHeader}>
            <FontAwesome name={icon as any} size={24} color={colors.primary} />
            <Animated.Text style={[styles.themeTitle, textAnimatedStyle]}>
              {title}
            </Animated.Text>
          </View>
          <Animated.Text style={[styles.themeDescription, textAnimatedStyle]}>
            {description}
          </Animated.Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <MaterialIcons name="palette" size={32} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Theme Settings
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Theme Mode
          </Text>

          <ThemeOption
            title="Light Theme"
            description="Bright and clean interface"
            themeMode="light"
            animValue={lightAnim}
            icon="sun-o"
          />

          <ThemeOption
            title="Dark Theme"
            description="Easy on the eyes, perfect for low light"
            themeMode="dark"
            animValue={darkAnim}
            icon="moon-o"
          />

          <ThemeOption
            title="Custom Theme"
            description="Personalize your colors"
            themeMode="custom"
            animValue={customAnim}
            icon="paint-brush"
          />
        </View>

        {mode === 'custom' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Customize Colors
            </Text>

            <TouchableOpacity
              style={[styles.colorOption, { backgroundColor: colors.surface }]}
              onPress={() => handleColorChange('primary')}
            >
              <View style={styles.colorOptionContent}>
                <View style={[styles.colorPreview, { backgroundColor: colors.primary }]} />
                <Text style={[styles.colorLabel, { color: colors.text }]}>Primary Color</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.colorOption, { backgroundColor: colors.surface }]}
              onPress={() => handleColorChange('accent')}
            >
              <View style={styles.colorOptionContent}>
                <View style={[styles.colorPreview, { backgroundColor: colors.accent }]} />
                <Text style={[styles.colorLabel, { color: colors.text }]}>Accent Color</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.colorOption, { backgroundColor: colors.surface }]}
              onPress={() => handleColorChange('secondary')}
            >
              <View style={styles.colorOptionContent}>
                <View style={[styles.colorPreview, { backgroundColor: colors.secondary }]} />
                <Text style={[styles.colorLabel, { color: colors.text }]}>Secondary Color</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Color Picker Modal */}
      <Modal
        visible={showColorPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowColorPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Choose Color
            </Text>

            <View style={styles.presetColors}>
              {PRESET_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.presetColor, { backgroundColor: color }]}
                  onPress={() => applyCustomColor(color)}
                />
              ))}
            </View>

            <View style={styles.customColorInput}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Custom Hex Color:
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.background, 
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                value={customColorValue}
                onChangeText={setCustomColorValue}
                placeholder="#1DB954"
                placeholderTextColor={colors.textSecondary}
              />
              <TouchableOpacity
                style={[styles.applyButton, { backgroundColor: colors.primary }]}
                onPress={() => applyCustomColor(customColorValue)}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.surface }]}
              onPress={() => setShowColorPicker(false)}
            >
              <Text style={[styles.closeButtonText, { color: colors.text }]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  themeOption: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  themeOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  themeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  themeDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
  colorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  colorOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  colorLabel: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    padding: 24,
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  presetColors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  presetColor: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  customColorInput: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  applyButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
  },
});