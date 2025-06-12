// Color System for Bags Mobile - Minimal Black & White Design
// Primary colors are black and white, with minimal colored utilities for essential semantic states

export const Colors = {
  // Primary Brand Colors (Pure Black & White)
  primary: {
    main: '#000000',        // Pure black - main brand color
    dark: '#000000',        // Black for pressed states
    light: '#333333',       // Dark gray for subtle variations
    50: '#FAFAFA',          // Almost white
    100: '#F5F5F5',         // Very light gray
    200: '#EEEEEE',         // Light gray
    300: '#E0E0E0',         // Medium light gray
    400: '#BDBDBD',         // Medium gray
    500: '#9E9E9E',         // Gray
    600: '#757575',         // Dark gray
    700: '#616161',         // Darker gray
    800: '#424242',         // Very dark gray
    900: '#212121',         // Almost black
  },

  // Secondary Colors (Pure White & Light Grays)
  secondary: {
    main: '#FFFFFF',        // Pure white
    dark: '#F5F5F5',        // Light gray for subtle variations
    light: '#FAFAFA',       // Almost white
    50: '#FFFFFF',          // Pure white
    100: '#FAFAFA',         // Almost white
    200: '#F5F5F5',         // Very light gray
    300: '#EEEEEE',         // Light gray
    400: '#E0E0E0',         // Medium light gray
    500: '#BDBDBD',         // Medium gray
    600: '#9E9E9E',         // Gray
    700: '#757575',         // Dark gray
    800: '#616161',         // Very dark gray
    900: '#424242',         // Dark gray
  },

  // Semantic Colors (Minimal utility colors only)
  semantic: {
    success: '#10B981',     // Green - keep for positive feedback
    error: '#EF4444',       // Red - keep for errors/negative feedback
    warning: '#F59E0B',     // Amber - keep for warnings only
    info: '#000000',        // Use black instead of blue
    
    // Light variants - minimal opacity for subtle backgrounds
    successLight: '#F0FDF4', // Very subtle green tint
    errorLight: '#FEF2F2',   // Very subtle red tint
    warningLight: '#FFFBEB', // Very subtle amber tint
    infoLight: '#FAFAFA',    // Light gray instead of blue
  },

  // Neutral/Gray Scale (Primary palette - expanded for B&W design)
  neutral: {
    white: '#FFFFFF',       // Pure white
    50: '#FAFAFA',          // Almost white
    100: '#F5F5F5',         // Very light gray
    200: '#EEEEEE',         // Light gray
    300: '#E0E0E0',         // Medium light gray
    400: '#BDBDBD',         // Medium gray
    500: '#9E9E9E',         // Medium dark gray
    600: '#757575',         // Dark gray
    700: '#616161',         // Very dark gray
    800: '#424242',         // Almost black
    900: '#212121',         // Very dark
    black: '#000000',       // Pure black
  },

  // Text Colors (Pure Black & White focused)
  text: {
    primary: '#000000',     // Pure black - main text
    secondary: '#424242',   // Dark gray - secondary text
    tertiary: '#757575',    // Medium gray - tertiary text
    inverse: '#FFFFFF',     // Pure white - for dark backgrounds
    disabled: '#BDBDBD',    // Light gray - disabled text
    link: '#000000',        // Black links (use underline for distinction)
    placeholder: '#9E9E9E', // Medium gray for placeholders
  },

  // Background Colors (Pure White & Light Grays)
  background: {
    primary: '#FFFFFF',     // Pure white - main background
    secondary: '#FAFAFA',   // Almost white - secondary areas
    tertiary: '#F5F5F5',    // Light gray - cards and sections
    quaternary: '#EEEEEE',  // Slightly darker for subtle distinction
    overlay: 'rgba(0, 0, 0, 0.5)', // Black semi-transparent overlay
    modal: 'rgba(0, 0, 0, 0.6)',   // Darker overlay for modals
  },

  // Financial Specific Colors (Keep essential utility colors only)
  financial: {
    positive: '#10B981',    // Green for income/gains (keep utility)
    negative: '#EF4444',    // Red for expenses/losses (keep utility) 
    neutral: '#000000',     // Black for neutral amounts
    balance: '#000000',     // Black for balance display
    pending: '#757575',     // Gray for pending amounts
    
    // Remove card brand colors - use neutral gray
    card: '#757575',        // Single gray for all card types
  },

  // Status Colors (Minimal utility colors)
  status: {
    pending: '#757575',     // Gray for pending (remove orange)
    completed: '#10B981',   // Green for completed (keep utility)
    failed: '#EF4444',      // Red for failed (keep utility)
    cancelled: '#9E9E9E',   // Light gray for cancelled
    processing: '#424242',  // Dark gray for processing
  },

  // Border Colors (Grays only)
  border: {
    light: '#EEEEEE',       // Light gray - subtle borders
    medium: '#E0E0E0',      // Medium gray - visible borders
    dark: '#BDBDBD',        // Dark gray - prominent borders
    focus: '#000000',       // Black - focus states
    divider: '#F5F5F5',     // Very light gray - subtle dividers
  },

  // Shadow Colors (Black only)
  shadow: {
    light: 'rgba(0, 0, 0, 0.03)',   // Very subtle
    medium: 'rgba(0, 0, 0, 0.06)',  // Subtle
    dark: 'rgba(0, 0, 0, 0.12)',    // Visible
    strong: 'rgba(0, 0, 0, 0.20)',  // Strong shadow
  },

  // Gradient Colors (Black to White gradients only)
  gradients: {
    primary: ['#000000', '#424242'],      // Black to dark gray
    secondary: ['#FFFFFF', '#F5F5F5'],    // White to light gray
    subtle: ['#FAFAFA', '#EEEEEE'],       // Very subtle gray gradient
    reverse: ['#424242', '#000000'],      // Dark gray to black
    fade: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.1)'], // Transparent to subtle black
  },
} as const;

