import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Foundation, MaterialIcons, FontAwesome } from "@expo/vector-icons";

function CustomDrawerContent(props: any) {
  const router = useRouter();

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: "#121212" }}>
      {/* Profile Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => router.push("/tabs/profile")}
      >
        <Image
          source={require("@/assets/images/playlist1.png")}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.title}>Jio Delgado</Text>
          <Text style={styles.subtitle}>View profile</Text>
        </View>
      </TouchableOpacity>

      {/* Drawer Items */}
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => router.push("/tabs")}
      >
        <Foundation name="home" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => router.push("/tabs/search")}
      >
        <MaterialIcons name="history" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.label}>Recents</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => router.push("/tabs/playlists")}
      >
        <FontAwesome name="music" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.label}>Playlists</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

export default function RootLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: "#121212", width: 280 },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="tabs" options={{ drawerLabel: "Main" }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 24,
    marginRight: 12,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#aaa",
    fontSize: 12,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 16,
  },
  label: {
    color: "#fff",
    fontSize: 15,
  },
});
