import { useScheduleStore } from '../store/useScheduleStore'
import { formatTimeForZones } from '../utils/time'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

function DiamondMarker({ day, isOnline }: { day: number; isOnline: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center w-20">
      <div
        className={clsx(
          'w-14 h-14 flex items-center justify-center text-lg font-bold',
          'clip-diamond',
          isOnline ? 'bg-primary-600 text-white' : 'bg-dark-700 text-dark-400'
        )}
        style={{
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        }}
      >
        {day}
      </div>
      <span
        className={clsx(
          'mt-2 text-sm font-medium',
          isOnline ? 'text-primary-400' : 'text-dark-500'
        )}
      >
        {isOnline ? 'ON' : 'OFF'}
      </span>
    </div>
  )
}

function ActivityRow({
  activity,
  timezones,
}: {
  activity: { id: string; time: string; title: string; color: string }
  timezones: Array<{ id: string; timezone: string; label: string }>
}) {
  const formattedTimes = formatTimeForZones(activity.time, timezones)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative flex items-center"
    >
      <div
        className={clsx(
          'flex-1 py-4 px-6 flex items-center gap-4',
          'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-2',
          'before:bg-current before:opacity-20',
          activity.color.replace('bg-', 'text-')
        )}
        style={{
          clipPath: 'polygon(0% 0%, calc(100% - 1rem) 0%, 100% 50%, calc(100% - 1rem) 100%, 0% 100%, 0% 50%)',
          backgroundColor: 'transparent',
        }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-white">{activity.title}</span>
          <span className="text-dark-400">•</span>
          <div className="flex flex-wrap gap-2 text-sm">
            {formattedTimes.map((ft, i) => (
              <span key={i} className="text-dark-300">
                {ft.flag} {ft.formatted}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function DayRow({ daySchedule }: { daySchedule: { day: number; name: string; isOnline: boolean; activities: Array<{ id: string; time: string; title: string; color: string }> } }) {
  const timezones = useScheduleStore((state) => state.timezones)

  if (!daySchedule.isOnline) {
    return (
      <div className="flex items-center gap-4 p-6 opacity-50">
        <DiamondMarker day={daySchedule.day} isOnline={false} />
        <div className="flex-1 py-4 px-6 bg-dark-800/50 rounded-lg" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 p-6">
      <DiamondMarker day={daySchedule.day} isOnline={true} />
      <div className="flex-1 space-y-2">
        {daySchedule.activities.length === 0 ? (
          <div className="py-4 px-6 text-dark-500 italic">No activities scheduled</div>
        ) : (
          daySchedule.activities.map((activity) => (
            <ActivityRow
              key={activity.id}
              activity={activity}
              timezones={timezones}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default function ScheduleCanvas() {
  const { theme, days } = useScheduleStore()

  return (
    <motion.div
      layout
      className={clsx(
        'rounded-2xl p-8',
        theme === 'dark' ? 'bg-dark-800/50' : 'bg-white/90',
        theme === 'dark' ? 'grid-bg' : 'grid-bg-light'
      )}
      style={{
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="space-y-4">
        {days.map((day) => (
          <DayRow key={day.day} daySchedule={day} />
        ))}
      </div>
    </motion.div>
  )
}
