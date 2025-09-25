import { useTheme } from '@/hooks/useTheme';
import { store } from '@/store';
import { useAppDispatch } from '@/store/hooks';
import { loadThemeFromStorageAsync } from '@/store/themeSlice';
import { FontAwesome, Foundation, MaterialIcons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Provider } from 'react-redux';

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: colors.background }}>
      {/* Profile Header */}
      <TouchableOpacity
        style={[styles.header, { borderBottomColor: colors.border }]}
        onPress={() => router.push("/tabs/profile")}
      >
        <Image
          source={require("@/assets/images/playlist1.png")}
          style={styles.avatar}
        />
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Jio Delgado</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>View profile</Text>
        </View>
      </TouchableOpacity>

      {/* Drawer Items */}
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => router.push("/tabs")}
      >
        <Foundation name="home" size={20} color={colors.text} style={styles.icon} />
        <Text style={[styles.label, { color: colors.text }]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => router.push("/tabs/search")}
      >
        <MaterialIcons name="search" size={20} color={colors.text} style={styles.icon} />
        <Text style={[styles.label, { color: colors.text }]}>Search</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => router.push("/tabs/playlists")}
      >
        <FontAwesome name="music" size={20} color={colors.text} style={styles.icon} />
        <Text style={[styles.label, { color: colors.text }]}>Playlists</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

function AppContent() {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();

  useEffect(() => {
    dispatch(loadThemeFromStorageAsync());
  }, [dispatch]);

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: colors.background, width: 280 },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="index" options={{ drawerLabel: "Home", drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="login" options={{ drawerLabel: "Login", drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="signup" options={{ drawerLabel: "Signup", drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="tabs" options={{ drawerLabel: "Main" }} />
    </Drawer>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 24,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
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
    fontSize: 15,
  },
});
