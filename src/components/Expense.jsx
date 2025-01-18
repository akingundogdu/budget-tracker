import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import {
  PlusIcon,
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { budgetService } from '../services'
import ExpensesList from './ExpensesList'
import ExpenseHeader from './ExpenseHeader'
import { useFilterStore } from '../store/filterStore'

function Expense() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { dateFilter } = useFilterStore()
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTransactionTab') || 'expense'
  })
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalBudget: 0
  })

  useEffect(() => {
    fetchStats()
  }, [activeTab, dateFilter])

  useEffect(() => {
    localStorage.setItem('activeTransactionTab', activeTab)
  }, [activeTab])

  const fetchStats = async () => {
    try {
      const params = {}

      // Only add date range if not filtering for all time
      if (dateFilter.type !== 'all') {
        const today = new Date()
        params.startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()
        params.endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString()
      }

      const stats = await budgetService.transactions.getStatsForExpense(params)
      setStats({
        totalAmount: activeTab === 'expense' ? stats.totalExpenses : stats.totalIncome,
        totalBudget: stats.totalIncome
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const spentPercentage = stats.totalBudget === 0 ? 0 : (stats.totalAmount / stats.totalBudget) * 100

  const handleAddTransaction = () => {
    navigate(`/add-transaction/${activeTab}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="select-none"
    >      
      <div className="min-h-screen bg-[#0f172a] pt-6">
        {/* Header */}
        <ExpenseHeader 
          totalAmount={stats.totalAmount}
          spentPercentage={spentPercentage}
          activeTab={activeTab}
        />

        {/* Main Content */}
        <div className="bg-[#162036] min-h-screen rounded-t-3xl p-6">
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-[#1e2b4a] rounded-lg mb-6">
            {['income', 'expense'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-6 rounded-lg text-white capitalize transition-colors
                  ${activeTab === tab ? 'bg-primary hover:bg-primary/90' : 'hover:bg-[#243351]'}`}
              >
                {t(`expenses.menu.${tab}`)}
              </button>
            ))}
          </div>

          {/* Add New Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddTransaction}
            className="w-full p-4 mb-6 flex items-center justify-center gap-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <PlusIcon className="w-5 h-5" />
            {t(`expenses.menu.addNew${activeTab === 'income' ? 'Income' : 'Expense'}`)}
          </motion.button>

          {/* Expenses List */}
          <ExpensesList type={activeTab} />
        </div>
      </div>
    </motion.div>
  )
}

export default Expense 