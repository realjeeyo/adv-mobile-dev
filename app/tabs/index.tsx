import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const CARD_SMALL_WIDTH = (width - 48) / 2; // two columns with side padding & gap
const PICKED_CARD_HEIGHT = 150;

export default function IndexScreen(): JSX.Element {
  const navigation = useNavigation();
  const categories = ["All", "Music", "Podcasts"];
  const tiles = new Array(8).fill(0).map((_, i) => ({
    id: i,
    title: i === 5 ? "Liked Songs" : `Tile ${i + 1}`,
    subtitle: i === 0 ? "Artist" : "Playlist • jee",
    image: require("@/assets/images/playlist1.png") as any,
  }));

  const carousel = new Array(4).fill(0).map((_, i) => ({
    id: i,
    title: `Carousel ${i + 1}`,
    image: require("@/assets/images/playlist1.png") as any,
  }));

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Image
              source={require("@/assets/images/playlist1.png")}
              style={styles.avatar}
            />
          </TouchableOpacity>

          <View style={styles.headerActions}>
            {categories.map((c) => (
              <Pressable key={c} style={styles.pill}>
                <Text style={styles.pillText}>{c}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Top small tile grid (2 columns) */}
        <Text style={styles.sectionTitle}>Recents</Text>
        <View style={styles.grid}>
          {tiles.map((t) => (
            <View key={t.id} style={styles.smallCard}>
              <Image source={t.image} style={styles.smallImage} />
              <View style={styles.smallMeta}>
                <Text style={styles.smallTitle} numberOfLines={2}>
                  {t.title}
                </Text>
                <Text style={styles.smallSubtitle} numberOfLines={1}>
                  {t.subtitle}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Picked for you card */}
        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Picked for you</Text>
        <View style={styles.pickedCard}>
          <Image source={require("@/assets/images/playlist1.png")} style={styles.pickedImage} />
          <View style={styles.pickedMeta}>
            <Text style={styles.pickedLabel}>Playlist</Text>
            <Text style={styles.pickedTitle}>Today's Top Hits</Text>
            <Text style={styles.pickedDesc} numberOfLines={2}>
              The hottest 50. Cover: Sabrina Carpenter
            </Text>
            <View style={styles.pickedActions}>
              <TouchableOpacity style={styles.pickedCircle} accessibilityRole="button" accessibilityLabel="Add">
                <Ionicons name="add" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.pickedPlay} accessibilityRole="button" accessibilityLabel="Play">
                <Ionicons name="play" size={18} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Horizontal carousel */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Soundtrack your Thursday afternoon</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 12 }}>
          {carousel.map((c) => (
            <View key={c.id} style={styles.carouselItem}>
              <Image source={c.image} style={styles.carouselImage} />
              <Text style={styles.carouselTitle} numberOfLines={1}>
                {c.title}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Spacer so content isn't hidden under now-playing bar */}
        <View style={{ height: 96 }} />
      </ScrollView>

      {/* Now Playing bar */}
      <View style={styles.nowPlaying}>
        <Image source={require("@/assets/images/playlist1.png")} style={styles.nowImage} />
        <View style={styles.nowMeta}>
          <Text style={styles.nowTitle} numberOfLines={1}>
            Quite the Opposite
          </Text>
          <Text style={styles.nowSubtitle} numberOfLines={1}>
            Dominic Fike • Jee AP Pro
          </Text>
        </View>
        <View style={styles.nowControls}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Connect">
            <Ionicons name="bluetooth" size={20} color="#1DB954" />
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Pause" style={{ marginLeft: 12 }}>
            <Ionicons name="pause" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 999,
    marginRight: 12,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    flex: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 12,
  },

  pillsRow: {
    paddingVertical: 8,
    paddingBottom: 12,
  },
  pill: {
    backgroundColor: "#202020",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
  },
  pillText: {
    color: "#fff",
    fontWeight: "600",
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  smallCard: {
    width: CARD_SMALL_WIDTH,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#121212",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  smallImage: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginRight: 8,
  },
  smallMeta: {
    flex: 1,
  },
  smallTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  smallSubtitle: {
    color: "#9b9b9b",
    fontSize: 11,
  },

  pickedCard: {
    flexDirection: "row",
    backgroundColor: "#1b1b1b",
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    height: PICKED_CARD_HEIGHT,
  },
  pickedImage: {
    width: PICKED_CARD_HEIGHT,
    height: PICKED_CARD_HEIGHT,
  },
  pickedMeta: {
    flex: 1,
    padding: 14,
    justifyContent: "center",
  },
  pickedLabel: {
    color: "#9b9b9b",
    fontSize: 12,
    marginBottom: 4,
  },
  pickedTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  pickedDesc: {
    color: "#bdbdbd",
    marginTop: 6,
    fontSize: 12,
  },
  pickedActions: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  pickedCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#303030",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  pickedPlay: {
    width: 36,
    height: 36,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  carouselItem: {
    width: 160,
    marginRight: 12,
  },
  carouselImage: {
    width: 160,
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  carouselTitle: {
    color: "#fff",
    fontWeight: "700",
  },

  nowPlaying: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#2b2b2b",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    elevation: 10,
  },
  nowImage: {
    width: 44,
    height: 44,
    borderRadius: 6,
    marginRight: 10,
  },
  nowMeta: {
    flex: 1,
  },
  nowTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  nowSubtitle: {
    color: "#9b9b9b",
    fontSize: 11,
  },
  nowControls: {
    flexDirection: "row",
    alignItems: "center",
  },
});
