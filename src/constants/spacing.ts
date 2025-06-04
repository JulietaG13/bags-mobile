import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const Spacing = {
  // Base unit (8px grid system)
  unit: 8,

  // Spacing scale
  xs: 4,    // 0.5 units
  sm: 8,    // 1 unit
  md: 16,   // 2 units
  lg: 24,   // 3 units
  xl: 32,   // 4 units
  '2xl': 40, // 5 units
  '3xl': 48, // 6 units
  '4xl': 64, // 8 units
  '5xl': 80, // 10 units

  // Component specific spacing
  component: {
    // Button padding
    buttonSmall: { vertical: 8, horizontal: 16 },
    buttonMedium: { vertical: 12, horizontal: 20 },
    buttonLarge: { vertical: 16, horizontal: 24 },

    // Input padding
    inputSmall: { vertical: 8, horizontal: 12 },
    inputMedium: { vertical: 12, horizontal: 16 },
    inputLarge: { vertical: 16, horizontal: 20 },

    // Card padding
    cardSmall: 12,
    cardMedium: 16,
    cardLarge: 20,

    // Container padding
    containerSmall: 16,
    containerMedium: 20,
    containerLarge: 24,

    // Section spacing
    sectionSmall: 16,
    sectionMedium: 24,
    sectionLarge: 32,
  },

  // Screen margins
  screen: {
    horizontal: 20,  // Default horizontal margin for screens
    vertical: 24,    // Default vertical margin for screens
    top: 44,         // Top safe area (status bar)
    bottom: 34,      // Bottom safe area (home indicator)
  },

  // List item spacing
  list: {
    itemPadding: 16,
    itemGap: 8,
    sectionGap: 24,
  },
} as const;

// Layout constants
export const Layout = {
  // Screen dimensions (dynamic based on device)
  window: {
    width: screenWidth,
    height: screenHeight,
  },

  // Component dimensions
  component: {
    // Button heights
    buttonSmall: 32,
    buttonMedium: 44,
    buttonLarge: 52,

    // Input heights
    inputSmall: 32,
    inputMedium: 44,
    inputLarge: 52,

    // Header height
    header: 56,

    // Tab bar height
    tabBar: 60,

    // Card minimum height
    cardSmall: 80,
    cardMedium: 120,
    cardLarge: 160,

    // Avatar sizes
    avatarSmall: 32,
    avatarMedium: 48,
    avatarLarge: 64,
    avatarXLarge: 80,

    // Icon sizes
    iconSmall: 16,
    iconMedium: 24,
    iconLarge: 32,
    iconXLarge: 48,

    // Border radius
    radiusSmall: 8,
    radiusMedium: 12,
    radiusLarge: 16,
    radiusXLarge: 24,
    radiusFull: 9999, // Fully rounded
  },

  // Grid system
  grid: {
    columns: 12,
    gutter: 16,
    margin: 20,
  },

  // Z-index layers
  zIndex: {
    background: -1,
    default: 0,
    content: 1,
    header: 10,
    overlay: 20,
    modal: 30,
    dropdown: 40,
    tooltip: 50,
    notification: 60,
  },
} as const;

// Animation constants
export const Animation = {
  // Duration (in milliseconds)
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
  },

  // Easing curves
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Spring configurations for React Native Reanimated
  spring: {
    gentle: { damping: 15, stiffness: 120 },
    bouncy: { damping: 10, stiffness: 100 },
    snappy: { damping: 20, stiffness: 200 },
  },
} as const;

export default { Spacing, Layout, Animation }; 