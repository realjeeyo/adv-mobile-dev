import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textSecondary: string;
  border: string;
  tabBarBackground: string;
  tabBarActive: string;
  tabBarInactive: string;
}

export interface ThemeState {
  mode: 'light' | 'dark' | 'custom';
  colors: ThemeColors;
  customColors: ThemeColors;
  isLoading: boolean;
}

// Predefined theme colors
export const lightTheme: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  primary: '#1DB954', // Spotify green
  secondary: '#1ED760',
  accent: '#FF6B35',
  text: '#000000',
  textSecondary: '#666666',
  border: '#E0E0E0',
  tabBarBackground: '#FFFFFF',
  tabBarActive: '#1DB954',
  tabBarInactive: '#666666',
};

export const darkTheme: ThemeColors = {
  background: '#121212', // Spotify dark
  surface: '#1E1E1E',
  primary: '#1DB954', // Spotify green
  secondary: '#1ED760',
  accent: '#FF6B35',
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  border: '#2E2E2E',
  tabBarBackground: '#121212',
  tabBarActive: '#1DB954',
  tabBarInactive: '#B3B3B3',
};

const initialState: ThemeState = {
  mode: 'dark', // Default to dark theme (Spotify style)
  colors: darkTheme,
  customColors: { ...darkTheme },
  isLoading: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<'light' | 'dark' | 'custom'>) => {
      state.mode = action.payload;
      switch (action.payload) {
        case 'light':
          state.colors = lightTheme;
          break;
        case 'dark':
          state.colors = darkTheme;
          break;
        case 'custom':
          state.colors = state.customColors;
          break;
      }
    },
    setCustomColor: (state, action: PayloadAction<{ key: keyof ThemeColors; color: string }>) => {
      const { key, color } = action.payload;
      state.customColors[key] = color;
      if (state.mode === 'custom') {
        state.colors[key] = color;
      }
    },
    setCustomTheme: (state, action: PayloadAction<Partial<ThemeColors>>) => {
      state.customColors = { ...state.customColors, ...action.payload };
      if (state.mode === 'custom') {
        state.colors = { ...state.colors, ...action.payload };
      }
    },
    setThemeLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    loadThemeFromStorage: (state, action: PayloadAction<ThemeState>) => {
      return { ...action.payload, isLoading: false };
    },
  },
});

export const {
  setThemeMode,
  setCustomColor,
  setCustomTheme,
  setThemeLoading,
  loadThemeFromStorage,
} = themeSlice.actions;

// Async thunk for saving theme to AsyncStorage
export const saveThemeToStorage = (themeState: ThemeState) => async () => {
  try {
    await AsyncStorage.setItem('theme', JSON.stringify(themeState));
  } catch (error) {
    console.error('Failed to save theme to storage:', error);
  }
};

// Async thunk for loading theme from AsyncStorage
export const loadThemeFromStorageAsync = () => async (dispatch: any) => {
  try {
    dispatch(setThemeLoading(true));
    const savedTheme = await AsyncStorage.getItem('theme');
    if (savedTheme) {
      const parsedTheme = JSON.parse(savedTheme);
      dispatch(loadThemeFromStorage(parsedTheme));
    } else {
      dispatch(setThemeLoading(false));
    }
  } catch (error) {
    console.error('Failed to load theme from storage:', error);
    dispatch(setThemeLoading(false));
  }
};

export default themeSlice.reducer;