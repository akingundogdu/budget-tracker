import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { ArrowLeftIcon, CalendarIcon, BellIcon } from '@heroicons/react/24/outline'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CategorySelect from '../components/CategorySelect'
import DatePicker from '../components/DatePicker'
import ReminderSelect from '../components/ReminderSelect'
import i18n from '../i18n'

function AddTransactionPage() {
  const navigate = useNavigate()
  const { type } = useParams()
  const { t, formatMoney } = useLanguage()
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

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '')
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

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
    return date.toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US', {
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
      <div className="min-h-screen bg-[#0f172a]">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-[#1e2b4a] text-white hover:bg-[#2d3c5d]"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold text-white ml-4">
              {type === 'income' ? t('expenses.menu.addNewIncome') : t('expenses.menu.addNewExpense')}
            </h2>
          </div>

          {/* Amount Input */}
          <div className="bg-[#1e2b4a] p-4 rounded-lg mb-4">
            <label className="block text-white/60 mb-2">{t('expenses.form.amount')}</label>
            <div className="relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl text-white/60 font-semibold">
                {i18n.language === 'tr' ? '₺' : '$'}
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={handleAmountChange}
                className="w-full bg-transparent text-3xl text-white font-semibold focus:outline-none pl-8"
                placeholder="0.00"
              />
            </div>
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
      </div>

      <AnimatePresence>
        {showCategorySelect && (
          <CategorySelect
            onClose={() => setShowCategorySelect(false)}
            onSelect={handleCategorySelect}
            type={type}
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

export default AddTransactionPage 