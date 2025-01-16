import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { ArrowLeftIcon, CalendarIcon, BellIcon } from '@heroicons/react/24/outline'
import { useNavigate, useParams } from 'react-router-dom'
import { budgetService } from '../services'
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
  const [isRegular, setIsRegular] = useState(false)
  const [regularPeriod, setRegularPeriod] = useState('monthly')

  const periods = useMemo(() => [
    { id: 'weekly', label: t('expenses.form.regularPeriod.weekly') },
    { id: 'monthly', label: t('expenses.form.regularPeriod.monthly') },
    { id: 'quarterly', label: t('expenses.form.regularPeriod.quarterly') },
    { id: 'yearly', label: t('expenses.form.regularPeriod.yearly') }
  ], [t])

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

  const handleSave = async () => {
    try {
      if (!amount || !selectedCategory || !selectedDate) {
        // Show error
        return;
      }

      const transaction = {
        amount: parseFloat(amount),
        category_id: selectedCategory.id,
        type,
        date: selectedDate.toISOString(),
        is_regular: isRegular,
        regular_period: isRegular ? regularPeriod : null
      };

      await budgetService.transactions.create(transaction);
      navigate(-1);
    } catch (error) {
      console.error('Error saving transaction:', error);
      // Show error
    }
  };

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

          {/* Regular Transaction Toggle and Period Selection */}
          <div className="w-full bg-[#1e2b4a] p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-medium">
                  {type === 'income' ? t('expenses.form.regularIncome') : t('expenses.form.regularExpense')}
                </h3>
                <p className="text-white/60 text-sm">
                  {type === 'income' ? t('expenses.form.regularIncomeHint') : t('expenses.form.regularExpenseHint')}
                </p>
              </div>
              <button
                onClick={() => setIsRegular(!isRegular)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  isRegular ? 'bg-primary' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                    isRegular ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Period Selection - Only show when regular is enabled */}
            {isRegular && (
              <div className="mt-4">
                <label className="block text-white/60 mb-2">
                  {t('expenses.form.regularPeriod.title')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {periods.map((period) => (
                    <button
                      key={period.id}
                      onClick={() => setRegularPeriod(period.id)}
                      className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                        regularPeriod === period.id
                          ? 'bg-primary text-white'
                          : 'bg-gray-600/20 text-white/60 hover:bg-gray-600/40'
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
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