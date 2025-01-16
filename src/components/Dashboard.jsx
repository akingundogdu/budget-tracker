import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  PlusIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { budgetService } from '../services'
import { ContentLoading } from './Loading'
import EmptyState from './EmptyState'

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

function StatItem({ title, amount, icon: Icon, color, isExpandable, isExpanded, onToggle }) {
  return (
    <motion.div
      className="flex flex-col"
      layout
    >
      <div 
        className={`flex items-start justify-between p-5 bg-[#1e2b4a] rounded-t-[32px] ${!isExpandable && 'rounded-b-[32px]'} cursor-pointer`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className={`${color} w-10 h-10 rounded-2xl flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-white text-lg font-medium">{title}</h3>
            <p className="text-white text-2xl font-semibold">{amount}</p>
          </div>
        </div>
        {isExpandable && (
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDownIcon className="w-6 h-6 text-white/60" />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

function RecentTransactionCard({ transaction }) {
  const { formatMoney, t } = useLanguage()
  
  return (
    <div className="flex items-center justify-between p-4 bg-[#1e2b4a] rounded-2xl">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${transaction.type === 'expense' ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
          <BanknotesIcon className={`w-5 h-5 ${transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'}`} />
        </div>
        <div>
          <h4 className="text-white font-medium">{transaction.description}</h4>
          <p className="text-white/60 text-sm">{transaction.categories?.name}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-medium ${transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
          {transaction.type === 'expense' ? '-' : '+'}{formatMoney(transaction.amount)}
        </p>
        <p className="text-white/60 text-sm">
          {new Date(transaction.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

function Dashboard() {
  const { t, formatMoney } = useLanguage()
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

  const loadTransactions = async (dateFilters) => {
    try {
      setTransactionsLoading(true)
      const data = await budgetService.getDashboardData(dateFilters)
      setDashboardData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setTransactionsLoading(false)
    }
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

    await Promise.all([
      loadStats(dateFilters),
      loadTransactions(dateFilters)
    ])
  }

  useEffect(() => {
    loadDashboardData()
  }, [selectedMonth])

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  const { recentTransactions } = dashboardData

  const dashboardStats = [
    {
      title: t('dashboard.stats.totalBalance.title'),
      amount: formatMoney(summaryCards?.totalBalance || 0),
      icon: BanknotesIcon,
      color: 'bg-violet-500',
      isExpandable: true,
      isExpanded: isBalanceExpanded,
      onToggle: () => setIsBalanceExpanded(!isBalanceExpanded)
    },
    {
      title: t('dashboard.stats.totalIncome.title'),
      amount: formatMoney(summaryCards?.totalIncome || 0),
      icon: ArrowTrendingUpIcon,
      color: 'bg-green-500'
    },
    {
      title: t('dashboard.stats.totalExpenses.title'),
      amount: formatMoney(summaryCards?.totalExpenses || 0),
      icon: ArrowTrendingDownIcon,
      color: 'bg-red-500'
    },
    {
      title: t('dashboard.stats.regularExpenses.title'),
      amount: formatMoney(summaryCards?.regularExpenses || 0),
      icon: CalendarDaysIcon,
      color: 'bg-amber-500'
    }
  ]

  return (
    <div className="px-4 pb-20">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-white">{t('dashboard.welcome')} Akin</h1>
          <button 
            onClick={loadDashboardData}
            className="p-2 rounded-xl bg-[#1e293b] text-white/60 hover:text-white transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />

      {/* Stats */}
      {statsLoading ? (
        <div className="h-[448px] bg-[#1e2b4a] rounded-[32px]">
          <ContentLoading />
        </div>
      ) : (
        <motion.div className="space-y-4" layout>
          <StatItem {...dashboardStats[0]} />
          {isBalanceExpanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pl-4 border-l-2 border-violet-500/30 ml-5"
            >
              {dashboardStats.slice(1).map((stat, index) => (
                <StatItem key={index} {...stat} />
              ))}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Recent Transactions */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{t('dashboard.recentTransactions')}</h3>
          <button 
            onClick={() => loadTransactions({
              startDate: new Date(new Date().setMonth(selectedMonth, 1)).toISOString(),
              endDate: new Date(new Date().setMonth(selectedMonth + 1, 0)).toISOString()
            })}
            className="p-2 rounded-xl bg-[#1e293b] text-white/60 hover:text-white transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </button>
        </div>
        
        {transactionsLoading ? (
          <div className="min-h-[200px] bg-[#1e2b4a] rounded-2xl">
            <ContentLoading />
          </div>
        ) : recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.map(transaction => (
              <RecentTransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={t('dashboard.emptyState.title')}
            description={t('dashboard.emptyState.description')}
            t={t}
          />
        )}
      </div>
    </div>
  )
}

export default Dashboard 