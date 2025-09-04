import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <Ionicons name="share-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileInfo}>
        <Image
          source={require("@/assets/images/spotify-logo.png")} // replace with your avatar
          style={styles.avatar}
        />
        <Text style={styles.username}>Jio Delgado</Text>
        <Text style={styles.email}>jra.ldelgado@gmail.com</Text>
        <Text style={styles.userTag}>Premium Account</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>124</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>98</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {/* Section: Playlists */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Playlists</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.playlistCard}>
            <Image
              source={require("@/assets/images/spotify-logo.png")}
              style={styles.playlistImage}
            />
            <Text style={styles.playlistName}>My Favorites</Text>
          </View>
          <View style={styles.playlistCard}>
            <Image
              source={require("@/assets/images/spotify-logo.png")}
              style={styles.playlistImage}
            />
            <Text style={styles.playlistName}>Chill Vibes</Text>
          </View>
          <View style={styles.playlistCard}>
            <Image
              source={require("@/assets/images/spotify-logo.png")}
              style={styles.playlistImage}
            />
            <Text style={styles.playlistName}>Workout</Text>
          </View>
        </ScrollView>
      </View>

      {/* Section: Recently Played */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently Played</Text>
        <View style={styles.recentItem}>
          <Image
            source={require("@/assets/images/spotify-logo.png")}
            style={styles.recentImage}
          />
          <Text style={styles.recentText}>Blinding Lights - The Weeknd</Text>
        </View>
        <View style={styles.recentItem}>
          <Image
            source={require("@/assets/images/spotify-logo.png")}
            style={styles.recentImage}
          />
          <Text style={styles.recentText}>Shape of You - Ed Sheeran</Text>
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
  profileInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 10,
  },
  username: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  email: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 10,
  },
  userTag: {
    color: "#aaa",
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 50,
    marginBottom: 30,
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#aaa",
    fontSize: 12,
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
    marginRight: 15,
    alignItems: "center",
  },
  playlistImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 5,
  },
  playlistName: {
    color: "#fff",
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
