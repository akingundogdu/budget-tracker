import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import DatePicker from './DatePicker'

function RecurringTransactionForm({ 
  isRegular,
  regularPeriod,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onPeriodChange,
  onRegularChange 
}) {
  const { t } = useLanguage()
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)
  const [showEndDatePicker, setShowEndDatePicker] = useState(false)

  // Set current date as default start date when isRegular becomes true
  useEffect(() => {
    if (isRegular && !startDate) {
      onStartDateChange(new Date())
    }
  }, [isRegular])

  const periods = [
    { id: 'weekly', label: t('expenses.form.regularPeriod.weekly') },
    { id: 'monthly', label: t('expenses.form.regularPeriod.monthly') },
    { id: 'quarterly', label: t('expenses.form.regularPeriod.quarterly') },
    { id: 'yearly', label: t('expenses.form.regularPeriod.yearly') }
  ]

  const formatDate = (date) => {
    if (!date) return ''
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleEndOfYearSelect = () => {
    const endOfYear = new Date(new Date().getFullYear(), 11, 31) // December 31st of current year
    onEndDateChange(endOfYear)
  }

  const handleOneYearSelect = () => {
    if (!startDate) return

    const oneYearFromStart = new Date(startDate)
    oneYearFromStart.setFullYear(oneYearFromStart.getFullYear() + 1)
    onEndDateChange(oneYearFromStart)
  }

  return (
    <div className="w-full bg-[#1e2b4a] p-4 rounded-lg mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-medium">
            {t('expenses.form.regularExpense')}
          </h3>
          <p className="text-white/60 text-sm">
            {t('expenses.form.regularExpenseHint')}
          </p>
        </div>
        <button
          onClick={() => onRegularChange(!isRegular)}
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

      {isRegular && (
        <div className="space-y-4">
          {/* Period Selection */}
          <div>
            <label className="block text-white/60 mb-2">
              {t('expenses.form.regularPeriod.title')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {periods.map((period) => (
                <button
                  key={period.id}
                  type="button"
                  onClick={() => onPeriodChange(period.id)}
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

          {/* Start Date */}
          <div>
            <label className="block text-white/60 mb-2">
              {t('expenses.form.startDate')}
            </label>
            <button
              onClick={() => setShowStartDatePicker(true)}
              className="w-full bg-[#243351] p-3 rounded-lg text-left text-white/60 hover:bg-[#2d3c5d]"
            >
              {startDate ? formatDate(startDate) : t('expenses.form.selectStartDate')}
            </button>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-white/60 mb-2">
              {t('expenses.form.endDate')}
            </label>
            {/* Quick Selection Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                type="button"
                onClick={handleEndOfYearSelect}
                className="p-2 rounded-lg text-sm font-medium bg-gray-600/20 text-white/60 hover:bg-gray-600/40"
              >
                {t('expenses.form.untilEndOfYear')}
              </button>
              <button
                type="button"
                onClick={handleOneYearSelect}
                className="p-2 rounded-lg text-sm font-medium bg-gray-600/20 text-white/60 hover:bg-gray-600/40"
              >
                {t('expenses.form.oneYear')}
              </button>
            </div>
            <button
              onClick={() => setShowEndDatePicker(true)}
              className="w-full bg-[#243351] p-3 rounded-lg text-left text-white/60 hover:bg-[#2d3c5d]"
            >
              {endDate ? formatDate(endDate) : t('expenses.form.selectEndDate')}
            </button>
          </div>
        </div>
      )}

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DatePicker
          isOpen={showStartDatePicker}
          onClose={() => setShowStartDatePicker(false)}
          onSelect={(date) => {
            onStartDateChange(date)
            setShowStartDatePicker(false)
          }}
          selectedDate={startDate}
          minDate={new Date()}
        />
      )}

      {showEndDatePicker && (
        <DatePicker
          isOpen={showEndDatePicker}
          onClose={() => setShowEndDatePicker(false)}
          onSelect={(date) => {
            onEndDateChange(date)
            setShowEndDatePicker(false)
          }}
          selectedDate={endDate}
          minDate={startDate || new Date()}
        />
      )}
    </div>
  )
}

export default RecurringTransactionForm 