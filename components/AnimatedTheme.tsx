import { useTheme } from '@/hooks/useTheme';
import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

interface AnimatedThemeContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  animated?: boolean;
}

export const AnimatedThemeContainer: React.FC<AnimatedThemeContainerProps> = ({
  children,
  style,
  animated = true,
}) => {
  const { colors, mode } = useTheme();
  const animationProgress = useSharedValue(0);

  // Trigger animation when theme changes
  useEffect(() => {
    if (animated) {
      animationProgress.value = 0;
      animationProgress.value = withTiming(1, { duration: 500 });
    }
  }, [mode, animated]);

  const animatedStyle = useAnimatedStyle(() => {
    if (!animated) {
      return { backgroundColor: colors.background };
    }

    const backgroundColor = interpolateColor(
      animationProgress.value,
      [0, 1],
      [colors.background, colors.background] // This creates a smooth transition effect
    );

    return {
      backgroundColor,
      opacity: withTiming(1, { duration: 300 }),
    };
  });

  if (!animated) {
    return (
      <View style={[{ backgroundColor: colors.background }, style]}>
        {children}
      </View>
    );
  }

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

interface AnimatedThemeTextProps {
  children: React.ReactNode;
  style?: any;
  animated?: boolean;
  colorKey?: 'text' | 'textSecondary' | 'primary' | 'secondary' | 'accent';
}

export const AnimatedThemeText: React.FC<AnimatedThemeTextProps> = ({
  children,
  style,
  animated = true,
  colorKey = 'text',
}) => {
  const { colors, mode } = useTheme();
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      animationProgress.value = 0;
      animationProgress.value = withTiming(1, { duration: 400 });
    }
  }, [mode, animated]);

  const animatedStyle = useAnimatedStyle(() => {
    if (!animated) {
      return { color: colors[colorKey] };
    }

    const textColor = interpolateColor(
      animationProgress.value,
      [0, 1],
      [colors[colorKey], colors[colorKey]]
    );

    return {
      color: textColor,
    };
  });

  if (!animated) {
    return (
      <Animated.Text style={[{ color: colors[colorKey] }, style]}>
        {children}
      </Animated.Text>
    );
  }

  return (
    <Animated.Text style={[animatedStyle, style]}>
      {children}
    </Animated.Text>
  );
};

interface ThemeTransitionWrapperProps {
  children: React.ReactNode;
}

export const ThemeTransitionWrapper: React.FC<ThemeTransitionWrapperProps> = ({ children }) => {
  const { mode } = useTheme();
  const fadeAnim = useSharedValue(1);

  useEffect(() => {
    // Create a fade effect when theme changes
    fadeAnim.value = withTiming(0, { duration: 150 }, () => {
      fadeAnim.value = withTiming(1, { duration: 150 });
    });
  }, [mode]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      {children}
    </Animated.View>
  );
};