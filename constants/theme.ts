/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  // Brand colors
  text: '#f0ecea',
  background: '#120f0d',
  primary: '#c0b1aa',
  secondary: '#5c5942',
  accent: '#a2a181',

  // Derived colors for convenience
  primaryLight: '#d4c9c3',
  textPrimary: '#f0ecea',
  textSecondary: '#c0b1aa',
  textLight: '#a2a181',
  textWhite: '#fff',

  // Background variations
  backgroundDark: '#0a0807',
  overlay: 'rgba(18, 15, 13, 0.8)',

  // UI colors
  border: '#5c5942',
  shadow: '#000',
  disabled: '#2a2621',

  light: {
    text: '#f0ecea',
    background: '#120f0d',
    tint: tintColorLight,
    icon: '#a2a181',
    tabIconDefault: '#a2a181',
    tabIconSelected: '#c0b1aa',
  },
  dark: {
    text: '#f0ecea',
    background: '#120f0d',
    tint: tintColorDark,
    icon: '#a2a181',
    tabIconDefault: '#a2a181',
    tabIconSelected: '#c0b1aa',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'Inter_400Regular',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'PlayfairDisplay_400Regular',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'Inter_400Regular',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'JetBrainsMono_400Regular',
    display: 'PlayfairDisplay_700Bold'
  },
  default: {
    sans: 'Inter_400Regular',
    serif: 'PlayfairDisplay_400Regular',
    rounded: 'Inter_400Regular',
    mono: 'JetBrainsMono_400Regular',
    display: 'PlayfairDisplay_700Bold'
  },
  web: {
    sans: 'Inter_400Regular',
    serif: 'PlayfairDisplay_400Regular',
    rounded: 'Inter_400Regular',
    mono: 'JetBrainsMono_400Regular',
  },
});

// Spacing system
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

// Border radius
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};

// Font sizes
export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 70,
};

// Common shadow styles
export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
};
