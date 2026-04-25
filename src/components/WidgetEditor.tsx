import { useScheduleStore, WidgetType } from '../store/useScheduleStore'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Image,
  Type,
  AlignLeft,
  Link,
  Divide,
  Square,
  Code,
  Plus,
  X,
} from 'lucide-react'

const WIDGET_TYPES: { id: WidgetType; label: string; icon: any; description: string }[] = [
  { id: 'schedule', label: 'Schedule', icon: Calendar, description: 'Stream schedule' },
  { id: 'title', label: 'Title', icon: Type, description: 'Heading text' },
  { id: 'text', label: 'Text', icon: AlignLeft, description: 'Body text' },
  { id: 'image', label: 'Image', icon: Image, description: 'Add image' },
  { id: 'social', label: 'Social', icon: Link, description: 'Social links' },
  { id: 'divider', label: 'Divider', icon: Divide, description: 'Separator' },
  { id: 'color-block', label: 'Color Block', icon: Square, description: 'Solid color' },
  { id: 'custom-html', label: 'Custom HTML', icon: Code, description: 'Raw HTML' },
]

export default function WidgetEditor() {
  const { widgets, addWidget, removeWidget } = useScheduleStore()

  return (
    <div className="space-y-6">
      {/* Add Widget */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-dark-300 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Widget
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {WIDGET_TYPES.map((widget) => {
            const Icon = widget.icon
            return (
              <button
                key={widget.id}
                onClick={() => addWidget(widget.id)}
                className="p-3 bg-dark-800 hover:bg-dark-700 rounded-lg text-left transition-colors group"
              >
                <Icon className="w-4 h-4 text-primary-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-medium text-dark-200">{widget.label}</div>
                <div className="text-xs text-dark-500">{widget.description}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Current Widgets */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-dark-300">
          Current Widgets ({widgets.filter(w => w.enabled).length})
        </h3>
        <div className="space-y-2">
          <AnimatePresence>
            {widgets.map((widget) => (
              <motion.div
                key={widget.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-3 bg-dark-800 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    'w-2 h-2 rounded-full',
                    widget.enabled ? 'bg-green-500' : 'bg-red-500'
                  )} />
                  <span className="text-sm text-dark-200 capitalize">{widget.type}</span>
                </div>
                <button
                  onClick={() => removeWidget(widget.id)}
                  className="p-1 hover:bg-red-900/30 rounded text-dark-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {widgets.length === 0 && (
            <div className="text-center py-8 text-dark-500 text-sm">
              No widgets added yet
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 bg-dark-800/50 rounded-lg text-xs text-dark-400 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span>Green = Visible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <span>Red = Hidden</span>
        </div>
        <p className="mt-2">
          Click widget header in preview to expand controls and edit settings.
        </p>
      </div>
    </div>
  )
}

function clsx(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}
