import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Types
export type DaySchedule = {
  day: number
  name: string
  isOnline: boolean
  activities: Activity[]
}

export type Activity = {
  id: string
  time: string
  title: string
  color: string
}

export type TimezoneConfig = {
  id: string
  timezone: string
  label: string
}

export type ScheduleStyle = 'ribbon' | 'cards' | 'minimal' | 'gradient' | 'timeline' | 'compact' | 'calendar' | 'week'

export type WidgetType = 
  | 'schedule' 
  | 'image' 
  | 'title' 
  | 'text' 
  | 'social' 
  | 'divider' 
  | 'color-block'
  | 'custom-html'

export type Widget = {
  id: string
  type: WidgetType
  enabled: boolean
  config: WidgetConfig
}

export type WidgetConfig = {
  // Common
  width?: string
  padding?: string
  margin?: string
  backgroundColor?: string
  
  // Schedule-specific
  scheduleStyle?: ScheduleStyle
  showDayNumbers?: boolean
  showDayNames?: boolean
  compactMode?: boolean
  
  // Image-specific
  imageUrl?: string
  imageAlt?: string
  imageWidth?: string
  imageRounded?: string
  imageBorder?: string
  
  // Title-specific
  titleText?: string
  titleSize?: string
  titleAlign?: string
  titleColor?: string
  
  // Text-specific
  textContent?: string
  textSize?: string
  textAlign?: string
  textColor?: string
  
  // Social-specific
  socialLinks?: SocialLink[]
  
  // Divider-specific
  dividerStyle?: string
  dividerColor?: string
  dividerHeight?: string
  
  // Color block-specific
  blockColor?: string
  blockHeight?: string
  borderRadius?: string
  
  // Custom HTML
  customHTML?: string
}

export type SocialLink = {
  platform: string
  url: string
  label?: string
}

export type ColorPreset = 'strechedule-dark' | 'strechedule-light' | 'catppuccin-mocha' | 'catppuccin-macchiato' | 'dracula' | 'monokai' | 'nord' | 'synthwave' | 'gruvbox' | 'solarized-dark' | 'custom'

export type Language = 'en' | 'es' | 'pt' | 'fr' | 'de' | 'ja' | 'ko' | 'zh'

export type AppSettings = {
  colorPreset: ColorPreset
  customColors: Record<string, string>
  language: Language
  show12HourFormat: boolean
  customCSS: string
  backgroundType: 'gradient' | 'image' | 'solid' | 'grid'
  customBackground: string | null
  exportWidth: number
  exportHeight: number
  widgetColors: {
    primary: string
    secondary: string
    accent: string
    surface: string
    border: string
    text: string
    textMuted: string
    success: string
    warning: string
    error: string
  }
}

type Store = {
  // Data
  days: DaySchedule[]
  timezones: TimezoneConfig[]
  
  // Widgets
  widgets: Widget[]
  
  // Settings
  settings: AppSettings
  
  // Actions - Data
  setDayOnline: (day: number, isOnline: boolean) => void
  setActivity: (day: number, activity: Activity) => void
  removeActivity: (day: number, activityId: string) => void
  addActivity: (day: number, activity: Omit<Activity, 'id'>) => void
  addTimezone: (timezone: string, label: string) => void
  removeTimezone: (timezoneId: string) => void
  
  // Actions - Widgets
  addWidget: (type: WidgetType) => void
  removeWidget: (widgetId: string) => void
  updateWidget: (widgetId: string, updates: Partial<Widget>) => void
  updateWidgetConfig: (widgetId: string, config: Partial<WidgetConfig>) => void
  duplicateWidget: (widgetId: string) => void
  
  // Actions - Settings
  updateSettings: (settings: Partial<AppSettings>) => void
  resetSettings: () => void
  
  // Actions - URL
  loadFromUrl: () => void
  
  // Actions - Export/Import
  exportState: () => string
  importState: (json: string) => void
}

