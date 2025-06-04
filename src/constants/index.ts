// Central export for all design constants
// Import design tokens from this file throughout the app

export { default as Colors, LightTheme, DarkTheme } from './colors';
export { default as Typography } from './typography';
export { default as Spacing, Layout, Animation } from './spacing';
export { 
  default as theme, 
  lightTheme, 
  darkTheme, 
  getTheme, 
  createStyles, 
  createScreenStyles,
  type Theme 
} from './theme';

// Import for re-export
import { Colors } from './colors';
import { Typography } from './typography';  
import { Spacing } from './spacing';

// Re-export commonly used values for convenience
export const { 
  primary: primaryColors,
  secondary: secondaryColors,
  semantic: semanticColors,
  neutral: neutralColors,
  financial: financialColors,
} = Colors;

export const {
  fontSize,
  fontWeight,
  lineHeight,
  textStyles,
} = Typography;

export const {
  xs: spacingXs,
  sm: spacingSm,
  md: spacingMd,
  lg: spacingLg,
  xl: spacingXl,
} = Spacing; 