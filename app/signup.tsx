
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
      <View style={styles.logoRow}>
        <Image
          source={require("@/assets/images/spotify-logo.png")}
          style={styles.logo}
        />
        <Text style={styles.logoText}>Spotify</Text>
      </View>

      <TextInput
        placeholder="Email address"
        placeholderTextColor="#aaa"
        style={styles.input}
      />
      <TextInput
        placeholder="Full Name"
        placeholderTextColor="#aaa"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        style={styles.input}
      />

      {/* Date of Birth */}
      <View style={styles.dobRow}>
        <Text style={styles.dobLabel}>Date of Birth:</Text>
        <TextInput
          placeholder="DD"
          placeholderTextColor="#aaa"
          style={styles.dobInput}
          keyboardType="numeric"
          maxLength={2}
        />
        <Text style={styles.separator}>/</Text>
        <TextInput
          placeholder="MM"
          placeholderTextColor="#aaa"
          style={styles.dobInput}
          keyboardType="numeric"
          maxLength={2}
        />
        <Text style={styles.separator}>/</Text>
        <TextInput
          placeholder="YY"
          placeholderTextColor="#aaa"
          style={styles.dobInput}
          keyboardType="numeric"
          maxLength={2}
        />
      </View>


      {/* Gender Selection */}
      <View style={styles.genderRow}>
        <TouchableOpacity style={styles.radioContainer} onPress={() => setGender("male")}>
          <View style={[styles.radioCircle, gender === "male" && styles.selected]} />
          <Text style={styles.radioLabel}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.radioContainer} onPress={() => setGender("female")}>
          <View style={[styles.radioCircle, gender === "female" && styles.selected]} />
          <Text style={styles.radioLabel}>Female</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signupButton}>
        <Text style={styles.signupText}>Sign up</Text>
      </TouchableOpacity>

      {/* Divider */}
      <Text style={styles.divider} accessibilityRole="text">
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

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.loginText}> Log in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    backgroundColor: "#121212",
    color: "#fff",
    borderRadius: 6,
    paddingHorizontal: 15,
    paddingVertical: 12,
    width: "100%",
    marginBottom: 15,
  },
  label: {
    color: "#fff",
    alignSelf: "flex-start",
    marginBottom: 5,
    fontWeight: "600",
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
  signupButton: {
    backgroundColor: "#1DB954",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 30,
    marginTop: 10,
    width: "100%",
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
