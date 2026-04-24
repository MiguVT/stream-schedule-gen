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

export type LayoutType = 'default' | 'avatar-left' | 'avatar-right' | 'avatar-top' | 'minimal'

export type ColorPreset = 'strechedule-dark' | 'strechedule-light' | 'catppuccin-mocha' | 'catppuccin-macchiato' | 'dracula' | 'monokai' | 'nord' | 'synthwave' | 'gruvbox' | 'solarized-dark' | 'custom'

export type Language = 'en' | 'es' | 'pt' | 'fr' | 'de' | 'ja' | 'ko' | 'zh'

export type DayFormat = 'day' | 'day-name' | 'day-number' | 'day-month' | 'short-name'

export type AppSettings = {
  // Theme & Colors
  colorPreset: ColorPreset
  customColors: Record<string, string>
  
  // Layout & Style
  scheduleStyle: ScheduleStyle
  layout: LayoutType
  avatarImage: string | null
  avatarSize: 'small' | 'medium' | 'large'
  showAvatarName: boolean
  avatarName: string
  
  // Background
  customBackground: string | null
  backgroundType: 'gradient' | 'image' | 'solid' | 'grid'
  
  // Advanced
  customCSS: string
  
  // Language & Localization
  language: Language
  show12HourFormat: boolean
  
  // Display options
  dayFormat: DayFormat
  showDayNames: boolean
  showDayNumbers: boolean
  showTimezoneLabels: boolean
  compactMode: boolean
  
  // Export options
  exportWidth: number
  exportHeight: number
}

type Store = {
  // Data
  days: DaySchedule[]
  timezones: TimezoneConfig[]
  
  // Settings
  settings: AppSettings
  
  // Actions - Data
  setDayOnline: (day: number, isOnline: boolean) => void
  setActivity: (day: number, activity: Activity) => void
  removeActivity: (day: number, activityId: string) => void
  addActivity: (day: number, activity: Omit<Activity, 'id'>) => void
  addTimezone: (timezone: string, label: string) => void
  removeTimezone: (timezoneId: string) => void
  
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

const defaultSettings: AppSettings = {
  colorPreset: 'strechedule-dark',
  customColors: {},
  scheduleStyle: 'ribbon',
  layout: 'default',
  avatarImage: null,
  avatarSize: 'medium',
  showAvatarName: false,
  avatarName: '',
  customBackground: null,
  backgroundType: 'grid',
  customCSS: '',
  language: 'en',
  show12HourFormat: false,
  dayFormat: 'day-name',
  showDayNames: true,
  showDayNumbers: true,
  showTimezoneLabels: true,
  compactMode: false,
  exportWidth: 1280,
  exportHeight: 720,
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export const useScheduleStore = create<Store>()(
  persist(
    (set, get) => ({
      days: defaultDays,
      timezones: defaultTimezones,
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
            settings: { ...defaultSettings, ...parsed.settings },
          })
        } catch (e) {
          console.error('Failed to import state:', e)
          throw new Error(e instanceof Error ? e.message : 'Invalid import file format')
        }
      },
    }),
    {
      name: 'schedule-storage-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        days: state.days,
        timezones: state.timezones,
        settings: state.settings,
      }),
    }
  )
)

export function syncStateToUrl() {
  const state = useScheduleStore.getState()
  const data = JSON.stringify({ 
    days: state.days, 
    timezones: state.timezones,
    settings: state.settings
  })
  const encoded = btoa(data)
  
  const params = new URLSearchParams(window.location.search)
  params.set('state', encoded)
  
  const newUrl = `${window.location.pathname}?${params.toString()}`
  window.history.replaceState({}, '', newUrl)
}

