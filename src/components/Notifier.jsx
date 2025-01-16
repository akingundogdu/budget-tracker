import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

export const notify = {
  success: (message) => {
    const event = new CustomEvent('show-notification', {
      detail: { type: 'success', message }
    })
    window.dispatchEvent(event)
  },
  error: (message) => {
    const event = new CustomEvent('show-notification', {
      detail: { type: 'error', message }
    })
    window.dispatchEvent(event)
  }
}

export default function Notifier() {
  const [notifications, setNotifications] = React.useState([])

  React.useEffect(() => {
    const handleNotification = (event) => {
      const { type, message } = event.detail
      const id = Date.now()
      
      setNotifications(prev => [...prev, { id, type, message }])
      
      // Auto remove after 3 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(notification => notification.id !== id))
      }, 3000)
    }

    window.addEventListener('show-notification', handleNotification)
    return () => window.removeEventListener('show-notification', handleNotification)
  }, [])

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 md:top-24">
      <AnimatePresence>
        {notifications.map(({ id, type, message }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`flex items-center gap-2 p-4 rounded-lg shadow-lg ${
              type === 'success' 
                ? 'bg-[#1e2b4a] text-green-500 border border-green-500/20' 
                : 'bg-[#1e2b4a] text-red-500 border border-red-500/20'
            }`}
          >
            {type === 'success' ? (
              <CheckCircleIcon className="w-5 h-5 shrink-0" />
            ) : (
              <XCircleIcon className="w-5 h-5 shrink-0" />
            )}
            <span className="text-sm font-medium">{message}</span>
            <button
              onClick={() => removeNotification(id)}
              className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
} 