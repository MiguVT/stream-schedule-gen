import { useState } from 'react'
import { useScheduleStore } from '../store/useScheduleStore'
import { colorPresets, ColorPreset } from '../utils/theme'
import { useTranslation } from '../utils/i18n'
import {
  LayoutGrid,
  Minimize2,
  Sparkles,
  Type,
  ImageIcon,
  Palette,
  Monitor,
  Code2,
  Upload,
  X,
} from 'lucide-react'
import { clsx } from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const SCHEDULE_STYLES = [
  { value: 'ribbon', label: 'ribbon', icon: LayoutGrid },
  { value: 'cards', label: 'cards', icon: Minimize2 },
  { value: 'minimal', label: 'minimal', icon: Minimize2 },
  { value: 'gradient', label: 'gradient', icon: Sparkles },
  { value: 'timeline', label: 'timeline', icon: Type },
  { value: 'compact', label: 'compact', icon: Minimize2 },
  { value: 'calendar', label: 'calendar', icon: LayoutGrid },
  { value: 'week', label: 'week_view', icon: Type },
] as const

const LAYOUTS = [
  { value: 'default', label: 'default_layout', icon: LayoutGrid },
  { value: 'avatar-left', label: 'avatar_left', icon: ImageIcon },
  { value: 'avatar-right', label: 'avatar_right', icon: ImageIcon },
  { value: 'avatar-top', label: 'avatar_top', icon: ImageIcon },
  { value: 'minimal', label: 'minimal_layout', icon: Minimize2 },
] as const

