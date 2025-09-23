import { useAppSelector } from '@/store/hooks';

export const useTheme = () => {
  const { colors, mode, isLoading } = useAppSelector((state) => state.theme);
  
  return {
    colors,
    mode,
    isLoading,
    isDark: mode === 'dark',
    isLight: mode === 'light',
    isCustom: mode === 'custom',
  };
};

export type UseThemeReturn = ReturnType<typeof useTheme>;