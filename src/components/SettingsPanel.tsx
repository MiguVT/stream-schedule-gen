import { useState } from 'react'
import { useScheduleStore, loadPreset } from '../store/useScheduleStore'
import { useTranslation } from '../utils/i18n'
import { Download, FileJson, Upload, Globe, Monitor, SlidersVertical, AlertCircle, CheckCircle } from 'lucide-react'
import { toPng } from 'html-to-image'
import { clsx } from 'clsx'

export default function SettingsPanel() {
  const { settings, updateSettings, exportState, importState, resetSettings } = useScheduleStore()
  const { t, setLanguage } = useTranslation()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const showError = (message: string) => {
    setError(message)
    setSuccess(null)
    setTimeout(() => setError(null), 5000)
  }

  const showSuccess = (message: string) => {
    setSuccess(message)
    setError(null)
    setTimeout(() => setSuccess(null), 3000)
  }

  const handleExport = async () => {
    const element = document.querySelector<HTMLElement>('[data-export="schedule"]')
    if (!element) {
      showError('Schedule element not found')
      return
    }

    try {
      const dataUrl = await toPng(element, {
        backgroundColor: 'transparent' as any,
        pixelRatio: 2,
        width: settings.exportWidth,
        height: settings.exportHeight,
      })
      
      const link = document.createElement('a')
      link.download = 'stream-schedule.png'
      link.href = dataUrl
      link.click()
      showSuccess('PNG exported successfully')
    } catch (e) {
      console.error('Export failed:', e)
      showError('Failed to export PNG. Please try again.')
    }
  }

  const handleExportJson = () => {
    try {
      const json = exportState()
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = 'schedule-config.json'
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
      showSuccess('JSON exported successfully')
    } catch (e) {
      console.error('JSON export failed:', e)
      showError('Failed to export JSON. Please try again.')
    }
  }

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        try {
          importState(event.target.result as string)
          showSuccess('Schedule imported successfully')
        } catch (err) {
          showError(err instanceof Error ? err.message : 'Failed to import schedule')
        }
      }
    }
    reader.onerror = () => {
      showError('Failed to read file')
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="space-y-6">
      {/* Error/Success Messages */}
      {(error || success) && (
        <div className={clsx(
          'p-3 rounded-lg flex items-start gap-3',
          error ? 'bg-red-900/30 border border-red-900/50' : 'bg-green-900/30 border border-green-900/50'
        )}>
          {error ? <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> : <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />}
          <span className={clsx('text-sm', error ? 'text-red-300' : 'text-green-300')}>{error || success}</span>
        </div>
      )}

      {/* Presets Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-dark-300 flex items-center gap-2">
          <SlidersVertical className="w-4 h-4" />
          {t('presets')}
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => loadPreset('vtuber_daily')}
            className="w-full p-3 bg-dark-800 hover:bg-dark-700 rounded-lg text-left transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-dark-200">{t('vtuber_daily')}</span>
              <span className="text-xs text-dark-500">Daily streams</span>
            </div>
          </button>
          <button
            onClick={() => loadPreset('gamer_weekend')}
            className="w-full p-3 bg-dark-800 hover:bg-dark-700 rounded-lg text-left transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-dark-200">{t('gamer_weekend')}</span>
              <span className="text-xs text-dark-500">Weekend only</span>
            </div>
          </button>
          <button
            onClick={() => loadPreset('content_creator')}
            className="w-full p-3 bg-dark-800 hover:bg-dark-700 rounded-lg text-left transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-dark-200">{t('content_creator')}</span>
              <span className="text-xs text-dark-500">Multi-timezone</span>
            </div>
          </button>
          <button
            onClick={() => loadPreset('minimal_schedule')}
            className="w-full p-3 bg-dark-800 hover:bg-dark-700 rounded-lg text-left transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-dark-200">{t('minimal_schedule')}</span>
              <span className="text-xs text-dark-500">Simple schedule</span>
            </div>
          </button>
        </div>
      </div>

      {/* Export Section */}
      <div className="space-y-3 pt-6 border-t border-dark-700">
        <h3 className="text-sm font-semibold text-dark-300 flex items-center gap-2">
          <Download className="w-4 h-4" />
          {t('export')}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-xs text-dark-200 transition-colors"
          >
            <Download className="w-3 h-3" />
            PNG
          </button>
          <button
            onClick={handleExportJson}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-xs text-dark-200 transition-colors"
          >
            <FileJson className="w-3 h-3" />
            JSON
          </button>
          <label className="flex items-center justify-center gap-2 px-3 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-xs text-dark-200 cursor-pointer transition-colors">
            <Upload className="w-3 h-3" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Language */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-dark-300 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          {t('language')}
        </h3>
        <select
          value={settings.language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-dark-200 focus:outline-none focus:border-primary-500"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="pt">Português (AI)</option>
          <option value="fr">Français (AI)</option>
          <option value="de">Deutsch (AI)</option>
          <option value="ja">日本語 (AI)</option>
          <option value="ko">한국어 (AI)</option>
          <option value="zh">中文 (AI)</option>
        </select>
      </div>

      {/* Display Options */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-dark-300 flex items-center gap-2">
          <Monitor className="w-4 h-4" />
          {t('display')}
        </h3>
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-xs text-dark-400">{t('day_format')}</label>
            <select
              value={settings.dayFormat}
              onChange={(e) => updateSettings({ dayFormat: e.target.value as any })}
              className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-dark-200 focus:outline-none focus:border-primary-500"
            >
              <option value="day-name">{t('day_name')}</option>
              <option value="day-number">{t('day_number')}</option>
              <option value="day-month">{t('day_month')}</option>
              <option value="short-name">{t('short_name')}</option>
              <option value="full-name">{t('full_name')}</option>
            </select>
          </div>
          
          <label className="flex items-center justify-between p-2 rounded hover:bg-dark-800 transition-colors">
            <span className="text-sm text-dark-300">{t('show_timezone_labels')}</span>
            <input
              type="checkbox"
              checked={settings.showTimezoneLabels}
              onChange={(e) => updateSettings({ showTimezoneLabels: e.target.checked })}
              className="rounded"
            />
          </label>
          <label className="flex items-center justify-between p-2 rounded hover:bg-dark-800 transition-colors">
            <span className="text-sm text-dark-300">{t('compact_mode')}</span>
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={(e) => updateSettings({ compactMode: e.target.checked })}
              className="rounded"
            />
          </label>
          <label className="flex items-center justify-between p-2 rounded hover:bg-dark-800 transition-colors">
            <span className="text-sm text-dark-300">{t('twelve_hour_format')}</span>
            <input
              type="checkbox"
              checked={settings.show12HourFormat}
              onChange={(e) => updateSettings({ show12HourFormat: e.target.checked })}
              className="rounded"
            />
          </label>
        </div>
      </div>

      {/* Reset */}
      <div className="pt-4 border-t border-dark-700">
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all settings? This cannot be undone.')) {
              resetSettings()
            }
          }}
          className="w-full px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-900/50 rounded-lg text-sm transition-colors"
        >
          {t('reset')} All Settings
        </button>
      </div>
    </div>
  )
}
