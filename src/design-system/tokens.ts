export const colors = {
  primary: {
    DEFAULT: '#6ee7ff',
    hover: '#5dd6ee',
    muted: 'rgba(110, 231, 255, 0.15)',
    subtle: 'rgba(110, 231, 255, 0.08)',
    highlight: 'rgba(110, 231, 255, 0.12)',
    highlightHover: 'rgba(110, 231, 255, 0.18)',
  },
  secondary: {
    DEFAULT: '#a78bfa',
    hover: '#9678e9',
    muted: 'rgba(167, 139, 250, 0.15)',
    subtle: 'rgba(167, 139, 250, 0.08)',
  },
  success: {
    DEFAULT: '#6fffc1',
    muted: 'rgba(111, 255, 193, 0.15)',
    subtle: 'rgba(111, 255, 193, 0.08)',
  },
  warning: {
    DEFAULT: '#fcd34d',
    muted: 'rgba(252, 211, 77, 0.15)',
    subtle: 'rgba(252, 211, 77, 0.08)',
  },
  error: {
    DEFAULT: '#ff6b6b',
    text: '#fda4af',
    muted: 'rgba(253, 164, 175, 0.15)',
    subtle: 'rgba(253, 164, 175, 0.08)',
  },
  background: {
    DEFAULT: '#040714',
    paper: '#0a0f1f',
    elevated: '#0d1225',
    glass: 'rgba(255, 255, 255, 0.08)',
    glassHover: 'rgba(255, 255, 255, 0.12)',
    glassSubtle: 'rgba(255, 255, 255, 0.05)',
    glassFaint: 'rgba(255, 255, 255, 0.03)',
    glassSidebar: 'rgba(255, 255, 255, 0.04)',
  },
  text: {
    primary: '#f6f8ff',
    secondary: 'rgba(239, 242, 255, 0.7)',
    muted: 'rgba(255, 255, 255, 0.5)',
    disabled: 'rgba(255, 255, 255, 0.2)',
  },
  border: {
    DEFAULT: 'rgba(255, 255, 255, 0.15)',
    subtle: 'rgba(255, 255, 255, 0.1)',
    muted: 'rgba(255, 255, 255, 0.08)',
    faint: 'rgba(255, 255, 255, 0.05)',
  },
  overlay: {
    light: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(255, 255, 255, 0.1)',
    dark: 'rgba(0, 0, 0, 0.5)',
  },
} as const;

export const typography = {
  fontFamily: {
    sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"Fira Code", "SF Mono", Monaco, "Cascadia Code", monospace',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.25rem',
  1: '0.5rem',
  1.5: '0.75rem',
  2: '1rem',
  2.5: '1.25rem',
  3: '1.5rem',
  4: '2rem',
  5: '2.5rem',
  6: '3rem',
  8: '4rem',
  10: '5rem',
  12: '6rem',
} as const;

export const MUI_SPACING_UNIT = 8;

export const radii = {
  none: '0',
  sm: '0.25rem',
  DEFAULT: '0.5rem',
  md: '0.75rem',
  lg: '0.875rem',
  xl: '1rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  full: '9999px',
} as const;

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
  md: '0 6px 12px -2px rgba(0, 0, 0, 0.3)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
  card: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 4px 20px rgba(255, 255, 255, 0.05)',
  cardHover: '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 4px 20px rgba(255, 255, 255, 0.08)',
  glow: '0 0 20px rgba(110, 231, 255, 0.3)',
  glowSecondary: '0 0 20px rgba(167, 139, 250, 0.3)',
} as const;

export const transitions = {
  fast: '150ms ease',
  DEFAULT: '200ms ease',
  slow: '300ms ease',
  slower: '500ms ease',
} as const;

export const transitionDurations = {
  fast: 150,
  DEFAULT: 200,
  slow: 300,
  slower: 500,
} as const;

