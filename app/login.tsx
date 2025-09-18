import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  // States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  // Animated values
  const usernameShake = useRef(new Animated.Value(0)).current;
  const passwordShake = useRef(new Animated.Value(0)).current;

  // Validation
  const validate = () => {
    let newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
      triggerShake(usernameShake);
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      triggerShake(passwordShake);
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      triggerShake(passwordShake);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Shake animation
  const triggerShake = (anim: Animated.Value) => {
    anim.setValue(0);
    Animated.sequence([
      Animated.timing(anim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = () => {
    if (validate()) {
      router.push("/tabs/");
    }
  };

  return (
    <LinearGradient
      colors={["#1E1E1E", "#000000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {/* Logo Section */}
        <View style={styles.logoContainer} accessible accessibilityLabel="Spotify logo">
          <Image
            source={require("@/assets/images/spotify-logo.png")}
            style={styles.logo}
            accessibilityIgnoresInvertColors
          />
          <Text style={styles.title} accessibilityRole="header">
            Spotify
          </Text>
        </View>

        {/* Username Field */}
        <Animated.View style={{ transform: [{ translateX: usernameShake }], width: "100%" }}>
          <TextInput
            placeholder="Username"
            placeholderTextColor="#999"
            style={[styles.input, errors.username && styles.inputError]}
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (text.trim()) setErrors((prev) => ({ ...prev, username: undefined }));
            }}
            accessibilityLabel="Enter your username"
          />
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
        </Animated.View>

        {/* Password Field */}
        <Animated.View style={{ transform: [{ translateX: passwordShake }], width: "100%" }}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            style={[styles.input, errors.password && styles.inputError]}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (text.length >= 6) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            accessibilityLabel="Enter your password"
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </Animated.View>

        {/* Forgot Password */}
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.buttonWrapper}
          accessibilityRole="button"
        >
          <LinearGradient
            colors={["#1DB954", "#4cff88"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.signInButton}
          >
            <Text style={styles.signInText}>Sign In</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Divider */}
        <Text style={styles.divider}>Be Correct With</Text>

        {/* Social Buttons */}
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialText}>f</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialText}>G</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.footer}>Don’t have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  logoContainer: { alignItems: "center", marginBottom: 40 },
  logo: { width: 80, height: 80, marginBottom: 10, resizeMode: "contain" },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  input: {
    width: "100%",
    backgroundColor: "#1E1E1E",
    color: "#fff",
    padding: 14,
    borderRadius: 100,
    marginBottom: 12,
    shadowColor: "#7d7d7d",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  inputError: {
    borderWidth: 1,
    borderColor: "#ff4d4d",
  },
  errorText: {
    color: "#ff4d4d",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 10,
    alignSelf: "flex-start",
  },
  forgotPassword: { alignSelf: "flex-end", color: "#777", fontSize: 12, marginBottom: 20 },
  buttonWrapper: { width: "100%", borderRadius: 30, overflow: "hidden", marginBottom: 20 },
  signInButton: { padding: 15, borderRadius: 30, alignItems: "center" },
  signInText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  divider: { color: "#1DB954", marginBottom: 20 },
  socialContainer: { flexDirection: "row", gap: 20, marginBottom: 30 },
  socialButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  socialText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  footer: { color: "#777", fontSize: 12 },
  link: { color: "#1DB954", fontWeight: "600" },
});
