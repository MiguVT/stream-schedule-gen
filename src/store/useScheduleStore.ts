import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

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

export type ScheduleState = {
  theme: 'dark' | 'light'
  days: DaySchedule[]
  timezones: TimezoneConfig[]
  setTheme: (theme: 'dark' | 'light') => void
  setDayOnline: (day: number, isOnline: boolean) => void
  setActivity: (day: number, activity: Activity) => void
  removeActivity: (day: number, activityId: string) => void
  addActivity: (day: number, activity: Omit<Activity, 'id'>) => void
  addTimezone: (timezone: string, label: string) => void
  removeTimezone: (timezoneId: string) => void
  loadFromUrl: () => void
}

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

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set) => ({
      theme: 'dark',
      days: defaultDays,
      timezones: defaultTimezones,

      setTheme: (theme) => set({ theme }),

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

      loadFromUrl: () => {
        const params = new URLSearchParams(window.location.search)
        const stateParam = params.get('state')
        
        if (stateParam) {
          try {
            const decoded = atob(stateParam)
            const parsed = JSON.parse(decoded)
            
            set({
              theme: parsed.theme || 'dark',
              days: parsed.days || defaultDays,
              timezones: parsed.timezones || defaultTimezones,
            })
          } catch (e) {
            console.error('Failed to parse state from URL:', e)
          }
        }
      },
    }),
    {
      name: 'schedule-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        days: state.days,
        timezones: state.timezones,
      }),
    }
  )
)

export function syncStateToUrl() {
  const { theme, days, timezones } = useScheduleStore.getState()
  const state = JSON.stringify({ theme, days, timezones })
  const encoded = btoa(state)
  
  const params = new URLSearchParams(window.location.search)
  params.set('state', encoded)
  
  const newUrl = `${window.location.pathname}?${params.toString()}`
  window.history.replaceState({}, '', newUrl)
}
