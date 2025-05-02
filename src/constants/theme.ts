// src/constants/theme.ts
export const THEME_COLORS = {
    primary: '#0F867C',       // Main teal color from design
    primaryLight: '#44A79B',  // Lighter teal for accents
    primaryDark: '#086158',   // Darker teal for pressed states
    secondary: '#E5F7F6',     // Light teal background
    background: '#FFFFFF',    // White background
    surface: '#F7F7F7',       // Light gray for cards/surfaces
    text: '#303030',          // Dark text
    textSecondary: '#6E6E6E', // Secondary text color
    inactive: '#B8B8B8',      // Inactive elements
    error: '#E53935',         // Error states
    success: '#43A047',       // Success states
    warning: '#FFA000',       // Warning states
    black: '#000000',
    white: '#FFFFFF',
  };
  
  export const TYPOGRAPHY = {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      heading1: 24,
      heading2: 20,
      heading3: 18,
      body: 16,
      caption: 14,
      small: 12,
    },
    lineHeight: {
      heading: 1.4,
      body: 1.6, 
    },
  };
  
  export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  };
  
  export const SHADOWS = {
    small: {
      shadowColor: THEME_COLORS.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: THEME_COLORS.black,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    large: {
      shadowColor: THEME_COLORS.black,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
  };
  
  export const BORDER_RADIUS = {
    small: 4,
    medium: 8,
    large: 16,
    round: 9999, // For circular elements
  };