export const PRESET_TEMPLATES = {
  vtuber_daily: {
    days: [
      { day: 1, name: 'Monday', isOnline: true, activities: [{ id: '1', time: '18:00', title: 'Good Evening Stream', color: 'bg-pink-500' }, { id: '2', time: '22:00', title: 'Late Night Chill', color: 'bg-purple-500' }] },
      { day: 2, name: 'Tuesday', isOnline: true, activities: [{ id: '3', time: '18:00', title: 'Good Evening Stream', color: 'bg-pink-500' }, { id: '4', time: '22:00', title: 'Late Night Chill', color: 'bg-purple-500' }] },
      { day: 3, name: 'Wednesday', isOnline: true, activities: [{ id: '5', time: '18:00', title: 'Good Evening Stream', color: 'bg-pink-500' }, { id: '6', time: '22:00', title: 'Late Night Chill', color: 'bg-purple-500' }] },
      { day: 4, name: 'Thursday', isOnline: true, activities: [{ id: '7', time: '18:00', title: 'Good Evening Stream', color: 'bg-pink-500' }, { id: '8', time: '22:00', title: 'Late Night Chill', color: 'bg-purple-500' }] },
      { day: 5, name: 'Friday', isOnline: true, activities: [{ id: '9', time: '19:00', title: 'Weekend Kickoff', color: 'bg-pink-500' }, { id: '10', time: '23:00', title: 'Party Time', color: 'bg-purple-500' }] },
      { day: 6, name: 'Saturday', isOnline: true, activities: [{ id: '11', time: '14:00', title: 'Afternoon Stream', color: 'bg-pink-500' }, { id: '12', time: '20:00', title: 'Night Stream', color: 'bg-purple-500' }] },
      { day: 7, name: 'Sunday', isOnline: false, activities: [] },
    ],
    timezones: [{ id: '1', timezone: 'UTC', label: 'UTC' }, { id: '2', timezone: 'Asia/Tokyo', label: 'Tokyo' }],
    settings: { colorPreset: 'catppuccin-mocha', scheduleStyle: 'ribbon', layout: 'avatar-left', backgroundType: 'grid' },
  },
  gamer_weekend: {
    days: [
      { day: 1, name: 'Monday', isOnline: false, activities: [] },
      { day: 2, name: 'Tuesday', isOnline: false, activities: [] },
      { day: 3, name: 'Wednesday', isOnline: false, activities: [] },
      { day: 4, name: 'Thursday', isOnline: false, activities: [] },
      { day: 5, name: 'Friday', isOnline: true, activities: [{ id: '1', time: '20:00', title: 'Friday Night Gaming', color: 'bg-green-500' }] },
      { day: 6, name: 'Saturday', isOnline: true, activities: [{ id: '2', time: '12:00', title: 'Weekend Grind', color: 'bg-green-500' }, { id: '3', time: '18:00', title: 'Co-op Session', color: 'bg-teal-500' }] },
      { day: 7, name: 'Sunday', isOnline: true, activities: [{ id: '4', time: '14:00', title: 'Chill Sunday', color: 'bg-green-500' }] },
    ],
    timezones: [{ id: '1', timezone: 'UTC', label: 'UTC' }, { id: '2', timezone: 'America/New_York', label: 'New York' }],
    settings: { colorPreset: 'dracula', scheduleStyle: 'cards', layout: 'default', backgroundType: 'grid' },
  },
  content_creator: {
    days: [
      { day: 1, name: 'Monday', isOnline: true, activities: [{ id: '1', time: '16:00', title: 'Content Creation', color: 'bg-blue-500' }, { id: '2', time: '20:00', title: 'Live Stream', color: 'bg-indigo-500' }] },
      { day: 2, name: 'Tuesday', isOnline: true, activities: [{ id: '3', time: '16:00', title: 'Content Creation', color: 'bg-blue-500' }, { id: '4', time: '20:00', title: 'Live Stream', color: 'bg-indigo-500' }] },
      { day: 3, name: 'Wednesday', isOnline: true, activities: [{ id: '5', time: '16:00', title: 'Content Creation', color: 'bg-blue-500' }, { id: '6', time: '20:00', title: 'Live Stream', color: 'bg-indigo-500' }] },
      { day: 4, name: 'Thursday', isOnline: true, activities: [{ id: '7', time: '16:00', title: 'Content Creation', color: 'bg-blue-500' }, { id: '8', time: '20:00', title: 'Live Stream', color: 'bg-indigo-500' }] },
      { day: 5, name: 'Friday', isOnline: true, activities: [{ id: '9', time: '18:00', title: 'Special Stream', color: 'bg-purple-500' }] },
      { day: 6, name: 'Saturday', isOnline: true, activities: [{ id: '10', time: '15:00', title: 'Community Day', color: 'bg-pink-500' }] },
      { day: 7, name: 'Sunday', isOnline: false, activities: [] },
    ],
    timezones: [{ id: '1', timezone: 'UTC', label: 'UTC' }, { id: '2', timezone: 'America/Los_Angeles', label: 'Los Angeles' }, { id: '3', timezone: 'Europe/London', label: 'London' }],
    settings: { colorPreset: 'strechedule-dark', scheduleStyle: 'timeline', layout: 'default', backgroundType: 'gradient' },
  },
  minimal_schedule: {
    days: [
      { day: 1, name: 'Monday', isOnline: true, activities: [{ id: '1', time: '19:00', title: 'Stream', color: 'bg-primary-500' }] },
      { day: 2, name: 'Tuesday', isOnline: true, activities: [{ id: '2', time: '19:00', title: 'Stream', color: 'bg-primary-500' }] },
      { day: 3, name: 'Wednesday', isOnline: true, activities: [{ id: '3', time: '19:00', title: 'Stream', color: 'bg-primary-500' }] },
      { day: 4, name: 'Thursday', isOnline: true, activities: [{ id: '4', time: '19:00', title: 'Stream', color: 'bg-primary-500' }] },
      { day: 5, name: 'Friday', isOnline: true, activities: [{ id: '5', time: '19:00', title: 'Stream', color: 'bg-primary-500' }] },
      { day: 6, name: 'Saturday', isOnline: false, activities: [] },
      { day: 7, name: 'Sunday', isOnline: false, activities: [] },
    ],
    timezones: [{ id: '1', timezone: 'UTC', label: 'UTC' }],
    settings: { colorPreset: 'nord', scheduleStyle: 'minimal', layout: 'minimal', backgroundType: 'solid' },
  },
}

export function loadPreset(presetName: keyof typeof PRESET_TEMPLATES) {
  const preset = PRESET_TEMPLATES[presetName]
  if (!preset) return
  
  useScheduleStore.setState({
    days: preset.days,
    timezones: preset.timezones,
    settings: { ...defaultSettings, ...preset.settings } as AppSettings,
  })
}
