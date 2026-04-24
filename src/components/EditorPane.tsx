import { useState } from 'react'
import { useScheduleStore, Activity } from '../store/useScheduleStore'
import { MAJOR_TIMEZONES } from '../utils/time'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings2,
  Clock,
  Plus,
  Trash2,
  Sun,
  Moon,
  Globe,
  Download,
  X,
} from 'lucide-react'
import { toPng } from 'html-to-image'
import { clsx } from 'clsx'

const COLORS = [
  { value: 'bg-primary-500', label: 'Purple' },
  { value: 'bg-accent-500', label: 'Gold' },
  { value: 'bg-blue-500', label: 'Blue' },
  { value: 'bg-green-500', label: 'Green' },
  { value: 'bg-pink-500', label: 'Pink' },
  { value: 'bg-purple-500', label: 'Violet' },
  { value: 'bg-indigo-500', label: 'Indigo' },
  { value: 'bg-teal-500', label: 'Teal' },
]

function TimezoneSelector() {
  const { timezones, addTimezone, removeTimezone } = useScheduleStore()
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filteredTimezones = MAJOR_TIMEZONES.filter(
    (tz) =>
      !timezones.find((t) => t.timezone === tz.timezone) &&
      (tz.label.toLowerCase().includes(search.toLowerCase()) ||
        tz.timezone.toLowerCase().includes(search.toLowerCase()))
  )

  const handleExport = async () => {
    const element = document.querySelector<HTMLElement>('[data-export="schedule"]')
    if (!element) return

    try {
      const dataUrl = await toPng(element, {
        backgroundColor: '#0f172a',
        pixelRatio: 2,
      })
      
      const link = document.createElement('a')
      link.download = 'stream-schedule.png'
      link.href = dataUrl
      link.click()
    } catch (e) {
      console.error('Export failed:', e)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-dark-300 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Timezones
        </h3>
        <button
          onClick={handleExport}
          className="text-xs flex items-center gap-1 text-accent-400 hover:text-accent-300 transition-colors"
        >
          <Download className="w-3 h-3" />
          Export PNG
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {timezones.map((tz) => (
            <motion.span
              key={tz.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={clsx(
                'px-3 py-1.5 rounded-full text-sm flex items-center gap-2',
                tz.id === 'utc'
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-700 text-dark-200'
              )}
            >
              {tz.label}
              {tz.id !== 'utc' && (
                <button
                  onClick={() => removeTimezone(tz.id)}
                  className="hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Add timezone..."
          className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
        />
        {isOpen && filteredTimezones.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-dark-800 border border-dark-700 rounded-lg shadow-xl max-h-48 overflow-y-auto z-50">
            {filteredTimezones.map((tz) => (
              <button
                key={tz.timezone}
                onClick={() => {
                  addTimezone(tz.timezone, tz.label)
                  setSearch('')
                  setIsOpen(false)
                }}
                className="w-full px-4 py-2 text-left text-sm text-dark-200 hover:bg-dark-700 transition-colors"
              >
                {tz.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ActivityForm({
  activity,
  onUpdate,
  onDelete,
}: {
  activity: Activity
  onUpdate: (activity: Activity) => void
  onDelete: () => void
}) {
  return (
    <motion.div
      layout
      className="p-4 bg-dark-800 rounded-lg space-y-3"
    >
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={activity.title}
          onChange={(e) => onUpdate({ ...activity, title: e.target.value })}
          className="flex-1 bg-transparent text-sm text-dark-200 placeholder-dark-500 focus:outline-none"
          placeholder="Activity title"
        />
        <button
          onClick={onDelete}
          className="text-dark-500 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-dark-400" />
        <input
          type="time"
          value={activity.time}
          onChange={(e) => onUpdate({ ...activity, time: e.target.value })}
          className="flex-1 bg-transparent text-sm text-dark-200 focus:outline-none"
        />
      </div>
      <div className="flex gap-2">
        {COLORS.map((color) => (
          <button
            key={color.value}
            onClick={() => onUpdate({ ...activity, color: color.value })}
            className={clsx(
              'w-6 h-6 rounded-full transition-transform hover:scale-110',
              color.value,
              activity.color === color.value && 'ring-2 ring-white ring-offset-2 ring-offset-dark-800'
            )}
            title={color.label}
          />
        ))}
      </div>
    </motion.div>
  )
}

function DayEditor({ daySchedule }: { daySchedule: { day: number; name: string; isOnline: boolean; activities: Activity[] } }) {
  const { setDayOnline, addActivity, setActivity, removeActivity } = useScheduleStore()

  return (
    <motion.div
      layout
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDayOnline(daySchedule.day, !daySchedule.isOnline)}
            className={clsx(
              'px-3 py-1 rounded-full text-xs font-semibold transition-colors',
              daySchedule.isOnline
                ? 'bg-primary-600 text-white'
                : 'bg-dark-700 text-dark-400'
            )}
          >
            {daySchedule.isOnline ? 'ONLINE' : 'OFFLINE'}
          </button>
          <span className="text-sm text-dark-300">{daySchedule.name}</span>
        </div>
      </div>

      <AnimatePresence>
        {daySchedule.isOnline && (
          <>
            {daySchedule.activities.map((activity) => (
              <ActivityForm
                key={activity.id}
                activity={activity}
                onUpdate={(updated) => setActivity(daySchedule.day, updated)}
                onDelete={() => removeActivity(daySchedule.day, activity.id)}
              />
            ))}
            <button
              onClick={() =>
                addActivity(daySchedule.day, {
                  time: '12:00',
                  title: '',
                  color: COLORS[0].value,
                })
              }
              className="w-full py-2 border-2 border-dashed border-dark-700 rounded-lg text-dark-400 hover:border-primary-500 hover:text-primary-400 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Activity
            </button>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function EditorPane() {
  const { theme, setTheme, days } = useScheduleStore()

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-80 bg-dark-900 border-r border-dark-800 overflow-y-auto"
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary-400" />
            <h1 className="font-bold text-lg text-white">Schedule Editor</h1>
          </div>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-accent-400" />
            ) : (
              <Moon className="w-4 h-4 text-primary-400" />
            )}
          </button>
        </div>

        <TimezoneSelector />

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-dark-300">Days</h3>
          {days.map((day) => (
            <DayEditor key={day.day} daySchedule={day} />
          ))}
        </div>
      </div>
    </motion.aside>
  )
}
