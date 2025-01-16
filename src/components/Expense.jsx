import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import {
  ArrowLeftIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function ExpenseItem({ expense }) {
  const { formatMoney } = useLanguage()
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 rounded-lg bg-[#1e2b4a]"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-full bg-violet-500/10">
          <span className="text-2xl">{expense.icon || '💰'}</span>
        </div>
        <div>
          <h3 className="font-medium text-white">{expense.description}</h3>
          <p className="text-sm text-white/60">{expense.date}</p>
        </div>
      </div>
      <p className="font-medium text-white">{formatMoney(expense.amount)}</p>
    </motion.div>
  )
}

function Expense() {
  const navigate = useNavigate()
  const { formatMoney } = useLanguage()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('expense')
  const [expenses] = useState([
    { id: 1, description: 'Food', amount: 84.95, date: 'Jan 30, 23:18', icon: '🍽️' },
    { id: 2, description: 'Transport', amount: 9.57, date: 'Jan 29, 20:04', icon: '🚗' },
    { id: 3, description: 'Bills', amount: 5752.40, date: 'Jan 27, 09:54', icon: '📄' },
    { id: 4, description: 'Travel', amount: 271.20, date: 'Jan 26, 11:37', icon: '✈️' }
  ])

  const totalAmount = 6118.12
  const totalBudget = 25350.00
  const spentPercentage = (totalAmount / totalBudget) * 100

  const handleAddTransaction = () => {
    navigate(`/add-transaction/${activeTab}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >      
      <div className="min-h-screen bg-[#0f172a] pt-6">
        {/* Header */}
        <div className="p-6 pb-8">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">{formatMoney(totalAmount)}</h1>
            <p className="text-white/60">{spentPercentage.toFixed(0)}% of {formatMoney(totalBudget)} spent</p>
          </div>
        </div>

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
          <div className="space-y-4">
            <AnimatePresence>
              {expenses.map(expense => (
                <ExpenseItem key={expense.id} expense={expense} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Expense 