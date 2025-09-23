import { ThemeTransitionWrapper } from "@/components/AnimatedTheme";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useReducer, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import uuid from "react-native-uuid";

// Reducer for playlist state
function playlistReducer(state: any, action: any) {
  const { past, present, future } = state;

  switch (action.type) {
    case "ADD_PLAYLIST": {
      const newPresent = [...present, action.playlist];
      return { past: [...past, present], present: newPresent, future: [] };
    }
    case "REMOVE_PLAYLIST": {
      const newPresent = present.filter((_: any, i: number) => i !== action.index);
      return { past: [...past, present], present: newPresent, future: [] };
    }
    case "CLEAR": {
      return { past: [...past, present], present: [], future: [] };
    }
    case "UNDO": {
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, -1);
      return { past: newPast, present: previous, future: [present, ...future] };
    }
    case "REDO": {
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return { past: [...past, present], present: next, future: newFuture };
    }
    case "LOAD": {
      return action.state;
    }
    default:
      return state;
  }
}

const initialState = { past: [], present: [], future: [] };

export default function YourLibrary() {
  const router = useRouter();
  const { colors, mode } = useTheme();
  const [state, dispatch] = useReducer(playlistReducer, initialState);

  // Debug: Log current theme colors
  // console.log('Playlists Theme Mode:', mode, 'Colors:', colors);

  // FIXED: separate useState for name + description
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [coverUri, setCoverUri] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("Playlists");
  const [showAddInput, setShowAddInput] = useState(false);

  // Load persisted state
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("playlistState");
      if (saved) {
        dispatch({ type: "LOAD", state: JSON.parse(saved) });
      }
    })();
  }, []);

  // Persist state whenever it changes
  useEffect(() => {
    AsyncStorage.setItem("playlistState", JSON.stringify(state));
  }, [state]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setCoverUri(result.assets[0].uri);
    }
  };

  const addPlaylist = () => {
    if (playlistName.trim() === "") return;
    const newPlaylist = {
      id: uuid.v4(),
      name: playlistName.trim(),
      description: playlistDescription.trim() || "No description yet",
      coverUri: coverUri || null,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_PLAYLIST", playlist: newPlaylist });
    setPlaylistName("");
    setPlaylistDescription("");
    setCoverUri(null);
    setShowAddInput(false);
  };

  const tabs = ["Playlists", "Albums", "Artists", "Downloaded"];

  return (
    <ThemeTransitionWrapper>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Your Library</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color={colors.text} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowAddInput(!showAddInput)}>
            <Ionicons name="add" size={28} color={colors.text} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                { backgroundColor: colors.surface },
                activeTab === tab && { backgroundColor: colors.primary }
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: colors.text },
                  activeTab === tab && { color: '#000' },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Add Playlist Input */}
      {showAddInput && (
        <Animated.View entering={FadeInRight} style={styles.inputContainer}>
          <TextInput
            value={playlistName}
            onChangeText={setPlaylistName}
            placeholder="Enter playlist name"
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
            autoFocus
            onSubmitEditing={addPlaylist}
          />
          <TextInput
            value={playlistDescription}
            onChangeText={setPlaylistDescription}
            placeholder="Enter playlist description"
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          />

          <TouchableOpacity style={styles.addCoverButton} onPress={pickImage}>
            <Ionicons name="image" size={20} color={colors.primary} />
            <Text style={[styles.addCoverText, { color: colors.primary }]}>
              {coverUri ? "Change Cover" : "Add Cover Image"}
            </Text>
          </TouchableOpacity>
          {coverUri && <Image source={{ uri: coverUri }} style={styles.coverPreview} />}

          <TouchableOpacity style={styles.addButton} onPress={addPlaylist}>
            <Ionicons name="checkmark" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setShowAddInput(false);
              setPlaylistName("");
              setPlaylistDescription("");
              setCoverUri(null);
            }}
          >
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Undo/Redo controls */}
      {state.past.length > 0 || state.future.length > 0 ? (
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={() => dispatch({ type: "UNDO" })}
            disabled={state.past.length === 0}
          >
            <Text
              style={[
                styles.controlText,
                { color: colors.primary },
                state.past.length === 0 && { color: colors.border },
              ]}
            >
              Undo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => dispatch({ type: "REDO" })}
            disabled={state.future.length === 0}
          >
            <Text
              style={[
                styles.controlText,
                { color: colors.primary },
                state.future.length === 0 && { color: colors.border },
              ]}
            >
              Redo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dispatch({ type: "CLEAR" })}>
            <Text style={[styles.controlText, { color: colors.primary }]}>Clear All</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Recents Header */}
      <View style={styles.recentsHeader}>
        <Ionicons name="swap-vertical" size={18} color={colors.text} />
        <Text style={[styles.recentsText, { color: colors.text }]}>Recents</Text>
        <TouchableOpacity>
          <Ionicons name="apps" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Playlist List */}
      <ScrollView style={styles.playlistList} showsVerticalScrollIndicator={false}>
        {state.present.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="musical-notes-outline" size={48} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.text }]}>No playlists yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Create your first playlist</Text>
          </View>
        ) : (
          state.present.map((playlist: any, index: number) => (
            <Swipeable
              key={playlist.id}
              renderRightActions={() => (
                <TouchableOpacity
                  style={styles.swipeDelete}
                  onPress={() => dispatch({ type: "REMOVE_PLAYLIST", index })}
                >
                  <Ionicons name="trash" size={24} color="#fff" />
                </TouchableOpacity>
              )}
            >
              <TouchableOpacity
                onPress={() => router.push(`/playlist/${playlist.id}`)}
                style={styles.playlistItem}
                activeOpacity={0.7}
              >
                <Animated.View
                  entering={FadeInRight.delay(index * 50)}
                  exiting={FadeOutLeft}
                  style={styles.playlistRow}
                >
                  <Image
                    source={
                      playlist.coverUri
                        ? { uri: playlist.coverUri }
                        : require("@/assets/images/playlist1.png")
                    }
                    style={styles.playlistImage}
                  />
                  <View style={styles.playlistInfo}>
                    <Text style={[styles.playlistName, { color: colors.text }]} numberOfLines={1}>
                      {playlist.name}
                    </Text>
                    <View style={styles.playlistMeta}>
                      <View style={styles.playlistType}>
                        <Ionicons name="musical-notes" size={12} color={colors.primary} />
                        <Text style={[styles.playlistSubtext, { color: colors.textSecondary }]}>Playlist</Text>
                      </View>
                      <Text style={[styles.playlistSubtext, { color: colors.textSecondary }]}> • You</Text>
                    </View>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            </Swipeable>
          ))
        )}
      </ScrollView>
      </View>
    </ThemeTransitionWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", flex: 1 },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  icon: { marginLeft: 20 },
  tabsContainer: { paddingHorizontal: 16, marginBottom: 16 },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeTab: { backgroundColor: "#1DB954" },
  tabText: { fontSize: 14, fontWeight: "500" },
  activeTabText: { color: "#000", fontWeight: "600" },
  inputContainer: {
    flexDirection: "column",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 8,
  },
  swipeDelete: {
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    borderRadius: 6,
    marginVertical: 8,
  },
  addButton: { marginTop: 8, padding: 8 },
  cancelButton: { marginTop: 4, padding: 8 },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  controlText: { fontSize: 12, fontWeight: "500" },
  disabledText: { color: "#666" },
  recentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  recentsText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
    flex: 1,
  },
  playlistList: { flex: 1, paddingHorizontal: 16 },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: { fontSize: 14, fontWeight: "600", marginTop: 16 },
  emptySubtext: { fontSize: 14, marginTop: 4 },
  playlistItem: { marginBottom: 0 },
  playlistRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  playlistImage: {
    width: 56,
    height: 56,
    borderRadius: 4,
    marginRight: 12,
  },
  playlistInfo: { flex: 1, justifyContent: "center" },
  playlistName: { fontSize: 16, fontWeight: "500", marginBottom: 4 },
  playlistMeta: { flexDirection: "row", alignItems: "center" },
  playlistType: { flexDirection: "row", alignItems: "center" },
  playlistSubtext: { fontSize: 13, marginLeft: 4 },
  deleteButton: { padding: 8 },
  addCoverButton: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  addCoverText: { marginLeft: 6, fontSize: 14 },
  coverPreview: { width: 60, height: 60, borderRadius: 6, marginTop: 8 },
});
