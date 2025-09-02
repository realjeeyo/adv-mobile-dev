import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";

export default function SignUpScreen() {
  const router = useRouter();
  const [gender, setGender] = useState<string | null>(null);

  return (
    <LinearGradient
      colors={["#1E1E1E", "#000000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Logo Row */}
        <View
          style={styles.logoRow}
          accessible
          accessibilityRole="image"
          accessibilityLabel="Spotify logo"
        >
          <Image
            source={require("@/assets/images/spotify-logo.png")}
            style={styles.logo}
            accessibilityIgnoresInvertColors
          />
          <Text style={styles.logoText}>Spotify</Text>
        </View>

        {/* Input Fields */}
        <TextInput
          placeholder="Email address"
          placeholderTextColor="#aaa"
          style={styles.input}
          accessibilityLabel="Email address input field"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#aaa"
          style={styles.input}
          accessibilityLabel="Full name input field"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          style={styles.input}
          accessibilityLabel="Password input field"
        />

        {/* Date of Birth */}
        <View
          style={styles.dobRow}
          accessible
          accessibilityLabel="Enter your date of birth"
        >
          <Text style={styles.dobLabel}>Date of Birth:</Text>
          <TextInput
            placeholder="DD"
            placeholderTextColor="#aaa"
            style={styles.dobInput}
            keyboardType="numeric"
            maxLength={2}
            accessibilityLabel="Day of birth"
          />
          <Text style={styles.separator}>/</Text>
          <TextInput
            placeholder="MM"
            placeholderTextColor="#aaa"
            style={styles.dobInput}
            keyboardType="numeric"
            maxLength={2}
            accessibilityLabel="Month of birth"
          />
          <Text style={styles.separator}>/</Text>
          <TextInput
            placeholder="YY"
            placeholderTextColor="#aaa"
            style={styles.dobInput}
            keyboardType="numeric"
            maxLength={2}
            accessibilityLabel="Year of birth"
          />
        </View>

        {/* Gender Selection */}
        <View style={styles.genderRow} accessible accessibilityLabel="Select your gender">
          <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => setGender("male")}
            accessibilityRole="radio"
            accessibilityState={{ selected: gender === "male" }}
            accessibilityLabel="Male"
          >
            <View style={[styles.radioCircle, gender === "male" && styles.selected]} />
            <Text style={styles.radioLabel}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => setGender("female")}
            accessibilityRole="radio"
            accessibilityState={{ selected: gender === "female" }}
            accessibilityLabel="Female"
          >
            <View style={[styles.radioCircle, gender === "female" && styles.selected]} />
            <Text style={styles.radioLabel}>Female</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Button with Gradient */}
        <TouchableOpacity
          style={styles.buttonWrapper}
          accessibilityRole="button"
          accessibilityLabel="Sign up for a new account"
          onPress={() => alert("Sign Up pressed")}
        >
          <LinearGradient
            colors={["#1DB954", "#4cff88"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.signupButton}
          >
            <Text style={styles.signupText}>Sign Up</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Divider */}
        <Text
          style={styles.divider}
          accessibilityRole="text"
        >
          Sign Up With
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
        <View style={styles.footer} accessible accessibilityLabel="Already have an account? Log in">
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => router.push("/")}
            accessibilityRole="button"
            accessibilityLabel="Log in to your account"
          >
            <Text style={styles.loginText}> Log in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 10,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  input: {
    width: "100%",
    backgroundColor: "#1E1E1E",
    color: "#fff",
    padding: 14,
    borderRadius: 100,
    marginBottom: 24,
    shadowColor: "#7d7d7d",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  dobRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  dobLabel: {
    color: "#1DB954",
    marginRight: 10,
    fontWeight: "600",
  },
  dobInput: {
    backgroundColor: "#121212",
    color: "#fff",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: 50,
    textAlign: "center",
  },
  separator: {
    color: "#fff",
    marginHorizontal: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  genderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#1DB954",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  selected: {
    backgroundColor: "#1DB954",
  },
  radioLabel: {
    color: "#fff",
  },
  buttonWrapper: {
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 20,
  },
  signupButton: {
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  signupText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  divider: {
    color: "#1DB954",
    marginBottom: 20,
    marginTop: 15,
  },
  socialContainer: {
    flexDirection: "row",
    gap: 20,
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
    flexDirection: "row",
    marginTop: 30,
  },
  footerText: {
    color: "#aaa",
  },
  loginText: {
    color: "#1DB954",
    fontWeight: "bold",
  },
});
