import { useEffect, useState } from 'react'
import { useScheduleStore, syncStateToUrl } from './store/useScheduleStore'
import MasonryCanvas from './components/MasonryCanvas'
import EditorPane from './components/EditorPane'
import WidgetEditor from './components/WidgetEditor'
import SettingsPanel from './components/SettingsPanel'
import { useOBSMode } from './hooks/useOBSMode'
import { useTheme } from './utils/theme'
import { LayoutGrid, Puzzle, Settings2 } from 'lucide-react'
import { clsx } from 'clsx'

type Tab = 'editor' | 'widgets' | 'settings'

function App() {
  const isOBSMode = useOBSMode()
  const [activeTab, setActiveTab] = useState<Tab>('editor')
  const loadFromUrl = useScheduleStore((s) => s.loadFromUrl)
  const widgets = useScheduleStore((s) => s.widgets)
  const settings = useScheduleStore((s) => s.settings)
  const { colors } = useTheme()

  useEffect(() => {
    loadFromUrl()
  }, [loadFromUrl])

  useEffect(() => {
    if (!isOBSMode) {
      syncStateToUrl()
    }
  }, [widgets, settings, isOBSMode])

  // Get background style
  const getBackgroundStyle = () => {
    if (settings.customBackground && settings.backgroundType === 'image') {
      return { backgroundImage: `url(${settings.customBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    }
    if (settings.backgroundType === 'gradient') {
      return { backgroundImage: `linear-gradient(135deg, #1e293b 0%, #0f172a 100%)` }
    }
    if (settings.backgroundType === 'solid') {
      return { backgroundColor: '#0f172a' }
    }
    return {}
  }

  if (isOBSMode) {
    return (
      <div 
        className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-auto"
        style={getBackgroundStyle()}
      >
        <div className="w-full max-w-6xl" data-export="schedule">
          <MasonryCanvas />
        </div>
      </div>
    )
  }

  const tabs: { id: Tab; label: string; icon: typeof LayoutGrid }[] = [
    { id: 'editor', label: 'Schedule', icon: LayoutGrid },
    { id: 'widgets', label: 'Widgets', icon: Puzzle },
    { id: 'settings', label: 'Settings', icon: Settings2 },
  ]

  return (
    <div className={`min-h-screen ${colors.bg}`}>
      <div className="flex h-screen overflow-hidden">
        {/* Left Panel - Tabbed Interface */}
        <aside className={`w-96 ${colors.bgSecondary} border-r ${colors.border} flex flex-col overflow-hidden`}>
          {/* Header */}
          <header className={`px-6 py-4 border-b ${colors.border} flex items-center justify-between flex-shrink-0`}>
            <div className="flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-primary-400" />
              <h1 className="font-bold text-lg text-white">Stream Schedule</h1>
            </div>
          </header>

          {/* Tabs */}
          <div className={`flex border-b ${colors.border} flex-shrink-0`}>
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors',
                    activeTab === tab.id
                      ? 'text-primary-400 border-b-2 border-primary-400'
                      : 'text-dark-400 hover:text-dark-200'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'editor' && <EditorPane />}
            {activeTab === 'widgets' && <WidgetEditor />}
            {activeTab === 'settings' && <SettingsPanel />}
          </div>
        </aside>
        
        {/* Right Panel - Preview */}
        <main 
          className="flex-1 overflow-auto"
          style={getBackgroundStyle()}
        >
          <div className="w-full min-h-full p-4 md:p-8">
            <div className="w-full max-w-6xl mx-auto">
              <MasonryCanvas />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
