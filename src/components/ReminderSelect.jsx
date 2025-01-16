import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { ArrowLeftIcon, BellIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

function ReminderSelect({ isOpen, onClose, settings, onSave }) {
  const { t } = useLanguage()
  const [localSettings, setLocalSettings] = useState(settings)

  const getReminderTimeLabel = (value) => {
    switch (value) {
      case 0:
        return t('reminders.onTheDay')
      case 1:
        return t('reminders.dayBefore')
      case 7:
        return t('reminders.weekBefore')
      default:
        return t('reminders.daysBeforeFormat')
    }
  }

  const reminderTimes = [
    { value: 0, label: getReminderTimeLabel(0) },
    { value: 1, label: getReminderTimeLabel(1) },
    { value: 3, label: getReminderTimeLabel(3) },
    { value: 7, label: getReminderTimeLabel(7) }
  ]

  const handleSave = () => {
    onSave(localSettings)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Modal Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black pointer-events-none"
      />
      
      {/* Reminder Selector */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="absolute bottom-0 inset-x-0 bg-[#1e2b4a] rounded-t-3xl"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#243351] text-white hover:bg-[#2d3c5d]"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold text-white">{t('reminders.title')}</h2>
            <div className="w-10" /> {/* Spacer for alignment */}
          </div>

          {/* Enable/Disable Switch */}
          <div className="bg-[#243351] p-4 rounded-lg mb-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.enabled}
                onChange={(e) => setLocalSettings({ ...localSettings, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#2d3c5d] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              <span className="ml-3 text-white font-medium">{t('reminders.title')}</span>
            </label>
          </div>

          {localSettings.enabled && (
            <>
              {/* Reminder Time */}
              <div className="bg-[#243351] p-4 rounded-lg mb-4">
                <label className="block text-white/60 mb-3">{t('reminders.title')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {reminderTimes.map((time) => (
                    <button
                      key={time.value}
                      type="button"
                      onClick={() => setLocalSettings({ ...localSettings, daysBeforeTransaction: time.value })}
                      className={`p-3 rounded-lg text-sm transition-colors ${
                        localSettings.daysBeforeTransaction === time.value
                          ? 'bg-primary text-white'
                          : 'bg-[#2d3c5d] text-white/60 hover:bg-[#374a77]'
                      }`}
                    >
                      {time.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notification Types */}
              <div className="bg-[#243351] p-4 rounded-lg mb-4">
                <label className="block text-white/60 mb-3">{t('reminders.notificationTypes.title')}</label>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setLocalSettings({ ...localSettings, pushEnabled: !localSettings.pushEnabled })}
                    className={`w-full p-3 rounded-lg flex items-center gap-3 transition-colors ${
                      localSettings.pushEnabled ? 'bg-primary text-white' : 'bg-[#2d3c5d] text-white/60 hover:bg-[#374a77]'
                    }`}
                  >
                    <BellIcon className="w-5 h-5" />
                    <span>{t('reminders.notificationTypes.push')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocalSettings({ ...localSettings, emailEnabled: !localSettings.emailEnabled })}
                    className={`w-full p-3 rounded-lg flex items-center gap-3 transition-colors ${
                      localSettings.emailEnabled ? 'bg-primary text-white' : 'bg-[#2d3c5d] text-white/60 hover:bg-[#374a77]'
                    }`}
                  >
                    <EnvelopeIcon className="w-5 h-5" />
                    <span>{t('reminders.notificationTypes.email')}</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Save Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="w-full bg-primary text-white py-4 rounded-xl font-medium"
          >
            {t('common.save')}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default ReminderSelect 