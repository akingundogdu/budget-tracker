import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'
import { budgetService } from '../services'
import RecentTransactions from './RecentTransactions'
import SummaryCards from './SummaryCards'
import DashboardHeader from './DashboardHeader'

function MonthSelector({ selectedMonth, onMonthChange }) {
  const { t } = useLanguage()
  
  const scrollToSelectedMonth = () => {
    const selectedElement = document.getElementById(`month-${selectedMonth}`)
    if (selectedElement) {
      selectedElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }

  React.useEffect(() => {
    scrollToSelectedMonth()
  }, [selectedMonth])

  return (
    <div className="mb-6">
      <div className="flex items-center gap-12 overflow-x-auto scrollbar-hide px-4 py-2 scroll-smooth">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            id={`month-${i}`}
            onClick={() => onMonthChange(i)}
            className="relative cursor-pointer shrink-0 pb-2"
          >
            <span className={`text-xl transition-colors ${
              i === selectedMonth
                ? 'text-violet-500 font-medium'
                : 'text-gray-500'
            }`}>
              {t(`dashboard.filter.months.${i + 1}`)}
            </span>
            {i === selectedMonth && (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-violet-500 rounded-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function Dashboard() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [statsLoading, setStatsLoading] = useState(true)
  const [transactionsLoading, setTransactionsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dashboardData, setDashboardData] = useState({
    recentTransactions: []
  })
  const [summaryCards, setSummaryCards] = useState(null)
  const [isBalanceExpanded, setIsBalanceExpanded] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const ITEMS_PER_PAGE = 5

  const loadTransactions = async (dateFilters, pageNum = 1, reset = false) => {
    try {
      setTransactionsLoading(true)
      const data = await budgetService.getDashboardData({
        ...dateFilters,
        page: pageNum,
        limit: ITEMS_PER_PAGE
      })
      
      setDashboardData(prev => ({
        ...prev,
        recentTransactions: reset ? data.recentTransactions : [...prev.recentTransactions, ...data.recentTransactions]
      }))
      setHasMore(data.recentTransactions.length === ITEMS_PER_PAGE)
    } catch (err) {
      setError(err.message)
    } finally {
      setTransactionsLoading(false)
    }
  }

  const handleLoadMore = async () => {
    const nextPage = page + 1
    setPage(nextPage)
    
    const startDate = new Date()
    startDate.setMonth(selectedMonth)
    startDate.setDate(1)
    
    const endDate = new Date()
    endDate.setMonth(selectedMonth + 1)
    endDate.setDate(0)

    await loadTransactions({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }, nextPage)
  }

  const loadStats = async (dateFilters) => {
    try {
      setStatsLoading(true)
      const cards = await budgetService.getSummaryCards(dateFilters)
      setSummaryCards(cards)
    } catch (err) {
      setError(err.message)
    } finally {
      setStatsLoading(false)
    }
  }

  const loadDashboardData = async () => {
    try {
      const startDate = new Date()
      startDate.setMonth(selectedMonth)
      startDate.setDate(1)
      
      const endDate = new Date()
      endDate.setMonth(selectedMonth + 1)
      endDate.setDate(0)

      const dateFilters = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }

      setPage(1)
      setHasMore(true)

      await Promise.all([
        loadStats(dateFilters),
        loadTransactions(dateFilters, 1, true)
      ])
    } catch (err) {
      if (err.message === 'User not authenticated') {
        navigate('/login')
        return
      }
      setError(err.message)
    }
  }

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        if (isMounted) {
          await loadDashboardData()
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [selectedMonth])

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  const { recentTransactions } = dashboardData

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="px-4 pb-20">
        <DashboardHeader onRefresh={loadDashboardData} />

        <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />

        {/* Stats */}
        <SummaryCards 
          isLoading={statsLoading}
          summaryCards={summaryCards}
          isBalanceExpanded={isBalanceExpanded}
          onToggleBalance={() => setIsBalanceExpanded(!isBalanceExpanded)}
        />

        {/* Recent Transactions */}
        <RecentTransactions 
          transactions={recentTransactions}
          isLoading={transactionsLoading}
          page={page}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          onRefresh={loadDashboardData}
        />
      </div>
    </motion.div>
  )
}

export default Dashboard 