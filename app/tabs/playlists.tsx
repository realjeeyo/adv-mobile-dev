import React, { useEffect, useReducer, useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import uuid from "react-native-uuid";
import * as ImagePicker from "expo-image-picker";

// Reducer for playlist state
function playlistReducer(state, action) {
  const { past, present, future } = state;

  switch (action.type) {
    case "ADD_PLAYLIST": {
      const newPresent = [...present, action.playlist];
      return { past: [...past, present], present: newPresent, future: [] };
    }
    case "REMOVE_PLAYLIST": {
      const newPresent = present.filter((_, i) => i !== action.index);
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
  const [state, dispatch] = useReducer(playlistReducer, initialState);

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Library</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowAddInput(!showAddInput)}>
            <Ionicons name="add" size={28} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
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
            placeholderTextColor="#999"
            style={styles.input}
            autoFocus
            onSubmitEditing={addPlaylist}
          />
          <TextInput
            value={playlistDescription}
            onChangeText={setPlaylistDescription}
            placeholder="Enter playlist description"
            placeholderTextColor="#999"
            style={styles.input}
          />

          <TouchableOpacity style={styles.addCoverButton} onPress={pickImage}>
            <Ionicons name="image" size={20} color="#1DB954" />
            <Text style={styles.addCoverText}>
              {coverUri ? "Change Cover" : "Add Cover Image"}
            </Text>
          </TouchableOpacity>
          {coverUri && <Image source={{ uri: coverUri }} style={styles.coverPreview} />}

          <TouchableOpacity style={styles.addButton} onPress={addPlaylist}>
            <Ionicons name="checkmark" size={24} color="#1DB954" />
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
            <Ionicons name="close" size={24} color="#999" />
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
                state.past.length === 0 && styles.disabledText,
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
                state.future.length === 0 && styles.disabledText,
              ]}
            >
              Redo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dispatch({ type: "CLEAR" })}>
            <Text style={styles.controlText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Recents Header */}
      <View style={styles.recentsHeader}>
        <Ionicons name="swap-vertical" size={18} color="#fff" />
        <Text style={styles.recentsText}>Recents</Text>
        <TouchableOpacity>
          <Ionicons name="apps" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Playlist List */}
      <ScrollView style={styles.playlistList} showsVerticalScrollIndicator={false}>
        {state.present.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="musical-notes-outline" size={48} color="#666" />
            <Text style={styles.emptyText}>No playlists yet</Text>
            <Text style={styles.emptySubtext}>Create your first playlist</Text>
          </View>
        ) : (
          state.present.map((playlist, index) => (
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
                    <Text style={styles.playlistName} numberOfLines={1}>
                      {playlist.name}
                    </Text>
                    <View style={styles.playlistMeta}>
                      <View style={styles.playlistType}>
                        <Ionicons name="musical-notes" size={12} color="#1DB954" />
                        <Text style={styles.playlistSubtext}>Playlist</Text>
                      </View>
                      <Text style={styles.playlistSubtext}> • You</Text>
                    </View>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            </Swipeable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", paddingTop: 50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", flex: 1 },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  icon: { marginLeft: 20 },
  tabsContainer: { paddingHorizontal: 16, marginBottom: 16 },
  tab: {
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeTab: { backgroundColor: "#1DB954" },
  tabText: { color: "#fff", fontSize: 14, fontWeight: "500" },
  activeTabText: { color: "#000", fontWeight: "600" },
  inputContainer: {
    flexDirection: "column",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#2a2a2a",
    color: "#fff",
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
  controlText: { color: "#1DB954", fontSize: 12, fontWeight: "500" },
  disabledText: { color: "#666" },
  recentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  recentsText: {
    color: "#fff",
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
  emptyText: { color: "#fff", fontSize: 18, fontWeight: "600", marginTop: 16 },
  emptySubtext: { color: "#999", fontSize: 14, marginTop: 4 },
  playlistItem: { marginBottom: 0 },
  playlistRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  playlistImage: {
    width: 56,
    height: 56,
    borderRadius: 4,
    marginRight: 12,
  },
  playlistInfo: { flex: 1, justifyContent: "center" },
  playlistName: { color: "#fff", fontSize: 16, fontWeight: "500", marginBottom: 4 },
  playlistMeta: { flexDirection: "row", alignItems: "center" },
  playlistType: { flexDirection: "row", alignItems: "center" },
  playlistSubtext: { color: "#b3b3b3", fontSize: 13, marginLeft: 4 },
  deleteButton: { padding: 8 },
  addCoverButton: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  addCoverText: { color: "#1DB954", marginLeft: 6, fontSize: 14 },
  coverPreview: { width: 60, height: 60, borderRadius: 6, marginTop: 8 },
});
