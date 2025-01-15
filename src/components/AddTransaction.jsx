import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { ArrowLeftIcon, CalendarIcon, BellIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import CategorySelect from './CategorySelect'
import DatePicker from './DatePicker'

const ReminderSelect = ({ isOpen, onClose, settings, onSave }) => {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-[#0f172a] z-50"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#1e2b4a] text-white hover:bg-[#2d3c5d]"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold text-white ml-4">{t('reminders.title')}</h2>
        </div>

        {/* Enable/Disable Switch */}
        <div className="bg-[#1e2b4a] p-4 rounded-lg mb-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localSettings.enabled}
              onChange={(e) => setLocalSettings({ ...localSettings, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#243351] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            <span className="ml-3 text-white font-medium">{t('reminders.title')}</span>
          </label>
        </div>

        {localSettings.enabled && (
          <>
            {/* Reminder Time */}
            <div className="bg-[#1e2b4a] p-4 rounded-lg mb-4">
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
                        : 'bg-[#243351] text-white/60 hover:bg-[#2d3c5d]'
                    }`}
                  >
                    {time.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Types */}
            <div className="bg-[#1e2b4a] p-4 rounded-lg mb-4">
              <label className="block text-white/60 mb-3">{t('reminders.notificationTypes.title')}</label>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setLocalSettings({ ...localSettings, pushEnabled: !localSettings.pushEnabled })}
                  className={`w-full p-3 rounded-lg flex items-center gap-3 transition-colors ${
                    localSettings.pushEnabled ? 'bg-primary text-white' : 'bg-[#243351] text-white/60 hover:bg-[#2d3c5d]'
                  }`}
                >
                  <BellIcon className="w-5 h-5" />
                  <span>{t('reminders.notificationTypes.push')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLocalSettings({ ...localSettings, emailEnabled: !localSettings.emailEnabled })}
                  className={`w-full p-3 rounded-lg flex items-center gap-3 transition-colors ${
                    localSettings.emailEnabled ? 'bg-primary text-white' : 'bg-[#243351] text-white/60 hover:bg-[#2d3c5d]'
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
  )
}

const AddTransaction = ({ onClose, type = 'expense' }) => {
  const { t } = useLanguage()
  const [amount, setAmount] = useState('')
  const [showCategorySelect, setShowCategorySelect] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showReminderSelect, setShowReminderSelect] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [reminderSettings, setReminderSettings] = useState({
    enabled: false,
    daysBeforeTransaction: 0,
    pushEnabled: true,
    emailEnabled: false
  })

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setShowCategorySelect(false)
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setShowDatePicker(false)
  }

  const handleReminderSave = (settings) => {
    setReminderSettings(settings)
    setShowReminderSelect(false)
  }

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString(t('language') === 'tr' ? 'tr-TR' : 'en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  const formatReminderText = (settings) => {
    if (!settings.enabled) return '';

    let timeText = '';
    if (settings.daysBeforeTransaction === 0) {
      timeText = t('reminders.onTheDay');
    } else if (settings.daysBeforeTransaction === 1) {
      timeText = t('reminders.dayBefore');
    } else if (settings.daysBeforeTransaction === 7) {
      timeText = t('reminders.weekBefore');
    } else {
      timeText = t('reminders.daysBeforeFormat', { days: settings.daysBeforeTransaction });
    }

    let methodText = '';
    if (settings.pushEnabled && settings.emailEnabled) {
      methodText = t('reminders.notificationTypes.viaFormat.pushAndEmail');
    } else if (settings.pushEnabled) {
      methodText = t('reminders.notificationTypes.viaFormat.pushOnly');
    } else if (settings.emailEnabled) {
      methodText = t('reminders.notificationTypes.viaFormat.emailOnly');
    }

    return `${timeText} ${methodText}`;
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-0 bg-[#0f172a] z-50"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#1e2b4a] text-white hover:bg-[#2d3c5d]"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold text-white ml-4">
              {type === 'expense' ? t('expenses.addNew') : t('income.addNew')}
            </h2>
          </div>

          {/* Amount Input */}
          <div className="bg-[#1e2b4a] p-4 rounded-lg mb-4">
            <label className="block text-white/60 mb-2">{t('expenses.form.amount')}</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent text-3xl text-white font-semibold focus:outline-none"
              placeholder="0.00"
            />
          </div>

          {/* Category Selection */}
          <button
            onClick={() => setShowCategorySelect(true)}
            className="w-full bg-[#1e2b4a] p-4 rounded-lg mb-4 flex items-center"
          >
            <div className="w-8 h-8 bg-gray-600/20 rounded-lg flex items-center justify-center mr-3">
              {selectedCategory?.icon || '📁'}
            </div>
            <span className="text-white/60">
              {selectedCategory?.name || t('expenses.form.category')}
            </span>
            <ArrowLeftIcon className="w-5 h-5 text-white/60 rotate-180 ml-auto" />
          </button>

          {/* Date Selection */}
          <button
            onClick={() => setShowDatePicker(true)}
            className="w-full bg-[#1e2b4a] p-4 rounded-lg mb-4 flex items-center"
          >
            <div className="w-8 h-8 bg-gray-600/20 rounded-lg flex items-center justify-center mr-3">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-white/60">
              {selectedDate ? formatDate(selectedDate) : t('common.setDate')}
            </span>
            <ArrowLeftIcon className="w-5 h-5 text-white/60 rotate-180 ml-auto" />
          </button>

          {/* Reminder Selection */}
          <button
            onClick={() => setShowReminderSelect(true)}
            className="w-full bg-[#1e2b4a] p-4 rounded-lg mb-4 flex items-center"
          >
            <div className="w-8 h-8 bg-gray-600/20 rounded-lg flex items-center justify-center mr-3">
              <BellIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <span className="text-white/60">{t('common.setReminder')}</span>
              {reminderSettings.enabled && (
                <p className="text-sm text-white/40 mt-1">
                  {formatReminderText(reminderSettings)}
                </p>
              )}
            </div>
            <ArrowLeftIcon className="w-5 h-5 text-white/60 rotate-180 ml-auto" />
          </button>

          {/* Save Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary text-white py-4 rounded-xl font-medium"
          >
            {t('common.save')}
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showCategorySelect && (
          <CategorySelect
            onClose={() => setShowCategorySelect(false)}
            onSelect={handleCategorySelect}
          />
        )}
        {showDatePicker && (
          <DatePicker
            onClose={() => setShowDatePicker(false)}
            onSelect={handleDateSelect}
          />
        )}
        {showReminderSelect && (
          <ReminderSelect
            isOpen={showReminderSelect}
            onClose={() => setShowReminderSelect(false)}
            settings={reminderSettings}
            onSave={handleReminderSave}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default AddTransaction 