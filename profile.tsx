import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming, // Add this
} from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";

// Predefined genres
const GENRES = ["Pop", "Rock", "Jazz", "Classical", "Hip-Hop"];

const validateUsername = (username: string) =>
  /^[a-zA-Z0-9_]{3,20}$/.test(username);
const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("jee");
  const [email, setEmail] = useState("jee@gmail.com");
  const [genre, setGenre] = useState("Pop");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [playlists, setPlaylists] = useState<
    { id: string; name: string; cover: string }[]
  >([]);

  // Individual shake animations for each input
  const usernameShake = useSharedValue(0);
  const emailShake = useSharedValue(0);
  const genreShake = useSharedValue(0);

  const usernameShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: usernameShake.value }],
  }));

  const emailShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: emailShake.value }],
  }));

  const genreShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: genreShake.value }],
  }));

  // Helper function to trigger shake animation
  const triggerShake = (shakeValue: Animated.SharedValue<number>) => {
    shakeValue.value = withSequence(
      withTiming(-10, { duration: 80 }),
      withTiming(10, { duration: 80 }),
      withTiming(-6, { duration: 60 }),
      withTiming(0, { duration: 60 })
    );
  };

  // Load profile + playlists from storage
  useEffect(() => {
    const loadCache = async () => {
      const cached = await AsyncStorage.getItem("profileForm");
      if (cached) {
        const data = JSON.parse(cached);
        setUsername(data.username || username);
        setEmail(data.email || email);
        setGenre(data.genre || genre);
        setProfileImage(data.profileImage || null);
      }

      const savedPlaylists = await AsyncStorage.getItem("playlists");
      if (savedPlaylists) {
        setPlaylists(JSON.parse(savedPlaylists));
      }
    };
    loadCache();
  }, []);

  // Save profile cache
  useEffect(() => {
    AsyncStorage.setItem(
      "profileForm",
      JSON.stringify({ username, email, genre, profileImage })
    );
  }, [username, email, genre, profileImage]);

  // Pick profile picture
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    if (!validateUsername(username)) {
      newErrors.username =
        "Username must be 3–20 characters, alphanumeric or underscores.";
    }
    if (!validateEmail(email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!GENRES.includes(genre)) {
      newErrors.genre = "Please select a valid genre.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [username, email, genre]);

  const handleSubmit = async () => {
    // Validate each field individually and collect errors
    const newErrors: { [key: string]: string } = {};
    const isUsernameValid = validateUsername(username);
    const isEmailValid = validateEmail(email);
    const isGenreValid = GENRES.includes(genre);

    if (!isUsernameValid) {
      newErrors.username = "Username must be 3–20 characters, alphanumeric or underscores.";
    }
    if (!isEmailValid) {
      newErrors.email = "Invalid email format.";
    }
    if (!isGenreValid) {
      newErrors.genre = "Please select a valid genre.";
    }

    setErrors(newErrors);

    // If all valid, save and exit edit mode
    if (Object.keys(newErrors).length === 0) {
      await AsyncStorage.removeItem("profileForm");
      setIsEditing(false);
    } else {
      // Trigger shake animation only for invalid fields
      if (!isUsernameValid) {
        triggerShake(usernameShake);
      }
      if (!isEmailValid) {
        triggerShake(emailShake);
      }
      if (!isGenreValid) {
        triggerShake(genreShake);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <Ionicons name="share-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileRow}>
        <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
          <Image
            source={{
              uri: profileImage || `https://via.placeholder.com/100?text=${genre}`,
            }}
            style={styles.avatar}
          />
          {/* Camera icon overlay */}
          <View style={styles.cameraIconWrapper}>
            <Ionicons name="camera" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={styles.profileText}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.userTag}>Favorite Genre: {genre}</Text>
        </View>
      </View>

      {/* Edit Button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setIsEditing(!isEditing)}
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>

      {/* Edit Form */}
      {isEditing && (
        <View style={styles.formContainer}>
          {/* Username Input */}
          <Animated.View style={usernameShakeStyle}>
            <TextInput
              style={[
                styles.input,
                errors.username && styles.inputError
              ]}
              placeholder="Username"
              placeholderTextColor="#888"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                // Clear error when user starts typing
                if (errors.username) {
                  setErrors(prev => ({ ...prev, username: '' }));
                }
              }}
            />
            {errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}
          </Animated.View>

          {/* Email Input */}
          <Animated.View style={emailShakeStyle}>
            <TextInput
              style={[
                styles.input,
                errors.email && styles.inputError
              ]}
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              keyboardType="email-address"
              onChangeText={(text) => {
                setEmail(text);
                // Clear error when user starts typing
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: '' }));
                }
              }}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </Animated.View>

          {/* Genre Selection */}
          <Animated.View style={genreShakeStyle}>
            <View style={[
              styles.genreContainer,
              errors.genre && styles.genreContainerError
            ]}>
              {GENRES.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.genreButton,
                    genre === g && styles.genreButtonSelected,
                  ]}
                  onPress={() => {
                    setGenre(g);
                    // Clear error when user selects
                    if (errors.genre) {
                      setErrors(prev => ({ ...prev, genre: '' }));
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.genreText,
                      genre === g && styles.genreTextSelected,
                    ]}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.genre && (
              <Text style={styles.errorText}>{errors.genre}</Text>
            )}
          </Animated.View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Playlists Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Playlists</Text>
        {playlists.length === 0 ? (
          <Text style={styles.emptyText}>No playlists yet</Text>
        ) : (
          playlists.map((playlist) => (
            <View key={playlist.id} style={styles.playlistCard}>
              <Image
                source={{ uri: playlist.cover }}
                style={styles.playlistImage}
              />
              <Text style={styles.playlistName}>{playlist.name}</Text>
            </View>
          ))
        )}
      </View>

      {/* Recently Played Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently Played</Text>
        <View style={styles.recentItem}>
          <Image
            source={{ uri: "https://via.placeholder.com/50" }}
            style={styles.recentImage}
          />
          <Text style={styles.recentText}>Blinding Lights - The Weeknd</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 50,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  avatarWrapper: {
    position: "relative",
  },
  cameraIconWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 5,
  },
  profileText: {
    marginLeft: 15,
  },
  username: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  email: {
    color: "#aaa",
    fontSize: 14,
  },
  userTag: {
    color: "#aaa",
    fontSize: 14,
  },
  editButton: {
    alignSelf: "flex-start",
    backgroundColor: "#1db954",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  formContainer: {
    marginVertical: 20,
  },
  input: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputError: {
    borderColor: "#ff4444",
    borderWidth: 1,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 4,
  },
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    borderRadius: 8,
    padding: 4,
  },
  genreContainerError: {
    borderWidth: 1,
    borderColor: "#ff4444",
  },
  genreButton: {
    backgroundColor: "#1e1e1e",
    padding: 12,
    borderRadius: 20,
    margin: 5,
  },
  genreButtonSelected: {
    backgroundColor: "#1db954",
  },
  genreText: {
    color: "#fff",
  },
  genreTextSelected: {
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#1db954",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  playlistCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  playlistImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  playlistName: {
    color: "#fff",
    fontSize: 16,
  },
  emptyText: {
    color: "#aaa",
    fontSize: 14,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  recentImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  recentText: {
    color: "#fff",
    fontSize: 14,
  },
});