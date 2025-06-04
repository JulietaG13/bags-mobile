// Typography System for Bags Mobile - Digital Wallet App
// Modern, readable typography following fintech design best practices

export const Typography = {
  // Font Families - Using system fonts for better mobile compatibility
  fontFamily: {
    primary: 'System', // System default font
    secondary: 'System', // System default font 
    monospace: 'monospace', // System monospace font
  },

  // Font Sizes - Optimized for mobile readability
  fontSize: {
    xs: 12,     // Extra small text
    sm: 14,     // Small text
    base: 16,   // Base text size - optimized for mobile reading
    lg: 18,     // Large text
    xl: 20,     // Extra large text
    '2xl': 24,  // Heading 4
    '3xl': 28,  // Heading 3 - slightly smaller for mobile
    '4xl': 32,  // Heading 2 - smaller for mobile
    '5xl': 40,  // Heading 1 - more reasonable for mobile
    '6xl': 48,  // Display text - reduced for mobile
  },

  // Line Heights - Optimized for mobile readability
  lineHeight: {
    tight: 1.2,     // For headings - tighter for mobile
    normal: 1.4,    // For body text - slightly tighter for mobile
    relaxed: 1.6,   // For longer paragraphs
  },

  // Font Weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Predefined Text Styles - Mobile optimized
  textStyles: {
    // Display styles
    displayLarge: {
      fontSize: 48,
      fontWeight: '700',
      lineHeight: 1.2,
    },
    displayMedium: {
      fontSize: 40,
      fontWeight: '700',
      lineHeight: 1.2,
    },
    displaySmall: {
      fontSize: 32,
      fontWeight: '600',
      lineHeight: 1.2,
    },

    // Heading styles - Mobile optimized sizes
    h1: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 1.25,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 1.25,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 1.3,
    },

    // Body text styles
    bodyLarge: {
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 1.4,
    },
    bodyMedium: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 1.4,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 1.4,
    },

    // Label styles
    labelLarge: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 1.2,
    },
    labelMedium: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 1.2,
    },
    labelSmall: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 1.2,
    },

    // Caption styles
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 1.4,
    },
    overline: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 1.2,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
    },

    // Financial specific styles
    balance: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 1.2,
    },
    amount: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 1.2,
    },
    currency: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 1.2,
    },
  },
} as const;

export default Typography; 