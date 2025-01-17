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
import { useTranslation } from 'react-i18next'

function AddTransactionPage() {
  const navigate = useNavigate()
  const { type } = useParams()
  const { t, formatMoney } = useLanguage()
  const [amount, setAmount] = useState('')
  const [displayAmount, setDisplayAmount] = useState('')
  const [description, setDescription] = useState('')
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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const periods = useMemo(() => [
    { id: 'weekly', label: t('expenses.form.regularPeriod.weekly') },
    { id: 'monthly', label: t('expenses.form.regularPeriod.monthly') },
    { id: 'quarterly', label: t('expenses.form.regularPeriod.quarterly') },
    { id: 'yearly', label: t('expenses.form.regularPeriod.yearly') }
  ], [t])

  const handleAmountChange = (e) => {
    let value = e.target.value

    // Remove all non-numeric characters
    value = value.replace(/[^0-9]/g, '')
    
    // Convert to number and format
    if (value) {
      const numericValue = parseInt(value, 10) / 100
      setAmount(numericValue.toString())
      setDisplayAmount(formatMoney(numericValue))
    } else {
      setAmount('')
      setDisplayAmount('')
    }
  }

  const handleAmountBlur = () => {
    if (amount) {
      const numericValue = parseFloat(amount)
      if (!isNaN(numericValue)) {
        setDisplayAmount(formatMoney(numericValue))
      }
    }
  }

  const handleAmountFocus = () => {
    // When focusing, show the raw number for editing
    setDisplayAmount(amount)
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

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return amount && amount !== '0' && selectedCategory && selectedDate;
  }, [amount, selectedCategory, selectedDate]);

  const handleSave = async () => {
    try {
      if (!isFormValid) {
        return;
      }

      setIsSubmitting(true)

      // Create the transaction
      const transaction = {
        amount: parseFloat(amount),
        category: selectedCategory.id,
        type,
        date: selectedDate.toISOString(),
        is_regular: isRegular,
        regular_period: isRegular ? regularPeriod : null,
        description: selectedCategory.id === 'other' ? description : null
      };

      const savedTransaction = await budgetService.transactions.create(transaction);

      // If reminder is enabled, create a reminder
      if (reminderSettings.enabled) {
        const reminderDate = new Date(selectedDate);
        reminderDate.setDate(reminderDate.getDate() - reminderSettings.daysBeforeTransaction);

        const reminder = {
          transaction_id: savedTransaction.id,
          reminder_date: reminderDate.toISOString(),
          notification_type: reminderSettings.pushEnabled && reminderSettings.emailEnabled 
            ? 'both' 
            : reminderSettings.pushEnabled 
              ? 'push' 
              : 'email'
        };

        await budgetService.reminders.create(reminder);
      }

      navigate(-1);
    } catch (error) {
      console.error('Error saving transaction:', error);
      // Show error
    } finally {
      setIsSubmitting(false)
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
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
              <input
                type="text"
                inputMode="numeric"
                value={displayAmount}
                onChange={handleAmountChange}
                className="w-full bg-transparent text-3xl text-white font-semibold focus:outline-none"
                placeholder={formatMoney(0)}
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
              {selectedCategory ? t(`expenses.categories.${selectedCategory.id}`) : t('expenses.form.category')}
            </span>
            <ArrowLeftIcon className="w-5 h-5 text-white/60 rotate-180 ml-auto" />
          </button>

          {/* Description Input - Only show when 'other' category is selected */}
          {selectedCategory?.id === 'other' && (
            <div className="bg-[#1e2b4a] p-4 rounded-lg mb-4">
              <label className="block text-white/60 mb-2">{t('expenses.form.description')}</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('expenses.form.descriptionPlaceholder')}
                className="w-full bg-[#243351] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

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
            <div>
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
            disabled={isSubmitting || !isFormValid}
            className={`w-full bg-primary text-white py-4 rounded-xl font-medium transition-all ${
              isSubmitting || !isFormValid ? 'opacity-50 cursor-not-allowed bg-gray-500' : 'hover:bg-primary/90'
            }`}
          >
            {isSubmitting ? t('common.saving') : t('common.save')}
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
    </motion.div>
  )
}

export default AddTransactionPage 