export type ColorPreset = 'strechedule-dark' | 'strechedule-light' | 'catppuccin-mocha' | 'catppuccin-macchiato' | 'dracula' | 'monokai' | 'nord' | 'synthwave' | 'gruvbox' | 'solarized-dark' | 'custom'

import { useScheduleStore } from '../store/useScheduleStore'

export interface ThemeColors {
  bg: string
  bgSecondary: string
  bgTertiary: string
  surface: string
  surfaceHighlight: string
  text: string
  textSecondary: string
  textMuted: string
  primary: string
  primaryHover: string
  accent: string
  accentHover: string
  border: string
  borderLight: string
  success: string
  warning: string
  error: string
  grid: string
}

export const colorPresets: Record<ColorPreset, ThemeColors> = {
  'strechedule-dark': {
    bg: 'bg-[#020617]',
    bgSecondary: 'bg-[#0f172a]',
    bgTertiary: 'bg-[#1e293b]',
    surface: 'bg-[#1e293b]/50',
    surfaceHighlight: 'bg-[#334155]/50',
    text: 'text-white',
    textSecondary: 'text-[#cbd5e1]',
    textMuted: 'text-[#64748b]',
    primary: 'bg-[#a855f7]',
    primaryHover: 'hover:bg-[#c072ff]',
    accent: 'bg-[#f59e0b]',
    accentHover: 'hover:bg-[#fbbf24]',
    border: 'border-[#334155]',
    borderLight: 'border-[#1e293b]',
    success: 'text-[#22c55e]',
    warning: 'text-[#f59e0b]',
    error: 'text-[#ef4444]',
    grid: 'rgba(139, 92, 246, 0.05)',
  },
  'strechedule-light': {
    bg: 'bg-[#f8fafc]',
    bgSecondary: 'bg-white',
    bgTertiary: 'bg-[#f1f5f9]',
    surface: 'bg-white/80',
    surfaceHighlight: 'bg-[#e2e8f0]/50',
    text: 'text-[#0f172a]',
    textSecondary: 'text-[#475569]',
    textMuted: 'text-[#94a3b8]',
    primary: 'bg-[#7c3aed]',
    primaryHover: 'hover:bg-[#8b5cf6]',
    accent: 'bg-[#d97706]',
    accentHover: 'hover:bg-[#f59e0b]',
    border: 'border-[#cbd5e1]',
    borderLight: 'border-[#e2e8f0]',
    success: 'text-[#16a34a]',
    warning: 'text-[#d97706]',
    error: 'text-[#dc2626]',
    grid: 'rgba(124, 58, 237, 0.05)',
  },
  'catppuccin-mocha': {
    bg: 'bg-[#1e1e2e]',
    bgSecondary: 'bg-[#181825]',
    bgTertiary: 'bg-[#11111b]',
    surface: 'bg-[#313244]/50',
    surfaceHighlight: 'bg-[#45475a]/50',
    text: 'text-[#cdd6f4]',
    textSecondary: 'text-[#a6adc8]',
    textMuted: 'text-[#6c7086]',
    primary: 'bg-[#cba6f7]',
    primaryHover: 'hover:bg-[#f5c2e7]',
    accent: 'bg-[#f9e2af]',
    accentHover: 'hover:bg-[#f5c2e7]',
    border: 'border-[#45475a]',
    borderLight: 'border-[#313244]',
    success: 'text-[#a6e3a1]',
    warning: 'text-[#f9e2af]',
    error: 'text-[#f38ba8]',
    grid: 'rgba(203, 166, 247, 0.05)',
  },
  'catppuccin-macchiato': {
    bg: 'bg-[#24273a]',
    bgSecondary: 'bg-[#1e2030]',
    bgTertiary: 'bg-[#181926]',
    surface: 'bg-[#363a4f]/50',
    surfaceHighlight: 'bg-[#494d64]/50',
    text: 'text-[#cad3f5]',
    textSecondary: 'text-[#a5adcb]',
    textMuted: 'text-[#6e738d]',
    primary: 'bg-[#c6a0f6]',
    primaryHover: 'hover:bg-[#f5bde6]',
    accent: 'bg-[#eed49f]',
    accentHover: 'hover:bg-[#f5bde6]',
    border: 'border-[#494d64]',
    borderLight: 'border-[#363a4f]',
    success: 'text-[#a6da95]',
    warning: 'text-[#eed49f]',
    error: 'text-[#f5a97f]',
    grid: 'rgba(198, 160, 246, 0.05)',
  },
  dracula: {
    bg: 'bg-[#282a36]',
    bgSecondary: 'bg-[#21222c]',
    bgTertiary: 'bg-[#191a21]',
    surface: 'bg-[#44475a]/50',
    surfaceHighlight: 'bg-[#6272a4]/50',
    text: 'text-[#f8f8f2]',
    textSecondary: 'text-[#bd93f9]',
    textMuted: 'text-[#6272a4]',
    primary: 'bg-[#bd93f9]',
    primaryHover: 'hover:bg-[#ff79c6]',
    accent: 'bg-[#ffb86c]',
    accentHover: 'hover:bg-[#50fa7b]',
    border: 'border-[#6272a4]',
    borderLight: 'border-[#44475a]',
    success: 'text-[#50fa7b]',
    warning: 'text-[#ffb86c]',
    error: 'text-[#ff5555]',
    grid: 'rgba(189, 147, 249, 0.05)',
  },
  monokai: {
    bg: 'bg-[#272822]',
    bgSecondary: 'bg-[#1e1f1c]',
    bgTertiary: 'bg-[#171814]',
    surface: 'bg-[#3e3d32]/50',
    surfaceHighlight: 'bg-[#49483e]/50',
    text: 'text-[#f8f8f2]',
    textSecondary: 'text-[#a6e22e]',
    textMuted: 'text-[#75715e]',
    primary: 'bg-[#a6e22e]',
    primaryHover: 'hover:bg-[#f92672]',
    accent: 'bg-[#fd971f]',
    accentHover: 'hover:bg-[#66d9ef]',
    border: 'border-[#75715e]',
    borderLight: 'border-[#3e3d32]',
    success: 'text-[#a6e22e]',
    warning: 'text-[#fd971f]',
    error: 'text-[#f92672]',
    grid: 'rgba(166, 226, 46, 0.05)',
  },
  custom: {
    bg: 'bg-[#020617]',
    bgSecondary: 'bg-[#0f172a]',
    bgTertiary: 'bg-[#1e293b]',
    surface: 'bg-[#1e293b]/50',
    surfaceHighlight: 'bg-[#334155]/50',
    text: 'text-white',
    textSecondary: 'text-[#cbd5e1]',
    textMuted: 'text-[#64748b]',
    primary: 'bg-[#a855f7]',
    primaryHover: 'hover:bg-[#c072ff]',
    accent: 'bg-[#f59e0b]',
    accentHover: 'hover:bg-[#fbbf24]',
    border: 'border-[#334155]',
    borderLight: 'border-[#1e293b]',
    success: 'text-[#22c55e]',
    warning: 'text-[#f59e0b]',
    error: 'text-[#ef4444]',
    grid: 'rgba(139, 92, 246, 0.05)',
  },
  nord: {
    bg: 'bg-[#2e3440]',
    bgSecondary: 'bg-[#3b4252]',
    bgTertiary: 'bg-[#434c5e]',
    surface: 'bg-[#4c566a]/50',
    surfaceHighlight: 'bg-[#d8dee9]/30',
    text: 'text-[#eceff4]',
    textSecondary: 'text-[#d8dee9]',
    textMuted: 'text-[#4c566a]',
    primary: 'bg-[#88c0d0]',
    primaryHover: 'hover:bg-[#8fbcbb]',
    accent: 'bg-[#bf616a]',
    accentHover: 'hover:bg-[#ebcb8b]',
    border: 'border-[#4c566a]',
    borderLight: 'border-[#3b4252]',
    success: 'text-[#a3be8c]',
    warning: 'text-[#ebcb8b]',
    error: 'text-[#bf616a]',
    grid: 'rgba(136, 192, 208, 0.05)',
  },
  synthwave: {
    bg: 'bg-[#262626]',
    bgSecondary: 'bg-[#3c3c3c]',
    bgTertiary: 'bg-[#505050]',
    surface: 'bg-[#6a4c93]/50',
    surfaceHighlight: 'bg-[#ff7edb]/30',
    text: 'text-[#f8f8f2]',
    textSecondary: 'text-[#ff7edb]',
    textMuted: 'text-[#888888]',
    primary: 'bg-[#ff7edb]',
    primaryHover: 'hover:bg-[#f986ae]',
    accent: 'bg-[#05d9e8]',
    accentHover: 'hover:bg-[#41a6c6]',
    border: 'border-[#888888]',
    borderLight: 'border-[#505050]',
    success: 'text-[#05d9e8]',
    warning: 'text-[#f986ae]',
    error: 'text-[#ff7edb]',
    grid: 'rgba(255, 126, 219, 0.05)',
  },
  gruvbox: {
    bg: 'bg-[#282828]',
    bgSecondary: 'bg-[#1d2021]',
    bgTertiary: 'bg-[#32302f]',
    surface: 'bg-[#3c3836]/50',
    surfaceHighlight: 'bg-[#504945]/50',
    text: 'text-[#ebdbb2]',
    textSecondary: 'text-[#d5c4a1]',
    textMuted: 'text-[#665c54]',
    primary: 'bg-[#fabd2f]',
    primaryHover: 'hover:bg-[#fe8019]',
    accent: 'bg-[#fb4934]',
    accentHover: 'hover:bg-[#cc241d]',
    border: 'border-[#504945]',
    borderLight: 'border-[#3c3836]',
    success: 'text-[#b8bb26]',
    warning: 'text-[#fabd2f]',
    error: 'text-[#fb4934]',
    grid: 'rgba(250, 189, 47, 0.05)',
  },
  'solarized-dark': {
    bg: 'bg-[#002b36]',
    bgSecondary: 'bg-[#073642]',
    bgTertiary: 'bg-[#586e75]',
    surface: 'bg-[#002b36]/50',
    surfaceHighlight: 'bg-[#073642]/50',
    text: 'text-[#839496]',
    textSecondary: 'text-[#93a1a1]',
    textMuted: 'text-[#586e75]',
    primary: 'bg-[#268bd2]',
    primaryHover: 'hover:bg-[#2aa198]',
    accent: 'bg-[#b58900]',
    accentHover: 'hover:bg-[#cb4b16]',
    border: 'border-[#586e75]',
    borderLight: 'border-[#073642]',
    success: 'text-[#859900]',
    warning: 'text-[#b58900]',
    error: 'text-[#dc322f]',
    grid: 'rgba(38, 139, 210, 0.05)',
  },
}

