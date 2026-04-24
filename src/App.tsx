import { useEffect } from 'react'
import { useScheduleStore, syncStateToUrl } from './store/useScheduleStore'
import ScheduleCanvas from './components/ScheduleCanvas'
import EditorPane from './components/EditorPane'
import { useOBSMode } from './hooks/useOBSMode'

function App() {
  const isOBSMode = useOBSMode()
  const loadFromUrl = useScheduleStore((state) => state.loadFromUrl)
  const days = useScheduleStore((state) => state.days)
  const timezones = useScheduleStore((state) => state.timezones)
  const theme = useScheduleStore((state) => state.theme)

  useEffect(() => {
    loadFromUrl()
  }, [loadFromUrl])

  useEffect(() => {
    if (!isOBSMode) {
      syncStateToUrl()
    }
  }, [days, timezones, theme, isOBSMode])

  if (isOBSMode) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-8">
        <div data-export="schedule">
          <ScheduleCanvas />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="flex h-screen">
        <EditorPane />
        <div className="flex-1 overflow-auto bg-dark-900 grid-bg">
          <div className="max-w-4xl mx-auto p-8">
            <div data-export="schedule">
              <ScheduleCanvas />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
