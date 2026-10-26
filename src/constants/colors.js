export const lightTheme = {
  // Brand & Accent Colors
  primary: '#6366F1', // Calming modern Indigo
  primaryLight: '#818CF8', // Soft Indigo
  primaryDark: '#4338CA', // Deep Indigo
  primarySoft: '#EEF2FF', // Very light indigo wash
  
  // Night / Sleep Theme Palette
  night: '#0F172A', // Slate 900
  nightSurface: '#1E293B', // Slate 800
  nightCard: '#334155', // Slate 700
  nightAccent: '#312E81', // Midnight Indigo

  // Surfaces & Backgrounds
  background: '#F8FAFC', // Ultra-clean slate 50
  surface: '#FFFFFF', // Pure white
  surfaceSubtle: '#F1F5F9', // Slate 100
  
  // Typography
  text: '#0F172A', // Slate 900
  textSecondary: '#64748B', // Slate 500
  textMuted: '#94A3B8', // Slate 400
  textLight: '#F8FAFC', // Light text for dark cards
  textLightSecondary: 'rgba(255, 255, 255, 0.75)',

  // Borders & Dividers
  border: '#E2E8F0', // Slate 200
  borderLight: '#F1F5F9', // Slate 100
  cardBorder: 'rgba(226, 232, 240, 0.8)',

  // Status & Feedback Colors
  success: '#10B981', // Emerald green
  successLight: '#D1FAE5',
  successSoft: '#ECFDF5',

  error: '#EF4444', // Coral red
  errorLight: '#FEE2E2',
  errorSoft: '#FEF2F2',

  warning: '#F59E0B', // Amber
  warningLight: '#FEF3C7',

  info: '#0EA5E9', // Sky blue
  infoLight: '#E0F2FE',

  calendarHighlight: '#06B6D4', // Cyan
  streak: '#F59E0B', // Warm Amber/Orange for streak
  streakLight: '#FEF3C7',
  streakSoft: '#FFFBEB',

  // Shadows
  cardShadow: 'rgba(15, 23, 42, 0.06)',
  cardShadowHeavy: 'rgba(15, 23, 42, 0.12)',

  // Sleep Quality Mapping
  sleepQuality: {
    excellent: '#10B981', // Emerald
    good: '#3B82F6',      // Blue
    fair: '#F59E0B',      // Amber
    poor: '#EF4444',      // Coral Red
  },

  // Sleep Quality Light Backgrounds
  sleepQualityBg: {
    excellent: '#D1FAE5',
    good: '#DBEAFE',
    fair: '#FEF3C7',
    poor: '#FEE2E2',
  }
};

export const darkTheme = {
  // Brand & Accent Colors
  primary: '#818CF8', // Glowing Indigo for dark mode
  primaryLight: '#A5B4FC',
  primaryDark: '#6366F1',
  primarySoft: 'rgba(99, 102, 241, 0.18)',
  
  // Night / Sleep Theme Palette
  night: '#090D16', // Deepest Obsidian
  nightSurface: '#131B2E',
  nightCard: '#1E293B',
  nightAccent: '#312E81',

  // Surfaces & Backgrounds
  background: '#0B0F19', // Deep dark backdrop
  surface: '#151D2E', // Dark card surface
  surfaceSubtle: '#1E293B', // Subtle slate surface
  
  // Typography
  text: '#F8FAFC', // Crisp white text
  textSecondary: '#94A3B8', // Slate 400
  textMuted: '#64748B', // Slate 500
  textLight: '#F8FAFC',
  textLightSecondary: 'rgba(255, 255, 255, 0.75)',

  // Borders & Dividers
  border: '#243048', // Subtle dark border
  borderLight: '#1A2337',
  cardBorder: 'rgba(51, 65, 85, 0.6)',

  // Status & Feedback Colors
  success: '#34D399',
  successLight: 'rgba(16, 185, 129, 0.25)',
  successSoft: 'rgba(16, 185, 129, 0.15)',

  error: '#F87171',
  errorLight: 'rgba(239, 68, 68, 0.25)',
  errorSoft: 'rgba(239, 68, 68, 0.15)',

  warning: '#FBBF24',
  warningLight: 'rgba(245, 158, 11, 0.25)',

  info: '#38BDF8',
  infoLight: 'rgba(14, 165, 233, 0.25)',

  calendarHighlight: '#22D3EE',
  streak: '#FBBF24',
  streakLight: 'rgba(245, 158, 11, 0.25)',
  streakSoft: 'rgba(245, 158, 11, 0.15)',

  // Shadows
  cardShadow: 'rgba(0, 0, 0, 0.45)',
  cardShadowHeavy: 'rgba(0, 0, 0, 0.65)',

  // Sleep Quality Mapping
  sleepQuality: {
    excellent: '#34D399',
    good: '#60A5FA',
    fair: '#FBBF24',
    poor: '#F87171',
  },

  // Sleep Quality Backgrounds
  sleepQualityBg: {
    excellent: 'rgba(16, 185, 129, 0.2)',
    good: 'rgba(59, 130, 246, 0.2)',
    fair: 'rgba(245, 158, 11, 0.2)',
    poor: 'rgba(239, 68, 68, 0.2)',
  }
};

export const colors = lightTheme;
