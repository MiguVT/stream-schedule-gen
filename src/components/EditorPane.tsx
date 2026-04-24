import { useState, useRef, useEffect } from 'react'
import { useScheduleStore, Activity, DaySchedule, TimezoneConfig } from '../store/useScheduleStore'
import { MAJOR_TIMEZONES, getFlag } from '../utils/time'
import { useTranslation } from '../utils/i18n'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  Plus,
  Trash2,
  Globe,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
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

function TimezonesSection() {
  const { timezones, addTimezone, removeTimezone } = useScheduleStore()
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredTimezones = MAJOR_TIMEZONES.filter(
    (tz) =>
      !timezones.find((t: TimezoneConfig) => t.timezone === tz.timezone) &&
      (tz.label.toLowerCase().includes(search.toLowerCase()) ||
        tz.timezone.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-dark-300 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          {t('timezones_title')}
        </h3>
        <span className="text-xs text-dark-500">{timezones.length} active</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {timezones.map((tz: TimezoneConfig) => {
            const flag = getFlag(tz.timezone)
            return (
              <motion.button
                key={tz.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => removeTimezone(tz.id)}
                className={clsx(
                  'px-3 py-1.5 rounded-full text-sm flex items-center gap-2 transition-all hover:scale-105',
                  tz.id === 'utc'
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-700 text-dark-200 hover:bg-red-900/50'
                )}
                title={t('click_to_remove')}
              >
                {flag} {tz.label}
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      <div className="relative" ref={dropdownRef}>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={t('search_timezones')}
          className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
        />
        {isOpen && filteredTimezones.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-dark-800 border border-dark-700 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
            {filteredTimezones.map((tz: typeof MAJOR_TIMEZONES[0]) => (
              <button
                key={tz.timezone}
                onClick={() => {
                  addTimezone(tz.timezone, tz.label)
                  setSearch('')
                  setIsOpen(false)
                }}
                className="w-full px-4 py-2 text-left text-sm text-dark-200 hover:bg-dark-700 transition-colors flex items-center gap-2"
              >
                <span className="text-lg">{tz.flag}</span>
                <span>{tz.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function DaysSection() {
  const { days, setDayOnline, addActivity, setActivity, removeActivity } = useScheduleStore()
  const { t } = useTranslation()

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-dark-300 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        {t('days_title')}
      </h3>
      {days.map((day: DaySchedule) => (
        <DayEditor
          key={day.day}
          daySchedule={day}
          setDayOnline={setDayOnline}
          addActivity={addActivity}
          setActivity={setActivity}
          removeActivity={removeActivity}
        />
      ))}
    </div>
  )
}

function DayEditor({
  daySchedule,
  setDayOnline,
  addActivity,
  setActivity,
  removeActivity,
}: {
  daySchedule: DaySchedule
  setDayOnline: (day: number, isOnline: boolean) => void
  addActivity: (day: number, activity: Omit<Activity, 'id'>) => void
  setActivity: (day: number, activity: Activity) => void
  removeActivity: (day: number, activityId: string) => void
}) {
  const [isExpanded, setIsExpanded] = useState(daySchedule.activities.length > 0)
  const { t } = useTranslation()

  return (
    <motion.div layout className="border border-dark-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-dark-800 hover:bg-dark-750 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-dark-400 font-mono text-sm">{daySchedule.day}</span>
          <span className="text-dark-200">{daySchedule.name}</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-dark-400" /> : <ChevronDown className="w-4 h-4 text-dark-400" />}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 py-3 space-y-3 bg-dark-850"
          >
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
                {daySchedule.isOnline ? t('online') : t('offline')}
              </button>
            </div>

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
                className="w-full py-2.5 border-2 border-dashed border-dark-700 rounded-lg text-dark-400 hover:border-primary-500 hover:text-primary-400 hover:bg-primary-500/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                {t('add_activity')}
              </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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
  const { t } = useTranslation()

  return (
    <motion.div layout className="p-4 bg-dark-800 rounded-lg space-y-3">
      <div className="flex items-center justify-between gap-3">
        <input
          type="text"
          value={activity.title}
          onChange={(e) => onUpdate({ ...activity, title: e.target.value })}
          className="flex-1 bg-transparent text-sm font-medium text-dark-200 placeholder-dark-500 focus:outline-none"
          placeholder={t('activity_title')}
        />
        <button onClick={onDelete} className="text-dark-500 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-900/20">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-dark-400" />
        <input
          type="time"
          value={activity.time}
          onChange={(e) => onUpdate({ ...activity, time: e.target.value })}
          className="flex-1 bg-transparent text-sm text-dark-200 focus:outline-none font-mono"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        {COLORS.map((color) => (
          <button
            key={color.value}
            onClick={() => onUpdate({ ...activity, color: color.value })}
            className={clsx(
              'w-6 h-6 rounded-full transition-all hover:scale-110',
              color.value,
              activity.color === color.value ? 'ring-2 ring-white ring-offset-2 ring-offset-dark-800 scale-110' : 'opacity-70 hover:opacity-100'
            )}
            title={color.label}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default function EditorPane() {
  return (
    <div className="space-y-8">
      <TimezonesSection />
      <div className="pt-6 border-t border-dark-700">
        <DaysSection />
      </div>
    </div>
  )
}
