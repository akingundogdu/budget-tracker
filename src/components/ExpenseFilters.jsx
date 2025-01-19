import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useFilterStore } from '../store/filterStore'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants/categories'
import DatePicker from './DatePicker'

function ExpenseFilters({ type = 'expense' }) {
  const { t } = useTranslation()
  const [showFilters, setShowFilters] = useState(false)
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)
  const [showEndDatePicker, setShowEndDatePicker] = useState(false)
  
  // Add draft state for filters
  const [draftDateFilter, setDraftDateFilter] = useState(null)
  const [draftRegularityFilter, setDraftRegularityFilter] = useState(null)
  const [draftCategoryFilter, setDraftCategoryFilter] = useState(null)

  const {
    dateFilter,
    regularityFilter,
    categoryFilter,
    setDateFilter,
    setRegularityFilter,
    setCategoryFilter,
    triggerRefetch
  } = useFilterStore()

  // Initialize draft filters when opening the modal
  const handleOpenFilters = () => {
    setDraftDateFilter(dateFilter)
    setDraftRegularityFilter(regularityFilter)
    setDraftCategoryFilter(categoryFilter)
    setShowFilters(true)
  }

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const dateTypes = [
    { id: 'all', label: t('expenses.filter.dateRange.all') },
    { id: 'current_month', label: t('expenses.filter.dateRange.month') },
    { id: 'last_month', label: t('expenses.filter.dateRange.lastMonth') },
    { id: 'next_month', label: t('expenses.filter.dateRange.nextMonth') },
    { id: 'current_year', label: t('expenses.filter.dateRange.year') },
    { id: 'last_year', label: t('expenses.filter.dateRange.lastYear') },
    { id: 'custom', label: t('expenses.filter.dateRange.custom') }
  ]

  const regularityTypes = [
    { id: 'all', label: t('expenses.filter.regularity.all') },
    { id: 'regular', label: t('expenses.filter.regularity.regular') },
    { id: 'one-time', label: t('expenses.filter.regularity.oneTime') }
  ]

  const periods = [
    { id: 'weekly', label: t('expenses.form.regularPeriod.weekly') },
    { id: 'monthly', label: t('expenses.form.regularPeriod.monthly') },
    { id: 'yearly', label: t('expenses.form.regularPeriod.yearly') }
  ]

  const getDateRange = (type) => {
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()

    switch (type) {
      case 'current_month':
        return {
          startDate: new Date(currentYear, currentMonth, 1).toISOString(),
          endDate: new Date(currentYear, currentMonth + 1, 0).toISOString()
        }
      case 'last_month':
        return {
          startDate: new Date(currentYear, currentMonth - 1, 1).toISOString(),
          endDate: new Date(currentYear, currentMonth, 0).toISOString()
        }
      case 'next_month':
        return {
          startDate: new Date(currentYear, currentMonth + 1, 1).toISOString(),
          endDate: new Date(currentYear, currentMonth + 2, 0).toISOString()
        }
      case 'current_year':
        return {
          startDate: new Date(currentYear, 0, 1).toISOString(),
          endDate: new Date(currentYear, 11, 31).toISOString()
        }
      case 'last_year':
        return {
          startDate: new Date(currentYear - 1, 0, 1).toISOString(),
          endDate: new Date(currentYear - 1, 11, 31).toISOString()
        }
      default:
        return {
          startDate: null,
          endDate: null
        }
    }
  }

  const handleDateTypeChange = (type) => {
    if (type === 'all') {
      setDraftDateFilter({ type, startDate: null, endDate: null })
    } else if (type === 'custom') {
      setDraftDateFilter({ ...draftDateFilter, type })
    } else {
      const { startDate, endDate } = getDateRange(type)
      setDraftDateFilter({ type, startDate, endDate })
    }
  }

  const handleStartDateSelect = (date) => {
    setDraftDateFilter({ ...draftDateFilter, startDate: date })
    setShowStartDatePicker(false)
  }

  const handleEndDateSelect = (date) => {
    setDraftDateFilter({ ...draftDateFilter, endDate: date })
    setShowEndDatePicker(false)
  }

  const handleRegularityTypeChange = (type) => {
    setDraftRegularityFilter({ ...draftRegularityFilter, type, period: null })
  }

  const handlePeriodChange = (period) => {
    setDraftRegularityFilter({ ...draftRegularityFilter, period })
  }

  const handleCategoryToggle = (categoryId) => {
    const newCategories = draftCategoryFilter.categories.includes(categoryId)
      ? draftCategoryFilter.categories.filter(id => id !== categoryId)
      : [...draftCategoryFilter.categories, categoryId]
    setDraftCategoryFilter({ categories: newCategories })
  }

  const handleApplyFilters = () => {
    setDateFilter(draftDateFilter)
    setRegularityFilter(draftRegularityFilter)
    setCategoryFilter(draftCategoryFilter)
    triggerRefetch()
    setShowFilters(false)
  }

  const handleResetFilters = () => {
    setDraftDateFilter({ type: 'all', startDate: null, endDate: null })
    setDraftRegularityFilter({ type: 'all', period: null })
    setDraftCategoryFilter({ categories: [] })
  }

  const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString()
  }

  return (
    <>
      {/* Filter Toggle Button */}
      <button
        onClick={handleOpenFilters}
        className="w-full flex items-center justify-between p-4 bg-[#1e2b4a] rounded-lg text-white hover:bg-[#243351] transition-colors"
      >
        <span className="flex items-center gap-2">
          <FunnelIcon className="w-5 h-5" />
          {t('expenses.filter.title')}
        </span>
        {(dateFilter.type !== 'all' || regularityFilter.type !== 'all' || categoryFilter.categories.length > 0) && (
          <span className="bg-primary px-2 py-1 rounded-full text-sm">
            {t('expenses.filter.active')}
          </span>
        )}
      </button>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilters && (
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilters(false)}>
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 500 }}
              className="absolute bottom-0 left-0 right-0 bg-[#162036] rounded-t-3xl overflow-hidden flex flex-col max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6">
                <h2 className="text-xl font-semibold text-white">
                  {t('expenses.filter.title')}
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-[#243351] rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-6">
                {/* Date Filter */}
                <div>
                  <h3 className="text-white/60 mb-3">{t('expenses.filter.date')}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {dateTypes.map((dateType) => (
                      <button
                        key={dateType.id}
                        onClick={() => handleDateTypeChange(dateType.id)}
                        className={`p-3 rounded-lg text-sm transition-colors
                          ${draftDateFilter?.type === dateType.id
                            ? 'bg-primary text-white'
                            : 'bg-[#243351] text-white/60 hover:bg-[#2d3c5d]'
                          }`}
                      >
                        {dateType.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom Date Range */}
                  {draftDateFilter?.type === 'custom' && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <button
                          onClick={() => setShowStartDatePicker(true)}
                          className="w-full p-2 bg-[#243351] rounded-lg text-white/60 text-sm text-left hover:bg-[#2d3c5d]"
                        >
                          {draftDateFilter.startDate
                            ? formatDate(draftDateFilter.startDate)
                            : t('expenses.form.selectStartDate')}
                        </button>
                      </div>
                      <div>
                        <button
                          onClick={() => setShowEndDatePicker(true)}
                          className="w-full p-2 bg-[#243351] rounded-lg text-white/60 text-sm text-left hover:bg-[#2d3c5d]"
                        >
                          {draftDateFilter.endDate
                            ? formatDate(draftDateFilter.endDate)
                            : t('expenses.form.selectEndDate')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Regularity Filter */}
                <div>
                  <h3 className="text-white/60 mb-3">{t('expenses.filter.regularity.title')}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {regularityTypes.map((regType) => (
                      <button
                        key={regType.id}
                        onClick={() => handleRegularityTypeChange(regType.id)}
                        className={`p-2 rounded-lg text-sm transition-colors
                          ${draftRegularityFilter?.type === regType.id
                            ? 'bg-primary text-white'
                            : 'bg-[#243351] text-white/60 hover:bg-[#2d3c5d]'
                          }`}
                      >
                        {regType.label}
                      </button>
                    ))}
                  </div>

                  {draftRegularityFilter?.type === 'regular' && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {periods.map((period) => (
                        <button
                          key={period.id}
                          onClick={() => handlePeriodChange(period.id)}
                          className={`p-2 rounded-lg text-sm transition-colors
                            ${draftRegularityFilter.period === period.id
                              ? 'bg-primary text-white'
                              : 'bg-[#243351] text-white/60 hover:bg-[#2d3c5d]'
                            }`}
                        >
                          {period.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-white/60 mb-3">{t('expenses.filter.category')}</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryToggle(category.id)}
                        className={`flex flex-col items-center p-2 rounded-lg transition-colors
                          ${draftCategoryFilter?.categories.includes(category.id)
                            ? 'bg-primary text-white'
                            : 'bg-[#243351] text-white/60 hover:bg-[#2d3c5d]'
                          }`}
                      >
                        <span className="text-xl mb-1">{category.icon}</span>
                        <span className="text-xs text-center">
                          {t(`expenses.categories.${category.id}`)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fixed Action Buttons */}
              <div className="p-6 bg-[#162036] border-t border-white/10">
                <div className="flex gap-3">
                  <button
                    onClick={handleResetFilters}
                    className="flex-1 p-3 bg-[#243351] text-white/60 rounded-lg hover:bg-[#2d3c5d] transition-colors"
                  >
                    {t('expenses.filter.reset')}
                  </button>
                  <button
                    onClick={handleApplyFilters}
                    className="flex-1 p-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {t('common.apply')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DatePicker
          isOpen={showStartDatePicker}
          onClose={() => setShowStartDatePicker(false)}
          onSelect={handleStartDateSelect}
          selectedDate={draftDateFilter?.startDate}
        />
      )}

      {showEndDatePicker && (
        <DatePicker
          isOpen={showEndDatePicker}
          onClose={() => setShowEndDatePicker(false)}
          onSelect={handleEndDateSelect}
          selectedDate={draftDateFilter?.endDate}
          minDate={draftDateFilter?.startDate}
        />
      )}
    </>
  )
}

export default ExpenseFilters 