import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from 'react-i18next'
import { useState, useEffect, useMemo } from 'react'
import { budgetService } from '../services'
import { useFilterStore } from '../store/filterStore'

function ExpenseHeader({ activeTab }) {
  const { formatMoney } = useLanguage()
  const { t } = useTranslation()
  const refetchTrigger = useFilterStore(state => state.refetchTrigger)
  const dateFilter = useFilterStore(state => state.dateFilter)
  const regularityFilter = useFilterStore(state => state.regularityFilter)
  const categoryFilter = useFilterStore(state => state.categoryFilter)
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalBudget: 0
  })

  // Combine all filter states into a single dependency
  const filterState = useMemo(() => ({
    activeTab,
    dateFilter,
    regularityFilter,
    categoryFilter,
    refetchTrigger
  }), [activeTab, dateFilter, regularityFilter, categoryFilter, refetchTrigger])

  useEffect(() => {
    fetchStats()
  }, [filterState])

  const formatDateToISOString = (date) => {
    if (!date) return null
    // Eğer date zaten string ise ve ISO formatında ise, direkt döndür
    if (typeof date === 'string' && date.includes('T')) {
      return date
    }
    // Date objesi oluştur ve ISO string'e çevir
    return new Date(date).toISOString()
  }

  const fetchStats = async () => {
    try {
      let queryParams = {
        type: filterState.activeTab
      }

      // Handle different date filter scenarios
      switch (filterState.dateFilter.type) {
        case 'all':
          // No date filters for all time
          break
        case 'current_month':
          const today = new Date()
          queryParams.startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()
          queryParams.endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString()
          break
        case 'custom':
          if (filterState.dateFilter.startDate && filterState.dateFilter.endDate) {
            queryParams.startDate = formatDateToISOString(filterState.dateFilter.startDate)
            queryParams.endDate = formatDateToISOString(filterState.dateFilter.endDate)
          }
          break
      }

      // Add regularity filters
      if (filterState.regularityFilter.type !== 'all') {
        queryParams.isRegular = filterState.regularityFilter.type === 'regular'
        if (filterState.regularityFilter.type === 'regular' && filterState.regularityFilter.period) {
          queryParams.regularPeriod = filterState.regularityFilter.period
        }
      }

      // Add category filters
      if (filterState.categoryFilter.categories.length > 0) {
        queryParams.categories = filterState.categoryFilter.categories
      }

      const stats = await budgetService.transactions.getStatsForExpense(queryParams)
      setStats({
        totalAmount: filterState.activeTab === 'expense' ? stats.totalExpenses : stats.totalIncome,
        totalBudget: stats.totalIncome
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const spentPercentage = stats.totalBudget === 0 ? 0 : (stats.totalAmount / stats.totalBudget) * 100

  return (
    <div className="p-6 pb-8">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-2">{formatMoney(stats.totalAmount)}</h1>
        <p className="text-white/60">
          {activeTab === 'expense' 
            ? `${spentPercentage.toFixed(0)}% ${t('expenses.budgetSpent')}`
            : t('expenses.monthlyIncome')}
        </p>
      </div>
    </div>
  )
}

export default ExpenseHeader 