export default function CustomizationPanel() {
  const { settings, updateSettings } = useScheduleStore()
  const { t } = useTranslation()
  const [activeSection, setActiveSection] = useState<'style' | 'layout' | 'colors' | 'background' | 'advanced'>('style')

  const renderStyleSection = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-dark-300 flex items-center gap-2">
        <LayoutGrid className="w-4 h-4" />
        {t('schedule_style')}
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {SCHEDULE_STYLES.map((style) => {
          const Icon = style.icon
          return (
            <button
              key={style.value}
              onClick={() => updateSettings({ scheduleStyle: style.value as any })}
              className={clsx(
                'p-3 rounded-lg text-xs flex flex-col items-center gap-2 transition-all',
                settings.scheduleStyle === style.value
                  ? 'bg-primary-600 text-white ring-2 ring-primary-400 ring-offset-2 ring-offset-dark-900'
                  : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{t(style.label as any)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )

  const renderLayoutSection = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-dark-300 flex items-center gap-2">
        <LayoutGrid className="w-4 h-4" />
        {t('layout')}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {LAYOUTS.map((layout) => {
          const Icon = layout.icon
          return (
            <button
              key={layout.value}
              onClick={() => updateSettings({ layout: layout.value as any })}
              className={clsx(
                'p-3 rounded-lg text-xs flex flex-col items-center gap-2 transition-all',
                settings.layout === layout.value
                  ? 'bg-primary-600 text-white ring-2 ring-primary-400 ring-offset-2 ring-offset-dark-900'
                  : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{t(layout.label as any)}</span>
            </button>
          )
        })}
      </div>

      {settings.layout.includes('avatar') && (
        <div className="space-y-4 pt-4 border-t border-dark-700">
          <h4 className="text-xs font-semibold text-dark-400 uppercase">{t('avatar_image')}</h4>
          
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-lg bg-dark-800 flex items-center justify-center overflow-hidden border border-dark-700">
              {settings.avatarImage ? (
                <img src={settings.avatarImage} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-8 h-8 text-dark-600" />
              )}
            </div>
            <div className="flex-1 space-y-3">
              <label className="flex items-center gap-2 px-3 py-2 bg-dark-800 rounded-lg text-xs cursor-pointer hover:bg-dark-700 transition-colors">
                <Upload className="w-3 h-3" />
                {t('upload_image')}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (ev) => updateSettings({ avatarImage: ev.target?.result as string })
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="hidden"
                />
              </label>
              {settings.avatarImage && (
                <button
                  onClick={() => updateSettings({ avatarImage: null })}
                  className="flex items-center gap-2 px-3 py-2 bg-dark-800 rounded-lg text-xs hover:bg-dark-700 transition-colors"
                >
                  <X className="w-3 h-3" />
                  {t('clear_image')}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-dark-400">{t('avatar_name')}</label>
            <input
              type="text"
              value={settings.avatarName}
              onChange={(e) => updateSettings({ avatarName: e.target.value })}
              className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-dark-200 focus:outline-none focus:border-primary-500"
              placeholder="Your avatar name..."
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.showAvatarName}
              onChange={(e) => updateSettings({ showAvatarName: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-dark-300">{t('show_name')}</span>
          </label>

          <div className="space-y-2">
            <label className="text-xs text-dark-400">{t('avatar_size')}</label>
            <div className="flex gap-2">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => updateSettings({ avatarSize: size })}
                  className={clsx(
                    'flex-1 py-2 rounded text-xs capitalize transition-colors',
                    settings.avatarSize === size
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
                  )}
                >
                  {t(size as any)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderColorsSection = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-dark-300 flex items-center gap-2">
        <Palette className="w-4 h-4" />
        {t('colors')}
      </h3>
      <div className="space-y-2">
        {Object.entries(colorPresets).map(([key, preset]) => (
          <button
            key={key}
            onClick={() => updateSettings({ colorPreset: key as ColorPreset, customColors: {} })}
            className={clsx(
              'w-full p-4 rounded-lg text-left transition-all',
              settings.colorPreset === key
                ? 'bg-primary-600 text-white ring-2 ring-primary-400 ring-offset-2 ring-offset-dark-900'
                : 'bg-dark-800 text-dark-200 hover:bg-dark-700'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="capitalize font-medium">{t(key.replace(/-/g, '_') as any)}</span>
              <div className="flex gap-2">
                <div className={`w-6 h-6 rounded-lg ${preset.primary}`} />
                <div className={`w-6 h-6 rounded-lg ${preset.accent}`} />
                <div className={`w-6 h-6 rounded-lg ${preset.bg}`} />
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {settings.colorPreset === 'custom' && (
        <div className="pt-4 border-t border-dark-700 space-y-4">
          <h4 className="text-xs font-semibold text-dark-400 uppercase">{t('custom_colors')}</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-dark-400">{t('primary_color')}</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.customColors.primary || '#a855f7'}
                  onChange={(e) => updateSettings({ customColors: { ...settings.customColors, primary: e.target.value } })}
                  className="w-10 h-10 rounded border border-dark-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.customColors.primary || '#a855f7'}
                  onChange={(e) => updateSettings({ customColors: { ...settings.customColors, primary: e.target.value } })}
                  className="flex-1 px-2 py-2 bg-dark-800 border border-dark-700 rounded text-xs text-dark-200 font-mono focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-dark-400">{t('accent_color')}</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.customColors.accent || '#f59e0b'}
                  onChange={(e) => updateSettings({ customColors: { ...settings.customColors, accent: e.target.value } })}
                  className="w-10 h-10 rounded border border-dark-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.customColors.accent || '#f59e0b'}
                  onChange={(e) => updateSettings({ customColors: { ...settings.customColors, accent: e.target.value } })}
                  className="flex-1 px-2 py-2 bg-dark-800 border border-dark-700 rounded text-xs text-dark-200 font-mono focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-dark-400">{t('background_color')}</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.customColors.bg || '#020617'}
                  onChange={(e) => updateSettings({ customColors: { ...settings.customColors, bg: e.target.value } })}
                  className="w-10 h-10 rounded border border-dark-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.customColors.bg || '#020617'}
                  onChange={(e) => updateSettings({ customColors: { ...settings.customColors, bg: e.target.value } })}
                  className="flex-1 px-2 py-2 bg-dark-800 border border-dark-700 rounded text-xs text-dark-200 font-mono focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-dark-400">{t('text_color')}</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.customColors.text || '#ffffff'}
                  onChange={(e) => updateSettings({ customColors: { ...settings.customColors, text: e.target.value } })}
                  className="w-10 h-10 rounded border border-dark-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.customColors.text || '#ffffff'}
                  onChange={(e) => updateSettings({ customColors: { ...settings.customColors, text: e.target.value } })}
                  className="flex-1 px-2 py-2 bg-dark-800 border border-dark-700 rounded text-xs text-dark-200 font-mono focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-dark-400">{t('border_color')}</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.customColors.border || '#334155'}
                  onChange={(e) => updateSettings({ customColors: { ...settings.customColors, border: e.target.value } })}
                  className="w-10 h-10 rounded border border-dark-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.customColors.border || '#334155'}
                  onChange={(e) => updateSettings({ customColors: { ...settings.customColors, border: e.target.value } })}
                  className="flex-1 px-2 py-2 bg-dark-800 border border-dark-700 rounded text-xs text-dark-200 font-mono focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderBackgroundSection = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-dark-300 flex items-center gap-2">
        <Monitor className="w-4 h-4" />
        {t('background')}
      </h3>
      <div className="space-y-2">
        {(['grid', 'gradient', 'solid', 'image'] as const).map((type) => (
          <button
            key={type}
            onClick={() => updateSettings({ backgroundType: type })}
            className={clsx(
              'w-full p-4 rounded-lg text-left transition-all',
              settings.backgroundType === type
                ? 'bg-primary-600 text-white ring-2 ring-primary-400 ring-offset-2 ring-offset-dark-900'
                : 'bg-dark-800 text-dark-200 hover:bg-dark-700'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{t(`${type}_bg` as any)}</span>
              {settings.backgroundType === type && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </button>
        ))}
      </div>

      {settings.backgroundType === 'image' && (
        <div className="space-y-2 pt-4 border-t border-dark-700">
          <label className="text-xs text-dark-400">Background Image URL</label>
          <input
            type="url"
            value={settings.customBackground || ''}
            onChange={(e) => {
              const url = e.target.value
              if (url && !isValidUrl(url)) {
                return
              }
              updateSettings({ customBackground: url })
            }}
            className={clsx(
              'w-full px-3 py-2 bg-dark-800 border rounded-lg text-sm text-dark-200 focus:outline-none transition-colors',
              settings.customBackground && !isValidUrl(settings.customBackground)
                ? 'border-red-500 focus:border-red-500'
                : 'border-dark-700 focus:border-primary-500'
            )}
            placeholder="https://example.com/image.jpg"
          />
          {settings.customBackground && !isValidUrl(settings.customBackground) && (
            <p className="text-xs text-red-400">Please enter a valid URL (e.g., https://example.com/image.jpg)</p>
          )}
          {!settings.customBackground && (
            <p className="text-xs text-dark-500">Enter a URL to an image for your background</p>
          )}
        </div>
      )}
    </div>
  )

  const renderAdvancedSection = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-dark-300 flex items-center gap-2">
        <Code2 className="w-4 h-4" />
        {t('custom_css')}
      </h3>
      <textarea
        value={settings.customCSS}
        onChange={(e) => updateSettings({ customCSS: e.target.value })}
        className="w-full h-48 px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-dark-200 font-mono focus:outline-none focus:border-primary-500 resize-none"
        placeholder={`/* Add your custom CSS here */

/* Example: Change ribbon colors */
.ribbon-style {
  background: linear-gradient(90deg, #ff0000, #00ff00);
}

/* Style specific days */
.day-1 {
  border-left: 4px solid #f59e0b;
}`}
      />
      <p className="text-xs text-dark-500">Custom CSS will be applied to the schedule canvas only. Use browser DevTools to inspect elements and find the right selectors.</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-dark-700 overflow-x-auto pb-1">
        <button onClick={() => setActiveSection('style')} className={clsx('px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors', activeSection === 'style' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-dark-400 hover:text-dark-200')}>Style</button>
        <button onClick={() => setActiveSection('layout')} className={clsx('px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors', activeSection === 'layout' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-dark-400 hover:text-dark-200')}>Layout</button>
        <button onClick={() => setActiveSection('colors')} className={clsx('px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors', activeSection === 'colors' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-dark-400 hover:text-dark-200')}>Colors</button>
        <button onClick={() => setActiveSection('background')} className={clsx('px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors', activeSection === 'background' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-dark-400 hover:text-dark-200')}>Background</button>
        <button onClick={() => setActiveSection('advanced')} className={clsx('px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors', activeSection === 'advanced' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-dark-400 hover:text-dark-200')}>Advanced</button>
      </div>

      <AnimatePresence mode="wait">
        {activeSection === 'style' && (
          <motion.div
            key="style"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderStyleSection()}
          </motion.div>
        )}
        {activeSection === 'layout' && (
          <motion.div
            key="layout"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderLayoutSection()}
          </motion.div>
        )}
        {activeSection === 'colors' && (
          <motion.div
            key="colors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderColorsSection()}
          </motion.div>
        )}
        {activeSection === 'background' && (
          <motion.div
            key="background"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderBackgroundSection()}
          </motion.div>
        )}
        {activeSection === 'advanced' && (
          <motion.div
            key="advanced"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderAdvancedSection()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