// Defaults
const defaultDays: DaySchedule[] = [
  { day: 1, name: 'Monday', isOnline: true, activities: [] },
  { day: 2, name: 'Tuesday', isOnline: true, activities: [] },
  { day: 3, name: 'Wednesday', isOnline: true, activities: [] },
  { day: 4, name: 'Thursday', isOnline: true, activities: [] },
  { day: 5, name: 'Friday', isOnline: true, activities: [] },
  { day: 6, name: 'Saturday', isOnline: false, activities: [] },
  { day: 7, name: 'Sunday', isOnline: false, activities: [] },
]

const defaultTimezones: TimezoneConfig[] = [
  { id: 'utc', timezone: 'UTC', label: 'UTC' },
]

const defaultWidgets: Widget[] = [
  {
    id: 'title-1',
    type: 'title',
    enabled: true,
    config: {
      titleText: 'Stream Schedule',
      titleSize: 'large',
      titleAlign: 'center',
    },
  },
  {
    id: 'schedule-1',
    type: 'schedule',
    enabled: true,
    config: {
      scheduleStyle: 'ribbon',
      showDayNumbers: true,
      showDayNames: true,
      compactMode: false,
    },
  },
]

const defaultSettings: AppSettings = {
  colorPreset: 'strechedule-dark',
  customColors: {},
  language: 'en',
  show12HourFormat: false,
  customCSS: '',
  backgroundType: 'grid',
  customBackground: null,
  exportWidth: 1280,
  exportHeight: 720,
  widgetColors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    surface: '#1e293b',
    border: '#334155',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  },
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export const useScheduleStore = create<Store>()(
  persist(
    (set, get) => ({
      days: defaultDays,
      timezones: defaultTimezones,
      widgets: defaultWidgets,
      settings: defaultSettings,

      setDayOnline: (day, isOnline) =>
        set((state) => ({
          days: state.days.map((d) =>
            d.day === day ? { ...d, isOnline } : d
          ),
        })),

      setActivity: (day, activity) =>
        set((state) => ({
          days: state.days.map((d) =>
            d.day === day
              ? {
                  ...d,
                  activities: d.activities.map((a) =>
                    a.id === activity.id ? activity : a
                  ),
                }
              : d
          ),
        })),

      removeActivity: (day, activityId) =>
        set((state) => ({
          days: state.days.map((d) =>
            d.day === day
              ? { ...d, activities: d.activities.filter((a) => a.id !== activityId) }
              : d
          ),
        })),

      addActivity: (day, activity) =>
        set((state) => ({
          days: state.days.map((d) =>
            d.day === day
              ? {
                  ...d,
                  activities: [
                    ...d.activities,
                    { ...activity, id: generateId() },
                  ].sort((a, b) => a.time.localeCompare(b.time)),
                }
              : d
          ),
        })),

      addTimezone: (timezone, label) =>
        set((state) => ({
          timezones: [
            ...state.timezones,
            { id: generateId(), timezone, label },
          ],
        })),

      removeTimezone: (timezoneId) =>
        set((state) => ({
          timezones: state.timezones.filter((t) => t.id !== timezoneId),
        })),

      addWidget: (type) => {
        const newWidget: Widget = {
          id: `${type}-${generateId()}`,
          type,
          enabled: true,
          config: getDefaultWidgetConfig(type),
        }
        set((state) => ({ widgets: [...state.widgets, newWidget] }))
      },

      removeWidget: (widgetId) =>
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== widgetId),
        })),

      updateWidget: (widgetId, updates) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === widgetId ? { ...w, ...updates } : w
          ),
        })),

      updateWidgetConfig: (widgetId, config) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === widgetId ? { ...w, config: { ...w.config, ...config } } : w
          ),
        })),

      duplicateWidget: (widgetId) => {
        const widget = get().widgets.find((w) => w.id === widgetId)
        if (widget) {
          const newWidget: Widget = {
            ...widget,
            id: `${widget.type}-${generateId()}`,
            config: { ...widget.config },
          }
          set((state) => ({ widgets: [...state.widgets, newWidget] }))
        }
      },

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      resetSettings: () =>
        set({ settings: defaultSettings }),

      loadFromUrl: () => {
        try {
          const params = new URLSearchParams(window.location.search)
          const stateParam = params.get('state')
          
          if (stateParam) {
            try {
              const decoded = atob(stateParam)
              const parsed = JSON.parse(decoded)
              
              if (!parsed.days || !Array.isArray(parsed.days)) {
                throw new Error('Invalid days data in URL state')
              }
              if (!parsed.timezones || !Array.isArray(parsed.timezones)) {
                throw new Error('Invalid timezones data in URL state')
              }
              
              set({
                days: parsed.days,
                timezones: parsed.timezones,
                widgets: parsed.widgets || defaultWidgets,
                settings: { ...defaultSettings, ...parsed.settings },
              })
            } catch (e) {
              console.error('Failed to parse state from URL:', e)
              throw new Error('Invalid URL state. Please check your link.')
            }
          }
        } catch (e) {
          console.error('Error loading from URL:', e)
          throw e
        }
      },

      exportState: () => {
        const state = get()
        return JSON.stringify({ 
          days: state.days, 
          timezones: state.timezones,
          widgets: state.widgets,
          settings: state.settings
        }, null, 2)
      },

      importState: (json: string) => {
        try {
          const parsed = JSON.parse(json)
          
          if (!parsed.days || !Array.isArray(parsed.days)) {
            throw new Error('Invalid days data in import file')
          }
          if (!parsed.timezones || !Array.isArray(parsed.timezones)) {
            throw new Error('Invalid timezones data in import file')
          }
          
          set({
            days: parsed.days,
            timezones: parsed.timezones,
            widgets: parsed.widgets || defaultWidgets,
            settings: { ...defaultSettings, ...parsed.settings },
          })
        } catch (e) {
          console.error('Failed to import state:', e)
          throw new Error(e instanceof Error ? e.message : 'Invalid import file format')
        }
      },
    }),
    {
      name: 'schedule-storage-v3',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        days: state.days,
        timezones: state.timezones,
        widgets: state.widgets,
        settings: state.settings,
      }),
    }
  )
)

