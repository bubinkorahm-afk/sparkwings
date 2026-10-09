/**
 * lib/theme.ts
 * Glow / Spark theme configuration. Change ACTIVE_THEME to switch all accent colours.
 */

export type ThemeName = 'glow' | 'spark';

export interface ThemeConfig {
  name: ThemeName;
  /** CSS class applied to <html> or <body> */
  bodyClass: string;
  accent1: string;
  accent2: string;
  glowA: string;
  glowB: string;
  gradBrand: string;
}

export const themes: Record<ThemeName, ThemeConfig> = {
  glow: {
    name: 'glow',
    bodyClass: '',
    accent1: '#EC4899',
    accent2: '#F97316',
    glowA: '#BE185D',
    glowB: '#C2410C',
    gradBrand: 'linear-gradient(90deg, #EC4899 0%, #F97316 100%)',
  },
  spark: {
    name: 'spark',
    bodyClass: 'theme-spark',
    accent1: '#1E5BFF',
    accent2: '#22D3EE',
    glowA: '#1E5BFF',
    glowB: '#0891B2',
    gradBrand: 'linear-gradient(90deg, #1E5BFF 0%, #22D3EE 100%)',
  },
};

/** Change this value to 'spark' to enable the blue logo variant */
export const ACTIVE_THEME: ThemeName = 'glow';

export const activeTheme = themes[ACTIVE_THEME];
