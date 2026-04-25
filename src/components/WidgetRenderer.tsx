import { useScheduleStore, TimezoneConfig } from '../store/useScheduleStore'
import { formatTimeForZones } from '../utils/time'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { Mail, Globe, Image as ImageIcon } from 'lucide-react'

function ScheduleWidget({ config, colors }: { config: any; colors: any }) {
  const days = useScheduleStore((s) => s.days)
  const timezones = useScheduleStore((s) => s.timezones as TimezoneConfig[])
  const style = config.scheduleStyle || 'ribbon'
  const compact = config.compactMode || false
  const show12Hour = useScheduleStore((s) => s.settings.show12HourFormat)

  const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const renderActivity = (activity: any) => {
    const formattedTimes = formatTimeForZones(activity.time, timezones, show12Hour)
    
    if (style === 'ribbon') {
      return (
        <motion.div key={activity.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative">
          <div className={clsx('flex-1 py-3 px-4 rounded-lg flex items-center gap-3', colors.surface, colors.borderLight)}>
            <div className={clsx('w-1 h-8 rounded-full', activity.color)} />
            <span className={clsx('font-semibold flex-1', colors.text)}>{activity.title}</span>
            <div className="flex gap-2 text-sm flex-wrap">
              {formattedTimes.map((ft: any, i: number) => (
                <span key={i} className={colors.textMuted}>{ft.flag} {ft.formatted}</span>
              ))}
            </div>
          </div>
        </motion.div>
      )
    }
    if (style === 'cards') {
      return (
        <motion.div key={activity.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
          <div className={clsx('py-3 px-4 rounded-lg flex items-center justify-between flex-wrap gap-3', colors.surface, colors.border)}>
            <div className="flex items-center gap-3">
              <div className={clsx('w-3 h-3 rounded-full', activity.color)} />
              <span className={clsx('font-medium', colors.text)}>{activity.title}</span>
            </div>
            <div className="flex gap-2 text-sm flex-wrap">
              {formattedTimes.map((ft: any, i: number) => (
                <span key={i} className={colors.textMuted}>{ft.flag} {ft.formatted}</span>
              ))}
            </div>
          </div>
        </motion.div>
      )
    }
    if (style === 'minimal' || style === 'compact') {
      return (
        <motion.div key={activity.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
          <div className={clsx('flex items-center gap-2 py-2 px-2 border-b last:border-0', colors.borderLight)}>
            <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', activity.color)} />
            <span className={clsx('flex-1 truncate', colors.text)}>{activity.title}</span>
            <div className="flex gap-2 text-xs flex-shrink-0">
              {formattedTimes.slice(0, 2).map((ft: any, i: number) => (
                <span key={i} className={colors.textMuted}>{ft.flag} {ft.formatted}</span>
              ))}
            </div>
          </div>
        </motion.div>
      )
    }
    return (
      <motion.div key={activity.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1">
        <div className={clsx('py-3 px-4 rounded-xl flex items-center gap-4 bg-gradient-to-r from-dark-800/50 to-transparent border-l-4', activity.color.replace('bg-', 'border-'))}>
          <span className={clsx('font-semibold', colors.text)}>{activity.title}</span>
          <div className="flex gap-2 text-sm flex-wrap">
            {formattedTimes.map((ft: any, i: number) => (
              <span key={i} className={colors.textMuted}>{ft.flag} {ft.formatted}</span>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  const renderDay = (day: any) => {
    if (!day.isOnline) {
      return (
        <div key={day.day} className={clsx('p-4 opacity-50', compact && 'p-2')}>
          <div className={clsx(colors.textMuted, 'italic')}>
            {shortDays[day.day]} - Offline
          </div>
        </div>
      )
    }

    return (
      <motion.div key={day.day} layout className={clsx('rounded-lg overflow-hidden', compact ? 'bg-transparent' : '')}>
        <div className={clsx('flex items-center gap-4', compact ? 'p-2' : 'p-5')}>
          <div className={clsx(compact ? 'text-sm' : 'text-base', colors.primary.replace('bg-', 'text-'))}>
            <span className="font-semibold">{shortDays[day.day]}</span>
          </div>
          <div className={clsx('flex-1 w-full', compact ? 'space-y-1' : 'space-y-2')}>
            {day.activities.length === 0 ? (
              <div className={clsx(colors.textMuted, 'italic', 'text-sm')}>No activities</div>
            ) : (
              day.activities.map(renderActivity)
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className={clsx('space-y-3', compact && 'space-y-2')}>
      {days.map(renderDay)}
    </div>
  )
}

function ImageWidget({ config, colors }: { config: any; colors: any }) {
  const url = config.imageUrl
  if (!url) {
    return (
      <div className={clsx('flex items-center justify-center py-8', colors.textMuted)}>
        <ImageIcon className="w-8 h-8 opacity-50" />
        <span className="ml-2">No image URL</span>
      </div>
    )
  }
  return (
    <img
      src={url}
      alt={config.imageAlt || 'Image'}
      className={clsx('w-full rounded-lg', config.imageRounded || 'rounded-lg')}
      style={{ maxWidth: config.imageWidth || '100%' }}
    />
  )
}

function TitleWidget({ config, colors }: { config: any; colors: any }) {
  const text = config.titleText || ''
  const size = config.titleSize || 'large'
  const align = config.titleAlign || 'center'
  
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl',
    xlarge: 'text-4xl',
    xxlarge: 'text-5xl',
  }
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.large, alignClasses[align as keyof typeof alignClasses] || alignClasses.center, colors.text, 'mb-4')}
    >
      <h1 className="font-bold">{text}</h1>
    </motion.div>
  )
}

function TextWidget({ config, colors }: { config: any; colors: any }) {
  const text = config.textContent || ''
  const size = config.textSize || 'normal'
  const align = config.textAlign || 'left'

  const sizeClasses = {
    small: 'text-sm',
    normal: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl',
  }
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  }

  if (!text) return null

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={clsx(sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.normal, alignClasses[align as keyof typeof alignClasses] || alignClasses.left, colors.text, 'my-2')}
    >
      <p className="whitespace-pre-wrap">{text}</p>
    </motion.div>
  )
}

function SocialWidget({ config, colors }: { config: any; colors: any }) {
  const links = config.socialLinks || []
  
  const getIcon = (platform: string) => {
    switch (platform) {
      case 'twitch': return (props: any) => <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l5.143-5.143h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3.428 3.429V14.57H6.857V1.714h13.714Z"/></svg>
      case 'youtube': return (props: any) => <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
      case 'twitter': return (props: any) => <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      case 'discord': return (props: any) => <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
      case 'email': return Mail
      default: return Globe
    }
  }

  if (links.length === 0) {
    return (
      <div className={clsx('text-center py-4', colors.textMuted)}>
        No social links added
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-wrap gap-3 justify-center my-4"
    >
      {links.map((link: any, index: number) => {
        const Icon = getIcon(link.platform)
        return (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              'p-3 rounded-lg transition-all hover:scale-110 flex items-center gap-2',
              colors.surface,
              colors.border
            )}
          >
            <Icon className="w-5 h-5 text-primary-400" />
            {link.label && <span className={clsx('text-sm', colors.text)}>{link.label}</span>}
          </a>
        )
      })}
    </motion.div>
  )
}

function DividerWidget({ config, colors }: { config: any; colors: any }) {
  const style = config.dividerStyle || 'solid'
  const color = config.dividerColor || colors.border
  const height = config.dividerHeight || '1px'

  const styleClasses = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
    double: 'border-double',
  }

  return (
    <div
      className={clsx('w-full my-4', styleClasses[style as keyof typeof styleClasses] || 'border-solid')}
      style={{ borderTop: `${height} solid ${color}` }}
    />
  )
}

function ColorBlockWidget({ config }: { config: any }) {
  const color = config.blockColor || '#3b82f6'
  const radius = config.borderRadius || 'rounded-lg'
  const height = config.blockHeight || '40px'

  return (
    <div className={clsx('w-full', radius)} style={{ backgroundColor: color, height }} />
  )
}

function CustomHTMLWidget({ config }: { config: any }) {
  const html = config.customHTML || ''
  if (!html) return null
  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  )
}

export function renderWidget(widget: any, colors: any) {
  switch (widget.type) {
    case 'schedule':
      return <ScheduleWidget key={widget.id} config={widget.config} colors={colors} />
    case 'image':
      return <ImageWidget key={widget.id} config={widget.config} colors={colors} />
    case 'title':
      return <TitleWidget key={widget.id} config={widget.config} colors={colors} />
    case 'text':
      return <TextWidget key={widget.id} config={widget.config} colors={colors} />
    case 'social':
      return <SocialWidget key={widget.id} config={widget.config} colors={colors} />
    case 'divider':
      return <DividerWidget key={widget.id} config={widget.config} colors={colors} />
    case 'color-block':
      return <ColorBlockWidget key={widget.id} config={widget.config} />
    case 'custom-html':
      return <CustomHTMLWidget key={widget.id} config={widget.config} />
    default:
      return null
  }
}
