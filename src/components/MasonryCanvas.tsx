import { useState, useRef } from 'react'
import { useScheduleStore } from '../store/useScheduleStore'
import { renderWidget } from './WidgetRenderer'
import { useTheme } from '../utils/theme'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { GripVertical, Trash2, Eye, EyeOff, Settings } from 'lucide-react'

export default function MasonryCanvas() {
  const { widgets, updateWidget, updateWidgetConfig } = useScheduleStore()
  const { colors } = useTheme()
  const dragItem = useRef<number | null>(null)
  const dragNode = useRef<HTMLDivElement | null>(null)

  const enabledWidgets = widgets.filter(w => w.enabled)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragItem.current = index
    dragNode.current = e.currentTarget as HTMLDivElement
    ;(e.currentTarget as HTMLDivElement).style.opacity = '0.4'
  }

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    if (dragItem.current === null || dragItem.current === index) return
    const dragContent = dragNode.current?.cloneNode(true) as HTMLDivElement
    ;(e.currentTarget as HTMLDivElement).after(dragContent)
    dragItem.current = index
    dragNode.current = dragContent
  }

  const handleDragEnd = (e: React.DragEvent) => {
    ;(e.currentTarget as HTMLDivElement).style.opacity = '1'
    dragItem.current = null
    dragNode.current?.remove()
    dragNode.current = null
  }

  return (
    <div className="w-full">
      {enabledWidgets.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-dark-400 text-lg">No widgets</div>
          <div className="text-dark-500 text-sm mt-2">Go to Widgets tab to add some</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {enabledWidgets.map((widget, index) => (
              <WidgetCard
                key={widget.id}
                widget={widget}
                colors={colors}
                index={index}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDragEnd={handleDragEnd}
                onUpdate={updateWidget}
                onConfigUpdate={updateWidgetConfig}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

function WidgetCard({
  widget,
  colors,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onUpdate,
  onConfigUpdate,
}: {
  widget: any
  colors: any
  index: number
  onDragStart: (e: React.DragEvent, index: number) => void
  onDragEnter: (e: React.DragEvent, index: number) => void
  onDragEnd: (e: React.DragEvent) => void
  onUpdate: (id: string, updates: any) => void
  onConfigUpdate: (id: string, config: any) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={clsx(
        'bg-surface border rounded-xl overflow-hidden transition-all',
        isOpen ? 'ring-2 ring-primary-500/50' : 'hover:border-dark-500'
      )}
      style={{ borderColor: colors.border }}
      draggable
      onDragStart={(e) => onDragStart(e as any, 0)}
      onDragEnter={(e) => onDragEnter(e as any, 0)}
      onDragEnd={onDragEnd as any}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 bg-dark-800/80 cursor-grab active:cursor-grabbing"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-dark-400" />
          <span className="text-sm font-medium text-dark-200 capitalize">{widget.type}</span>
        </div>
        <div className="flex items-center gap-1">
          {isOpen && <Settings className="w-4 h-4 text-primary-400" />}
        </div>
      </div>

      {/* Content Preview */}
      <div className="p-4" style={{ minHeight: 100, maxHeight: 300, overflow: 'hidden' }}>
        {renderWidget(widget, colors)}
      </div>

      {/* Expanded Controls */}
      {isOpen && (
        <div className="border-t border-dark-700 p-3 bg-dark-800/50 space-y-3">
          {/* Quick Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => onUpdate(widget.id, { enabled: !widget.enabled })}
              className="flex items-center gap-1 text-xs text-dark-300 hover:text-dark-100"
            >
              {widget.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              {widget.enabled ? 'Hide' : 'Show'}
            </button>
             <button
                onClick={() => onConfigUpdate(widget.id, { ...widget.config })}
                className="flex items-center gap-1 text-xs text-dark-300 hover:text-dark-100"
              >
                <Trash2 className="w-3 h-3" />
                Remove
              </button>
            <button
              onClick={() => onUpdate(widget.id, { enabled: false })}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-3 h-3" />
              Remove
            </button>
          </div>

          {/* Type-specific controls */}
          {widget.type === 'title' && (
            <div className="space-y-2">
              <input
                type="text"
                value={widget.config.titleText || ''}
                onChange={(e) => onConfigUpdate(widget.id, { titleText: e.target.value })}
                className="w-full px-2 py-1 bg-dark-700 border border-dark-600 rounded text-sm text-dark-200"
                placeholder="Title text"
              />
            </div>
          )}
          {widget.type === 'text' && (
            <div className="space-y-2">
              <textarea
                value={widget.config.textContent || ''}
                onChange={(e) => onConfigUpdate(widget.id, { textContent: e.target.value })}
                className="w-full px-2 py-1 bg-dark-700 border border-dark-600 rounded text-sm text-dark-200 resize-none"
                rows={3}
                placeholder="Text content"
              />
            </div>
          )}
          {widget.type === 'image' && (
            <div className="space-y-2">
              <input
                type="url"
                value={widget.config.imageUrl || ''}
                onChange={(e) => onConfigUpdate(widget.id, { imageUrl: e.target.value })}
                className="w-full px-2 py-1 bg-dark-700 border border-dark-600 rounded text-sm text-dark-200"
                placeholder="Image URL"
              />
            </div>
          )}
          {widget.type === 'schedule' && (
            <div className="space-y-2">
              <select
                value={widget.config.scheduleStyle || 'ribbon'}
                onChange={(e) => onConfigUpdate(widget.id, { scheduleStyle: e.target.value })}
                className="w-full px-2 py-1 bg-dark-700 border border-dark-600 rounded text-sm text-dark-200"
              >
                <option value="ribbon">Ribbon</option>
                <option value="cards">Cards</option>
                <option value="minimal">Minimal</option>
                <option value="gradient">Gradient</option>
                <option value="compact">Compact</option>
              </select>
              <label className="flex items-center gap-2 text-xs text-dark-300">
                <input
                  type="checkbox"
                  checked={widget.config.compactMode || false}
                  onChange={(e) => onConfigUpdate(widget.id, { compactMode: e.target.checked })}
                  className="rounded"
                />
                Compact mode
              </label>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