// Light Theme (Default) - Pure black and white
export const LightTheme = {
  ...Colors,
  background: {
    primary: '#FFFFFF',     // Pure white
    secondary: '#FAFAFA',   // Almost white
    tertiary: '#F5F5F5',    // Light gray
    quaternary: '#EEEEEE',  // Slightly darker gray
    overlay: 'rgba(0, 0, 0, 0.5)',
    modal: 'rgba(0, 0, 0, 0.6)',
  },
  text: {
    primary: '#000000',     // Pure black
    secondary: '#424242',   // Dark gray
    tertiary: '#757575',    // Medium gray
    inverse: '#FFFFFF',     // White
    disabled: '#BDBDBD',    // Light gray
    link: '#000000',        // Black
    placeholder: '#9E9E9E', // Medium gray
  },
};

// Dark Theme - Inverted black and white
export const DarkTheme = {
  ...Colors,
  background: {
    primary: '#000000',     // Pure black
    secondary: '#212121',   // Very dark gray
    tertiary: '#424242',    // Dark gray
    quaternary: '#616161',  // Medium dark gray
    overlay: 'rgba(0, 0, 0, 0.8)',
    modal: 'rgba(0, 0, 0, 0.9)',
  },
  text: {
    primary: '#FFFFFF',     // Pure white
    secondary: '#E0E0E0',   // Light gray
    tertiary: '#BDBDBD',    // Medium gray
    inverse: '#000000',     // Black
    disabled: '#757575',    // Dark gray
    link: '#FFFFFF',        // White
    placeholder: '#9E9E9E', // Medium gray
  },
  // Keep semantic colors the same - they're utility colors
  semantic: {
    ...Colors.semantic,
    info: '#FFFFFF',        // Use white instead of black in dark mode
    infoLight: '#424242',   // Dark gray instead of light gray
  },
};

// Export default as light theme
export default LightTheme; 