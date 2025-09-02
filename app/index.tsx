import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function LoginScreen() {
  const router = useRouter();

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
          <Text style={styles.title}>Spotify</Text>
        </View>

        {/* Input Fields */}
        <TextInput
          placeholder="Username"
          placeholderTextColor="#999"
          style={styles.input}
          accessibilityLabel="Username input field"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
          accessibilityLabel="Password input field"
        />

        {/* Forgot Password */}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Forgot password. Tap to recover account"
        >
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Sign In Button with Gradient */}
        <TouchableOpacity
          onPress={() => router.push("/tabs/")}
          style={styles.buttonWrapper}
          accessibilityRole="button"
          accessibilityLabel="Sign in"
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
        <Text style={styles.divider} accessibilityRole="text">
          Be Correct With
        </Text>

        {/* Social Login Buttons */}
        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={styles.socialButton}
            accessibilityRole="button"
            accessibilityLabel="Continue with Facebook"
          >
            <Text style={styles.socialText}>f</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
          >
            <Text style={styles.socialText}>G</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.footer}>Don’t have an account? </Text>
          <TouchableOpacity
            onPress={() => {
              router.push("/signup");
            }}
            accessibilityRole="button"
            accessibilityLabel="Sign up for a new account"
          >
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  input: {
    width: "100%",
    backgroundColor: "#1E1E1E",
    color: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    borderRadius: 100,

    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#7d7d7d",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#777",
    fontSize: 12,
    marginBottom: 20,
  },
  buttonWrapper: {
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 20,
  },
  signInButton: {
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  signInText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  divider: {
    color: "#1DB954",
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 30,
  },
  socialButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  socialText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    color: "#777",
    fontSize: 12,
  },
  link: {
    color: "#1DB954",
    fontWeight: "600",
  },
});
