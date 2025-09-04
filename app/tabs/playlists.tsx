import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_SIZE = (width - 60) / 3; // 3 columns with spacing

export default function YourLibrary() {
  const categories = ["Albums", "Artists", "Downloaded"];

  const items = [
    { title: "Jeremy Zucker", subtitle: "Artist", image: require("@/assets/images/playlist1.png") },
    { title: "limerence.", subtitle: "Playlist • jee", image: require("@/assets/images/playlist1.png") },
    { title: "senti.", subtitle: "Playlist • jee", image: require("@/assets/images/playlist1.png") },
    { title: "hello, you.", subtitle: "Playlist • rob", image: require("@/assets/images/playlist1.png") },
    { title: "soft.", subtitle: "Playlist • jee", image: require("@/assets/images/playlist1.png") },
    { title: "Liked Songs", subtitle: "Playlist • 37 songs", image: require("@/assets/images/playlist1.png") },
    { title: "Daniel Caesar Mix", subtitle: "Playlist", image: require("@/assets/images/playlist1.png") },
    { title: "Garden State", subtitle: "Album • Jeremy Z", image: require("@/assets/images/playlist1.png") },
    { title: "Passion fruit vibes", subtitle: "Playlist • KPF", image: require("@/assets/images/playlist1.png") },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/playlist1.png")}
          style={styles.avatar}
        />
        <Text style={styles.title}>Your Library</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="search" size={24} color="#fff" style={styles.icon} />
          <Ionicons name="add" size={28} color="#fff" style={styles.icon} />
        </View>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categories}
      >
        {categories.map((cat, i) => (
          <TouchableOpacity key={i} style={styles.categoryButton}>
            <Text style={styles.categoryText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Recents Grid */}
      <ScrollView>
        <Text style={styles.sectionTitle}>Recents</Text>
        <View style={styles.grid}>
          {items.map((item, i) => (
            <View key={i} style={styles.card}>
              <Image source={item.image} style={styles.cardImage} />
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.cardSubtitle} numberOfLines={1}>
                {item.subtitle}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Spotify dark background
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  headerIcons: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 15,
  },
  categories: {
    marginBottom: 15,
  },
  categoryButton: {
    backgroundColor: "#2a2a2a",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    height: 35,
  },
  categoryText: {
    color: "#fff",
    fontSize: 14,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: CARD_SIZE,
    marginBottom: 20,
  },
  cardImage: {
    width: CARD_SIZE,
    height: CARD_SIZE, // makes it square
    borderRadius: 8,
    marginBottom: 6,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardSubtitle: {
    color: "#aaa",
    fontSize: 11,
  },
});