export function getThemeColors(preset: ColorPreset, customColors?: Record<string, string>): ThemeColors {
  const baseColors = colorPresets[preset] || colorPresets['strechedule-dark']
  
  if (!customColors || Object.keys(customColors).length === 0) {
    return baseColors
  }
  
  const hexToBgClass = (hex: string) => `bg-[${hex}]`
  const hexToTextClass = (hex: string) => `text-[${hex}]`
  const hexToBorderClass = (hex: string) => `border-[${hex}]`
  
  const customTheme: ThemeColors = {
    ...baseColors,
    ...(customColors.bg && { bg: hexToBgClass(customColors.bg) }),
    ...(customColors.bgSecondary && { bgSecondary: hexToBgClass(customColors.bgSecondary) }),
    ...(customColors.bgTertiary && { bgTertiary: hexToBgClass(customColors.bgTertiary) }),
    ...(customColors.text && { text: hexToTextClass(customColors.text) }),
    ...(customColors.textSecondary && { textSecondary: hexToTextClass(customColors.textSecondary) }),
    ...(customColors.textMuted && { textMuted: hexToTextClass(customColors.textMuted) }),
    ...(customColors.primary && { primary: hexToBgClass(customColors.primary), primaryHover: hexToBgClass(customColors.primary) }),
    ...(customColors.accent && { accent: hexToBgClass(customColors.accent), accentHover: hexToBgClass(customColors.accent) }),
    ...(customColors.border && { border: hexToBorderClass(customColors.border), borderLight: hexToBorderClass(customColors.border) }),
  }
  
  return customTheme
}

export function getGridBackground(colors: ThemeColors): string {
  return `repeating-linear-gradient(0deg, transparent, transparent 19px, ${colors.grid} 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, ${colors.grid} 20px)`
}

export function getGradientBackground(colors: ThemeColors): string {
  return `linear-gradient(135deg, ${colors.bgSecondary.replace('bg-', '#')} 0%, ${colors.bgTertiary.replace('bg-', '#')} 100%)`
}

export function useTheme() {
  const { settings } = useScheduleStore()
  const colors = getThemeColors(settings.colorPreset, settings.customColors)
  return { settings, colors }
}
