import { useLocalSearchParams, useRouter } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

interface Song {
  id: string;
  song: string;
  author: string;
}

// Song Row Component
interface SongRowProps {
  song: Song;
  index: number;
  onDelete: (songId: string) => void;
}

function SongRow({ song, index, onDelete }: SongRowProps) {
  return (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity
          style={styles.swipeDelete}
          onPress={() => onDelete(song.id)}
        >
          <Ionicons name="trash" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    >
      <View style={styles.songRow}>
        <Image
          source={require("@/assets/images/playlist1.png")}
          style={styles.songImage}
        />
        <View style={styles.songInfo}>
          <Text style={styles.songTitle} numberOfLines={1}>
            {song.song}
          </Text>
          <Text style={styles.songArtist} numberOfLines={1}>
            {song.author}
          </Text>
        </View>
      </View>
    </Swipeable>
  );
}


// Add Song Modal Component
interface AddSongModalProps {
  visible: boolean;
  song: string;
  author: string;
  onSongChange: (text: string) => void;
  onAuthorChange: (text: string) => void;
  onAdd: () => void;
  onCancel: () => void;
}

function AddSongModal({ visible, song, author, onSongChange, onAuthorChange, onAdd, onCancel }: AddSongModalProps) {
  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Add Song</Text>

        <TextInput
          placeholder="Song name"
          value={song}
          onChangeText={onSongChange}
          style={styles.modalInput}
          placeholderTextColor="#888"
          autoFocus
        />

        <TextInput
          placeholder="Artist name"
          value={author}
          onChangeText={onAuthorChange}
          style={styles.modalInput}
          placeholderTextColor="#888"
        />

        <View style={styles.modalButtons}>
          <TouchableOpacity onPress={onCancel} style={styles.modalCancelButton}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onAdd} style={styles.modalAddButton}>
            <Text style={styles.modalAddText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function PlaylistDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [songs, setSongs] = useState<Song[]>([]);
  const [song, setSong] = useState("");
  const [author, setAuthor] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Load songs for this specific playlist
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const saved = await AsyncStorage.getItem(`playlist_${id}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Handle both object and array cases
          if (Array.isArray(parsed)) {
            setSongs(parsed);
          } else if (parsed && Array.isArray(parsed.songs)) {
            setSongs(parsed.songs);
            setPlaylistName(parsed.name || "");
            setPlaylistDescription(parsed.description || "");
            setCoverUri(parsed.coverUri || null);
          }
        }

        // Load playlist name from global state
        const playlistState = await AsyncStorage.getItem("playlistState");
        if (playlistState) {
          const state = JSON.parse(playlistState);
          const playlist = state.present?.find((p: any) => p.id === id);
          if (playlist) {
            setPlaylistName(playlist.name || "");
            setPlaylistDescription(playlist.description || "");
            setCoverUri(playlist.coverUri || null);
          }
        }

        setHasLoaded(true);
      } catch (error) {
        console.error("Error loading playlist data:", error);
        setHasLoaded(true);
      }
    })();
  }, [id]);


  // Save songs whenever they change
  useEffect(() => {
    if (!id || !hasLoaded) return;

    (async () => {
      try {
        await AsyncStorage.setItem(`playlist_${id}`, JSON.stringify(songs));
      } catch (error) {
        console.error("Error saving songs:", error);
      }
    })();
  }, [songs, id, hasLoaded]);

  const addSong = () => {
    if (!song.trim() || !author.trim()) return;

    const newSong: Song = {
      id: Date.now().toString(),
      song: song.trim(),
      author: author.trim(),
    };

    setSongs(prevSongs => [...prevSongs, newSong]);
    setSong("");
    setAuthor("");
    setShowAddModal(false);
  };

  const removeSong = (songId: string) => {
    setSongs(prevSongs => prevSongs.filter(s => s.id !== songId));
  };

  const formatDuration = (totalSongs: number) => {
    // Rough estimate: average 3 minutes per song
    const minutes = totalSongs * 3;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  if (!id) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No playlist ID provided</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView style={styles.scrollView}>
        {/* Header Section */}
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.headerGradient}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.headerContent}>
            <Image
              source={coverUri ? { uri: coverUri } : require("@/assets/images/playlist1.png")}
              style={styles.playlistCover}
            />

            <Text style={styles.playlistTitle}>
              {playlistName || "Untitled Playlist"}
            </Text>

            <Text style={styles.playlistDescription}>
              {playlistDescription || "No description yet"}
            </Text>


            <View style={styles.playlistMeta}>
              <Image
                source={require("@/assets/images/playlist1.png")}
                style={styles.creatorAvatar}
              />
              <Text style={styles.creatorName}>You</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.songCount}>
                {songs.length} song{songs.length !== 1 ? 's' : ''}
              </Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.duration}>
                {formatDuration(songs.length)}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Controls Section */}
        <View style={styles.controlsSection}>
          <View style={styles.playControls}>
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="heart-outline" size={24} color="#b3b3b3" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="download-outline" size={24} color="#b3b3b3" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="person-add-outline" size={24} color="#b3b3b3" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#b3b3b3" />
            </TouchableOpacity>

            <View style={styles.spacer} />

            <TouchableOpacity style={styles.shuffleButton}>
              <Ionicons name="shuffle" size={20} color="#b3b3b3" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={28} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowAddModal(true)}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="swap-vertical" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Sort</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="create" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Name & details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Songs List */}
        <View style={styles.songsSection}>
          {songs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="musical-notes-outline" size={64} color="#666" />
              <Text style={styles.emptyTitle}>No songs added yet</Text>
              <Text style={styles.emptySubtitle}>Tap "Add" to add your first song</Text>
            </View>
          ) : (
            songs.map((songItem, index) => (
              <SongRow
                key={songItem.id}
                song={songItem}
                index={index}
                onDelete={removeSong}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Song Modal */}
      <AddSongModal
        visible={showAddModal}
        song={song}
        author={author}
        onSongChange={setSong}
        onAuthorChange={setAuthor}
        onAdd={addSong}
        onCancel={() => {
          setShowAddModal(false);
          setSong("");
          setAuthor("");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTop: {
    marginBottom: 20,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
  },
  headerContent: {
    alignItems: "center",
  },
  playlistCover: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playlistTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  playlistDescription: {
    fontSize: 14,
    color: "#b3b3b3",
    marginBottom: 16,
  },
  playlistMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  creatorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  creatorName: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  metaDot: {
    fontSize: 14,
    color: "#b3b3b3",
    marginHorizontal: 6,
  },
  songCount: {
    fontSize: 14,
    color: "#b3b3b3",
  },
  duration: {
    fontSize: 14,
    color: "#b3b3b3",
  },
  controlsSection: {
    backgroundColor: "#121212",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  playControls: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  controlButton: {
    marginRight: 24,
  },
  spacer: {
    flex: 1,
  },
  shuffleButton: {
    marginRight: 16,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1DB954",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  songsSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  songImage: {
    width: 48,
    height: 48,
    borderRadius: 4,
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
    marginRight: 12,
  },
  songTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
    marginBottom: 2,
  },
  songArtist: {
    fontSize: 14,
    color: "#b3b3b3",
  },
  songMenu: {
    padding: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#b3b3b3",
    textAlign: "center",
  },
  errorText: {
    color: "#ff4d4d",
    fontSize: 16,
    textAlign: "center",
    marginTop: 100,
  },
  // Modal Styles
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 24,
    width: width * 0.85,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: "#404040",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCancelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  modalAddButton: {
    flex: 1,
    backgroundColor: "#1DB954",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  swipeDelete: {
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    borderRadius: 6,
    marginVertical: 4,
  },
  modalAddText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});