# Design System - Bags Mobile App

This directory contains the complete design system for the Bags mobile digital wallet application, focused on a **minimal black and white aesthetic** with essential utility colors for semantic purposes.

## 🎨 Minimal Color System

The color system is designed around pure black (#000000) and white (#FFFFFF) with carefully selected gray tones and minimal utility colors for essential feedback states.

### Design Philosophy

- **Primary**: Pure black and white
- **Secondary**: Carefully curated gray scale 
- **Utility**: Minimal semantic colors (green for success, red for errors)
- **Accessibility**: High contrast ratios for excellent readability
- **Elegance**: Clean, timeless aesthetic

### Usage

```typescript
import { Colors, theme, getTheme } from '../constants';

// Using specific colors
const backgroundColor = Colors.neutral.white; // #FFFFFF
const textColor = Colors.neutral.black; // #000000

// Using theme (recommended)
const currentTheme = getTheme(false); // false = light theme
const styles = {
  container: {
    backgroundColor: currentTheme.colors.background.primary, // Pure white
    color: currentTheme.colors.text.primary, // Pure black
  }
};
```

### Color Categories

#### **Primary Colors (Black & White)**
- **Black (#000000)**: Main brand color, primary buttons, headings
- **White (#FFFFFF)**: Backgrounds, secondary buttons, inverse text
- **Dark Gray (#333333)**: Subtle variations, hover states

#### **Gray Scale (Extended Palette)**
- **50-100**: Almost white to very light gray
- **200-400**: Light to medium grays for backgrounds and borders
- **500-700**: Medium to dark grays for secondary text
- **800-900**: Very dark grays approaching black

#### **Semantic Colors (Minimal Utility)**
- **Success (#10B981)**: Green for positive feedback, completed states
- **Error (#EF4444)**: Red for errors, failed states, negative amounts
- **Warning (#F59E0B)**: Amber for warnings only (limited use)
- **Info**: Uses black/white instead of blue

#### **Financial Colors**
- **Positive**: Green (#10B981) for income/gains
- **Negative**: Red (#EF4444) for expenses/losses  
- **Neutral**: Black (#000000) for regular amounts
- **Balance**: Pure black for primary balance display

## 📝 Typography

Modern, readable typography system using Inter and SF Pro fonts with black text hierarchy.

### Usage

```typescript
import { Typography, theme } from '../constants';

const styles = {
  title: {
    fontSize: Typography.textStyles.h1.fontSize,
    fontWeight: Typography.textStyles.h1.fontWeight,
    color: theme.colors.text.primary, // Pure black
  },
  subtitle: {
    color: theme.colors.text.secondary, // Dark gray
  },
  body: {
    color: theme.colors.text.primary, // Black
  },
};
```

## 📏 Spacing & Layout

8px grid system for consistent spacing throughout the app.

### Usage

```typescript
import { Spacing, Layout } from '../constants';

const styles = {
  container: {
    padding: Spacing.md, // 16px
    marginBottom: Spacing.lg, // 24px
  },
  button: {
    height: Layout.component.buttonMedium, // 44px
    borderRadius: Layout.component.radiusMedium, // 12px
  }
};
```

## 🌙 Dark Mode Support

The system includes both light and dark themes with inverted colors.

### Light Theme (Default)
- **Background**: Pure white (#FFFFFF)
- **Text**: Pure black (#000000)
- **Cards**: White with subtle gray borders

### Dark Theme
- **Background**: Pure black (#000000)  
- **Text**: Pure white (#FFFFFF)
- **Cards**: Dark gray with subtle borders

### Usage

```typescript
import { getTheme, lightTheme, darkTheme } from '../constants';

// Get theme based on user preference
const isDarkMode = true; // from user settings or system
const currentTheme = getTheme(isDarkMode);

// Or use specific themes
const theme = isDarkMode ? darkTheme : lightTheme;
```

## 🚀 Quick Start

### 1. Import the theme

```typescript
import { theme, createStyles } from '../constants';
```

### 2. Create component styles

```typescript
const styles = createStyles(theme);

// Use predefined styles
<View style={styles.card}>
  <Text style={styles.text.heading}>Welcome</Text>
  <Text style={styles.text.secondary}>Subtitle text</Text>
</View>
```

### 3. Financial components

```typescript
// Display amounts with minimal colors
<Text style={styles.financial.balance}>$1,234.56</Text>
<Text style={styles.financial.positive}>+$500.00</Text> // Green
<Text style={styles.financial.negative}>-$25.99</Text>  // Red
<Text style={styles.financial.neutral}>$0.00</Text>     // Black
```

### 4. Status indicators

```typescript
// Transaction status with minimal colors
<View style={styles.status.completed}>  // Subtle green background
  <Text>Completed</Text>
</View>
<View style={styles.status.pending}>    // Gray background
  <Text>Pending</Text>
</View>
```

## 🎯 Design Principles

### **1. Minimal Color Usage**
- Use black and white as primary colors
- Reserve colors only for essential semantic meaning
- Avoid decorative colors

### **2. High Contrast**
- Ensure excellent readability in all conditions
- Use pure black on white for maximum contrast
- Test accessibility compliance

### **3. Consistent Gray Scale**
- Use systematic gray progression (50, 100, 200, etc.)
- Maintain consistent opacity relationships
- Create clear visual hierarchy

### **4. Semantic Clarity**
- Green = positive/success (universal)
- Red = negative/error (universal)
- Gray = neutral/pending
- Black/White = primary content

### **5. Elegant Simplicity**
- Favor borders over shadows when possible
- Use subtle shadows with black color only
- Maintain clean, minimal aesthetic

## 📱 Component Examples

### **Button Styles**

```typescript
// Primary button - Black background, white text
<TouchableOpacity style={styles.button.primary}>
  <Text style={styles.text.inverse}>Primary Action</Text>
</TouchableOpacity>

// Secondary button - White background, black border, black text  
<TouchableOpacity style={styles.button.secondary}>
  <Text style={styles.text.primary}>Secondary Action</Text>
</TouchableOpacity>

// Tertiary button - Transparent, black text
<TouchableOpacity style={styles.button.tertiary}>
  <Text style={styles.text.primary}>Tertiary Action</Text>
</TouchableOpacity>
```

### **Card Styles**

```typescript
// Standard card - White with light border
<View style={styles.card}>
  <Text style={styles.text.heading}>Card Title</Text>
  <Text style={styles.text.secondary}>Card content</Text>
</View>

// Elevated card - White with stronger shadow
<View style={styles.cardElevated}>
  <Text style={styles.text.heading}>Important Card</Text>
</View>
```

### **Financial Display**

```typescript
// Balance display
<Text style={styles.financial.balance}>
  ${balance.toFixed(2)}
</Text>

// Transaction amounts
<Text style={[
  styles.financial.base,
  amount > 0 ? styles.financial.positive : styles.financial.negative
]}>
  {amount > 0 ? '+' : ''}${Math.abs(amount).toFixed(2)}
</Text>
```

## ✅ Best Practices

1. **Always use theme values** instead of hardcoded colors
2. **Prefer black and white** over colored alternatives when possible
3. **Reserve colors** for truly semantic purposes (success, error)
4. **Use gray scale** for visual hierarchy and subtle distinctions
5. **Test in both light and dark modes** for consistency
6. **Maintain high contrast** for accessibility compliance
7. **Use borders and subtle shadows** instead of heavy colored elements
8. **Keep financial colors** semantic (green=positive, red=negative)

This minimal design system ensures a timeless, elegant, and highly accessible interface that focuses users' attention on content rather than decorative elements. 