function getDefaultWidgetConfig(type: WidgetType): WidgetConfig {
  switch (type) {
    case 'schedule':
      return {
        scheduleStyle: 'ribbon',
        showDayNumbers: true,
        showDayNames: true,
        compactMode: false,
      }
    case 'image':
      return {
        imageWidth: '100%',
        imageRounded: 'rounded-lg',
        imageBorder: '',
      }
    case 'title':
      return {
        titleText: 'New Title',
        titleSize: 'large',
        titleAlign: 'center',
      }
    case 'text':
      return {
        textContent: 'Add your text here...',
        textSize: 'normal',
        textAlign: 'left',
      }
    case 'social':
      return {
        socialLinks: [],
      }
    case 'divider':
      return {
        dividerStyle: 'solid',
        dividerHeight: '1px',
      }
    case 'color-block':
      return {
        blockColor: '#3b82f6',
      }
    case 'custom-html':
      return {
        customHTML: '<div>Custom HTML</div>',
      }
    default:
      return {}
  }
}

export function syncStateToUrl() {
  try {
    const state = useScheduleStore.getState()
    
    const data = JSON.stringify({ 
      days: state.days, 
      timezones: state.timezones,
      widgets: state.widgets,
      settings: state.settings
    })
    
    const encoded = btoa(data)
    if (encoded.length > 1500) {
      console.warn('State too large for URL, skipping sync')
      return
    }
    
    const params = new URLSearchParams(window.location.search)
    params.set('state', encoded)
    
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, '', newUrl)
  } catch (e) {
    console.warn('Failed to sync state to URL:', e)
  }
}
