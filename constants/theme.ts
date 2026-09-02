// Powered by OnSpace.AI
// Design tokens for SandboxOS - glassy macOS-inspired identity

export const colors = {
  // Wallpaper gradient (warm sunset)
  wallpaper: {
    top: '#FF9A76',
    mid: '#C56BA3',
    bottom: '#4B3F72',
  },

  // Glass surfaces
  glass: {
    strong: 'rgba(255, 255, 255, 0.22)',
    medium: 'rgba(255, 255, 255, 0.14)',
    soft: 'rgba(255, 255, 255, 0.08)',
    border: 'rgba(255, 255, 255, 0.28)',
    borderSoft: 'rgba(255, 255, 255, 0.16)',
    innerShadow: 'rgba(0, 0, 0, 0.18)',
  },

  // Text
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.78)',
    subtle: 'rgba(255, 255, 255, 0.55)',
    dark: '#1B1B24',
    darkSecondary: 'rgba(27, 27, 36, 0.7)',
  },

  // Accents
  accent: {
    primary: '#7CC5FF',
    warning: '#FFB84D',
    danger: '#FF6B6B',
    success: '#7CE7B2',
  },

  // Window chrome buttons (macOS traffic lights)
  traffic: {
    close: '#FF5F57',
    minimize: '#FEBC2E',
    maximize: '#28C840',
  },

  // Dark overlays
  overlay: {
    scrim: 'rgba(0, 0, 0, 0.35)',
    docBg: 'rgba(20, 20, 30, 0.42)',
    menuBg: 'rgba(20, 20, 30, 0.36)',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
};

export const typography = {
  display: { fontSize: 22, fontWeight: '700' as const, letterSpacing: 0.2 },
  title: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '500' as const, lineHeight: 22 },
  bodyRegular: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  caption: { fontSize: 12, fontWeight: '500' as const, letterSpacing: 0.4 },
  mono: { fontSize: 13, fontWeight: '500' as const },
};

export const shadow = {
  window: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 18,
  },
  dock: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 10,
  },
  pill: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const layout = {
  menuBarHeight: 32,
  dockHeight: 78,
  windowMinWidth: 260,
  windowMinHeight: 200,
};