export const effects = {
  blur: {
    none: 'blur(0)',
    sm: 'blur(4px)',
    DEFAULT: 'blur(12px)',
    lg: 'blur(20px)',
    xl: 'blur(40px)',
  },
  saturate: {
    DEFAULT: 'saturate(180%)',
    high: 'saturate(200%)',
  },
  backdropFilter: {
    glass: 'blur(12px) saturate(180%)',
    glassSm: 'blur(4px) saturate(180%)',
    glassLg: 'blur(20px) saturate(180%)',
  },
} as const;

export const gradients = {
  primary: 'linear-gradient(135deg, #6ee7ff 0%, #a78bfa 100%)',
  primaryHover: 'linear-gradient(135deg, #5dd6ee 0%, #9678e9 100%)',
  primarySubtle: 'linear-gradient(135deg, rgba(110, 231, 255, 0.2) 0%, rgba(167, 139, 250, 0.2) 100%)',
  background: 'linear-gradient(180deg, #040714 0%, #0a0f1f 100%)',
  backgroundRadial: 'radial-gradient(ellipse at top, #0d1225 0%, #040714 100%)',
  radialPrimary: 'radial-gradient(circle at top, rgba(110, 231, 255, 0.15), transparent 50%)',
  radialSecondary: 'radial-gradient(circle at 80% 80%, rgba(167, 139, 250, 0.1), transparent 50%)',
  radialSuccess: 'radial-gradient(circle at top right, rgba(111, 255, 193, 0.1), transparent 50%)',
} as const;

export const layout = {
  sidebarWidth: 260,
  sidebarWidthCollapsed: 72,
  topBarHeight: 64,
  maxContentWidth: 1400,
  containerPadding: spacing[4],
} as const;

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  toast: 800,
} as const;

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

export const statusColors = {
  offer: {
    background: colors.success.muted,
    text: colors.success.DEFAULT,
  },
  rejected: {
    background: colors.error.muted,
    text: colors.error.text,
  },
  pending: {
    background: colors.warning.muted,
    text: colors.warning.DEFAULT,
  },
  inProgress: {
    background: colors.primary.muted,
    text: colors.primary.DEFAULT,
  },
  upcoming: {
    background: colors.secondary.muted,
    text: colors.secondary.DEFAULT,
  },
} as const;

export const stageColors = {
  applied: colors.primary.DEFAULT,
  screening: colors.secondary.DEFAULT,
  interview: colors.warning.DEFAULT,
  assessment: '#f97316', // orange
  offer: colors.success.DEFAULT,
  rejected: colors.error.DEFAULT,
} as const;

export const opacity = {
  faint: 0.03,
  subtle: 0.06,
  light: 0.1,
  medium: 0.15,
  elevated: 0.2,
  high: 0.5,
  full: 1,
} as const;

export const componentSizes = {
  iconBox: {
    sm: { width: '2.5rem', height: '2.5rem' },
    md: { width: '3rem', height: '3rem' },
    lg: { width: '3.5rem', height: '3.5rem' },
    xl: { width: '4rem', height: '4rem' },
  },
  dialog: {
    xs: 320,
    sm: 400,
    md: 600,
    lg: 800,
    xl: 1000,
  },
  chart: {
    height: 300,
    minHeight: 200,
  },
} as const;

export const pagination = {
  defaultSizes: [5, 10, 25] as const,
  compactSizes: [5, 10] as const,
  extendedSizes: [10, 25, 50, 100] as const,
  defaultPageSize: 10,
} as const;

export const formDefaults = {
  textareaRows: 3,
  textareaRowsLarge: 6,
  inputDebounceMs: 300,
} as const;

export type ColorToken = typeof colors;
export type TypographyToken = typeof typography;
export type SpacingToken = typeof spacing;
export type RadiiToken = typeof radii;
export type ShadowToken = typeof shadows;
export type TransitionToken = typeof transitions;
export type GradientToken = typeof gradients;
export type LayoutToken = typeof layout;
export type StatusColorToken = typeof statusColors;
export type OpacityToken = typeof opacity;
export type ComponentSizeToken = typeof componentSizes;
export type PaginationToken = typeof pagination;
export type FormDefaultsToken = typeof formDefaults;
