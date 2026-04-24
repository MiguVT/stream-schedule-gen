import { useScheduleStore, TimezoneConfig } from '../store/useScheduleStore'
import { formatTimeForZones } from '../utils/time'
import { useTheme } from '../utils/theme'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

function DiamondMarker({ day, isOnline, colors }: { day: number; isOnline: boolean; colors: any }) {
  return (
    <div className="flex flex-col items-center justify-center w-20">
      <div
        className={clsx(
          'w-14 h-14 flex items-center justify-center text-lg font-bold',
          isOnline ? `${colors.primary} text-white` : `${colors.bgTertiary} ${colors.textMuted}`
        )}
        style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
      >
        {day}
      </div>
      <span className={clsx('mt-2 text-sm font-medium', isOnline ? 'text-primary-400' : colors.textMuted)}>
        {isOnline ? 'ON' : 'OFF'}
      </span>
    </div>
  )
}

function RibbonActivityRow({ activity, timezones, colors, show12Hour }: { activity: any; timezones: TimezoneConfig[]; colors: any; show12Hour: boolean }) {
  const formattedTimes = formatTimeForZones(activity.time, timezones, show12Hour)

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative flex items-center">
      <div
        className={clsx('flex-1 py-4 px-6 flex items-center gap-4', 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-2 before:bg-current before:opacity-20', activity.color.replace('bg-', 'text-'))}
        style={{ clipPath: 'polygon(0% 0%, calc(100% - 1rem) 0%, 100% 50%, calc(100% - 1rem) 100%, 0% 100%, 0% 50%)', backgroundColor: 'transparent' }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-semibold ${colors.text}`}>{activity.title}</span>
          <span className={colors.textMuted}>•</span>
          <div className="flex flex-wrap gap-2 text-sm">
            {formattedTimes.map((ft: any, i: number) => (
              <span key={i} className={colors.textSecondary}>{ft.flag} {ft.formatted}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function CardActivityRow({ activity, timezones, colors, show12Hour }: { activity: any; timezones: TimezoneConfig[]; colors: any; show12Hour: boolean }) {
  const formattedTimes = formatTimeForZones(activity.time, timezones, show12Hour)

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
      <div className={clsx('py-3 px-4 rounded-lg flex items-center justify-between', `${colors.surface} ${colors.border}`, activity.color.replace('bg-', 'border-').replace('500', '500/50'))}>
        <div className="flex items-center gap-3">
          <div className={clsx('w-3 h-3 rounded-full', activity.color)} />
          <span className={`font-medium ${colors.text}`}>{activity.title}</span>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          {formattedTimes.map((ft: any, i: number) => (
            <span key={i} className={colors.textMuted}>{ft.flag} {ft.formatted}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function MinimalActivityRow({ activity, timezones, colors, show12Hour }: { activity: any; timezones: TimezoneConfig[]; colors: any; show12Hour: boolean }) {
  const formattedTimes = formatTimeForZones(activity.time, timezones, show12Hour)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
      <div className={`py-2 px-2 flex items-center justify-between border-b ${colors.borderLight} last:border-0`}>
        <span className={colors.text}>{activity.title}</span>
        <div className="flex gap-2 text-xs">
          {formattedTimes.map((ft: any, i: number) => (
            <span key={i} className={colors.textMuted}>{ft.flag} {ft.formatted}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function GradientActivityRow({ activity, timezones, colors, show12Hour }: { activity: any; timezones: TimezoneConfig[]; colors: any; show12Hour: boolean }) {
  const formattedTimes = formatTimeForZones(activity.time, timezones, show12Hour)

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1">
      <div className={clsx('py-3 px-4 rounded-xl flex items-center gap-4 bg-gradient-to-r from-dark-800 to-dark-900 border-l-4', activity.color.replace('bg-', 'border-'))}>
        <span className={`font-semibold ${colors.text}`}>{activity.title}</span>
        <div className="flex flex-wrap gap-2 text-sm">
          {formattedTimes.map((ft: any, i: number) => (
            <span key={i} className={colors.textMuted}>{ft.flag} {ft.formatted}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function TimelineActivityRow({ activity, timezones, colors, show12Hour }: { activity: any; timezones: TimezoneConfig[]; colors: any; show12Hour: boolean }) {
  const formattedTimes = formatTimeForZones(activity.time, timezones, show12Hour)

  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex-1 relative">
      <div className="flex items-start gap-4">
        <div className={clsx('w-1 h-full min-h-8 rounded-full', activity.color)} />
        <div className="flex-1 py-2 px-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`font-medium ${colors.text}`}>{activity.title}</span>
            <div className="flex gap-2 text-xs">
              {formattedTimes.map((ft: any, i: number) => (
                <span key={i} className={colors.textMuted}>{ft.flag} {ft.formatted}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function CompactActivityRow({ activity, timezones, colors, show12Hour }: { activity: any; timezones: TimezoneConfig[]; colors: any; show12Hour: boolean }) {
  const formattedTimes = formatTimeForZones(activity.time, timezones, show12Hour)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
      <div className={clsx('py-1 px-2 rounded flex items-center gap-2 text-xs', `${colors.surface}`)}>
        <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', activity.color)} />
        <span className={`font-medium ${colors.text} truncate`}>{activity.title}</span>
        <div className="flex gap-1 text-xs flex-shrink-0">
          {formattedTimes.slice(0, 2).map((ft: any, i: number) => (
            <span key={i} className={colors.textMuted}>{ft.flag} {ft.formatted}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function CalendarActivityRow({ activity, timezones, colors, show12Hour }: { activity: any; timezones: TimezoneConfig[]; colors: any; show12Hour: boolean }) {
  const formattedTimes = formatTimeForZones(activity.time, timezones, show12Hour)

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1">
      <div className={clsx('m-1 p-2 rounded-lg border-l-4 shadow-sm', `${colors.surface}`, activity.color.replace('bg-', 'border-'))}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className={clsx('w-2 h-2 rounded-full', activity.color)} />
            <span className={`font-medium ${colors.text}`}>{activity.title}</span>
          </div>
          <div className="flex gap-2 text-xs">
            {formattedTimes.map((ft: any, i: number) => (
              <span key={i} className={colors.textMuted}>{ft.flag} {ft.formatted}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function WeekActivityRow({ activity, timezones, colors, show12Hour }: { activity: any; timezones: TimezoneConfig[]; colors: any; show12Hour: boolean }) {
  const formattedTimes = formatTimeForZones(activity.time, timezones, show12Hour)

  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
      <div className={clsx('py-2 px-3 rounded flex items-center gap-3 border-b border-dashed', colors.borderLight)}>
        <div className={clsx('w-1 h-8 rounded-full flex-shrink-0', activity.color)} />
        <span className={`font-medium ${colors.text} flex-1`}>{activity.title}</span>
        <div className="flex gap-2 text-xs flex-shrink-0">
          {formattedTimes.map((ft: any, i: number) => (
            <span key={i} className={colors.textMuted}>{ft.flag} {ft.formatted}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function DayRow({ daySchedule, style, colors, settings }: { daySchedule: any; style: any; colors: any; settings: any }) {
  const timezones = useScheduleStore((s) => s.timezones as TimezoneConfig[])

  const formatDayHeader = () => {
    const dayNum = daySchedule.day
    const dayName = daySchedule.name
    const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const longDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    switch (settings.dayFormat) {
      case 'day-number':
        return `${dayNum}`
      case 'short-name':
        return shortDays[dayNum]
      case 'full-name':
        return longDays[dayNum]
      case 'day-month':
        return `${shortDays[dayNum]}, ${months[dayNum - 1]} ${dayNum}`
      case 'day-name':
      default:
        return dayName
    }
  }

  const getDayHeaderText = () => {
    if (['minimal', 'compact', 'calendar', 'week'].includes(style)) {
      return formatDayHeader()
    }
    return daySchedule.day
  }

  if (!daySchedule.isOnline) {
    if (['minimal', 'compact', 'calendar', 'week'].includes(style)) {
      return (
        <div className={`py-3 px-2 ${colors.textMuted} italic text-sm border-b ${colors.borderLight}`}>
          {getDayHeaderText()} - Offline
        </div>
      )
    }
    return (
      <div className="flex items-center gap-4 p-6 opacity-40">
        {!['minimal', 'compact', 'calendar', 'week'].includes(style) && <DiamondMarker day={daySchedule.day} isOnline={false} colors={colors} />}
        {style !== 'ribbon' && (
          <div className={clsx('flex-1 py-4 px-6 rounded-lg text-dark-500 italic', colors.surface)}>
            Offline
          </div>
        )}
      </div>
    )
  }

  const renderActivities = () => {
    const show12Hour = settings.show12HourFormat
    if (daySchedule.activities.length === 0) {
      if (['minimal', 'compact', 'calendar', 'week'].includes(style)) {
        return <div className={`py-2 px-2 ${colors.textMuted} text-sm`}>No activities</div>
      }
      return <div className={`py-4 px-6 ${colors.textMuted} italic`}>No activities scheduled</div>
    }

   return daySchedule.activities.map((activity: any) => {
      switch (style) {
        case 'ribbon': return <RibbonActivityRow key={activity.id} activity={activity} timezones={timezones} colors={colors} show12Hour={show12Hour} />
        case 'cards': return <CardActivityRow key={activity.id} activity={activity} timezones={timezones} colors={colors} show12Hour={show12Hour} />
        case 'minimal': return <MinimalActivityRow key={activity.id} activity={activity} timezones={timezones} colors={colors} show12Hour={show12Hour} />
        case 'gradient': return <GradientActivityRow key={activity.id} activity={activity} timezones={timezones} colors={colors} show12Hour={show12Hour} />
        case 'timeline': return <TimelineActivityRow key={activity.id} activity={activity} timezones={timezones} colors={colors} show12Hour={show12Hour} />
        case 'compact': return <CompactActivityRow key={activity.id} activity={activity} timezones={timezones} colors={colors} show12Hour={show12Hour} />
        case 'calendar': return <CalendarActivityRow key={activity.id} activity={activity} timezones={timezones} colors={colors} show12Hour={show12Hour} />
        case 'week': return <WeekActivityRow key={activity.id} activity={activity} timezones={timezones} colors={colors} show12Hour={show12Hour} />
        default: return null
      }
    })
  }

 const getDayHeader = () => {
    if (['minimal', 'compact', 'calendar', 'week'].includes(style)) {
      return (
        <div className={clsx(
          'flex items-center gap-3 px-2',
          settings.compactMode ? 'py-1' : 'py-3',
          colors.primary.replace('bg-', 'text-')
        )}>
          <span className="font-semibold">{getDayHeaderText()}</span>
        </div>
      )
    }
    return <DiamondMarker day={daySchedule.day} isOnline={true} colors={colors} />
  }

  const compactClass = settings.compactMode ? 'compact-style' : ''
  
  if (['minimal', 'compact', 'calendar', 'week'].includes(style)) {
    const spacingClass = style === 'calendar' ? 'space-y-2' : 'space-y-1'
    const activitySpacing = style === 'compact' ? 'space-y-0.5' : 'space-y-1'
    
    return (
      <div className={clsx(spacingClass, compactClass)}>
        {getDayHeader()}
        <div className={clsx(activitySpacing, settings.compactMode && style === 'compact' && 'space-y-0.5')}>{renderActivities()}</div>
      </div>
    )
  }

  return (
    <div className={clsx(
      'flex items-center gap-4',
      settings.compactMode ? 'p-4' : 'p-6',
      style === 'cards' || style === 'gradient' || style === 'timeline' ? '' : ''
    )}>
      {getDayHeader()}
      <div className={clsx(
        'flex-1',
        style === 'cards' || style === 'gradient' || style === 'timeline' ? 'space-y-2' : '',
        settings.compactMode && 'space-y-1'
      )}>
        {renderActivities()}
      </div>
    </div>
  )
}

function AvatarDisplay({ settings, colors }: { settings: any; colors: any }) {
  const sizeClasses: Record<string, string> = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  }

  if (!settings.avatarImage) return null

  const sizeClass = sizeClasses[settings.avatarSize] || sizeClasses.medium

  return (
    <div className={clsx('flex flex-col items-center gap-2', sizeClass)}>
      <div className={clsx(sizeClass, 'rounded-full overflow-hidden border-4', colors.border)}>
        <img src={settings.avatarImage} alt="Avatar" className="w-full h-full object-cover" />
      </div>
      {settings.showAvatarName && settings.avatarName && (
        <span className={`font-semibold text-sm ${colors.text}`}>{settings.avatarName}</span>
      )}
    </div>
  )
}

export default function ScheduleCanvas() {
  const { days, settings } = useScheduleStore()
  const { colors } = useTheme()

  const isMinimal = ['minimal', 'compact', 'calendar', 'week'].includes(settings.scheduleStyle)

  const containerClasses = clsx(
    isMinimal ? 'rounded-xl p-6' : 'rounded-2xl p-8 transition-all',
    settings.colorPreset.includes('light') ? 'bg-white/80' : `${colors.surface}`,
    !isMinimal && settings.backgroundType === 'grid' && !['calendar', 'week'].includes(settings.scheduleStyle) && (settings.colorPreset.includes('light') ? 'grid-bg-light' : 'grid-bg')
  )

  const getLayout = () => {
    const scheduleContent = (
      <div className={clsx(
        'space-y-4',
        settings.compactMode && 'space-y-2',
        settings.scheduleStyle === 'compact' && settings.compactMode && 'space-y-1'
      )}>
        {days.map((d: any) => (
          <DayRow key={d.day} daySchedule={d} style={settings.scheduleStyle} colors={colors} settings={settings} />
        ))}
      </div>
    )

    switch (settings.layout) {
      case 'avatar-left':
        return (
          <div className="flex gap-6">
            <AvatarDisplay settings={settings} colors={colors} />
            {scheduleContent}
          </div>
        )
      case 'avatar-right':
        return (
          <div className="flex gap-6 justify-end">
            {scheduleContent}
            <AvatarDisplay settings={settings} colors={colors} />
          </div>
        )
      case 'avatar-top':
        return (
          <div className="flex flex-col items-center gap-6">
            <AvatarDisplay settings={settings} colors={colors} />
            {scheduleContent}
          </div>
        )
      default:
        return scheduleContent
    }
  }

  return (
    <motion.div layout className={containerClasses} style={{ backdropFilter: 'blur(10px)' }}>
      {getLayout()}
      {/* Custom CSS injection */}
      {settings.customCSS && <style>{settings.customCSS}</style>}
    </motion.div>
  )
}
