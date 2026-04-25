import { useState } from 'react'
import { useScheduleStore } from '../store/useScheduleStore'
import { Download, FileJson, Upload, Globe, Palette, AlertCircle, CheckCircle } from 'lucide-react'
import { toPng } from 'html-to-image'

export default function SettingsPanel() {
  const { settings, updateSettings, exportState, importState } = useScheduleStore()
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
      })
      
      const link = document.createElement('a')
      link.download = 'stream-schedule.png'
      link.href = dataUrl
      link.click()
      showSuccess('PNG exported successfully')
    } catch (e) {
      console.error('Export failed:', e)
      showError('Failed to export PNG')
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
      showError('Failed to export JSON')
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
          showError(err instanceof Error ? err.message : 'Failed to import')
        }
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="space-y-6">
      {/* Messages */}
      {(error || success) && (
        <div className={clsx(
          'p-3 rounded-lg flex items-start gap-3',
          error ? 'bg-red-900/30 border border-red-900/50' : 'bg-green-900/30 border border-green-900/50'
        )}>
          {error ? <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> : <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />}
          <span className={clsx('text-sm', error ? 'text-red-300' : 'text-green-300')}>{error || success}</span>
        </div>
      )}

      {/* Language */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-dark-300 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Language
        </h3>
        <select
          value={settings.language}
          onChange={(e) => updateSettings({ language: e.target.value as any })}
          className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-dark-200"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="pt">Português</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
          <option value="zh">中文</option>
        </select>
      </div>

      {/* Global Colors */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-dark-300 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Global Colors
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(settings.widgetColors).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <input
                type="color"
                value={value}
                onChange={(e) => updateSettings({
                  widgetColors: {
                    ...settings.widgetColors,
                    [key]: e.target.value,
                  },
                })}
                className="w-10 h-10 rounded cursor-pointer border border-dark-700"
              />
              <span className="text-xs text-dark-300 capitalize flex-1">{key}</span>
              <span className="text-xs text-dark-500 font-mono">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Export */}
      <div className="space-y-3 pt-6 border-t border-dark-700">
        <h3 className="text-sm font-semibold text-dark-300 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-xs text-dark-200"
          >
            <Download className="w-3 h-3" />
            PNG
          </button>
          <button
            onClick={handleExportJson}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-xs text-dark-200"
          >
            <FileJson className="w-3 h-3" />
            JSON
          </button>
          <label className="flex items-center justify-center gap-2 px-3 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-xs text-dark-200 cursor-pointer">
            <Upload className="w-3 h-3" />
            Import
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  )
}

function clsx(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}
