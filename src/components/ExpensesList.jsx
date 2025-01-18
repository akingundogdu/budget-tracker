import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from 'react-i18next'
import { Loading } from './Loading'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants/categories'
import { useState, useEffect } from 'react'
import { budgetService } from '../services'
import EmptyState from './EmptyState'
import { notify } from './Notifier'
import ConfirmDialog from './ConfirmDialog'
import { useLongPress } from '@uidotdev/usehooks'
import ExpenseFilters from './ExpenseFilters'
import { useFilterStore } from '../store/filterStore'

function ExpenseItem({ expense, onDelete }) {
  const { formatMoney } = useLanguage()
  const { t } = useTranslation()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const longPressProps = useLongPress(
    () => {
      setShowConfirmDialog(true)
      setIsPressed(false)
    },
    {
      onStart: () => setIsPressed(true),
      onCancel: () => setIsPressed(false),
      onFinish: () => setIsPressed(false),
      threshold: 400,
    }
  )

  // Find the category from our constants
  const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]
  const categoryIcon = allCategories.find(cat => cat.id === expense.category)?.icon || '💰'

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(expense.id)
      notify.success(t('expenses.deleteSuccess'))
    } catch (error) {
      notify.error(t('expenses.deleteError'))
      console.error('Error deleting expense:', error)
    }
    setIsDeleting(false)
  }

  const expenseType = t(`expenses.categories.${expense.category}`)
  const confirmMessage = t('expenses.deleteConfirmation', { 
    type: expenseType, 
    amount: formatMoney(expense.amount) 
  })

  return (
    <>
      <motion.div
        {...longPressProps}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: isPressed ? 0.98 : 1,
          backgroundColor: isPressed ? '#243351' : '#1e2b4a'
        }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-between p-4 rounded-lg group cursor-pointer select-none"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-violet-500/10">
            <span className="text-2xl">{categoryIcon}</span>
          </div>
          <div>
            <h3 className="font-medium text-white">
              {t(`expenses.categories.${expense.category}`)}
              {expense.category === 'other' && expense.description && (
                <span className="text-white/60 text-sm ml-2">
                  ({expense.description})
                </span>
              )}
            </h3>
            <p className="text-sm text-white/60">{new Date(expense.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            {expense.is_regular && (
              <div className="flex items-center justify-end gap-1 mb-1">
                <span className="text-sm text-violet-400">{t(`expenses.regularPeriods.${expense.regular_period}`)}</span>
                <ArrowPathIcon className="w-4 h-4 text-violet-400" title={t('expenses.recurring')} />
              </div>
            )}
            <p className="font-medium text-white">{formatMoney(expense.amount)}</p>
            {expense.payment_method && (
              <p className="text-sm text-white/40">
                {t(`expenses.paymentMethods.${expense.payment_method}`)}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmDelete}
        title={t('expenses.deleteTitle')}
        message={confirmMessage}
        confirmText={t('expenses.deleteButton')}
        type="danger"
      />
    </>
  )
}

function ExpensesList({ type }) {
  const { t } = useTranslation()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const ITEMS_PER_PAGE = 10

  const { dateFilter, regularityFilter, categoryFilter } = useFilterStore()

  useEffect(() => {
    setExpenses([])
    setPage(1)
    setHasMore(true)
    fetchTransactions(1, true)
    console.log(dateFilter, regularityFilter, categoryFilter, "dateFilter")
  }, [type, dateFilter, regularityFilter, categoryFilter])

  const fetchTransactions = async (pageNum, reset = false) => {
    try {
      setLoading(true)
      
      // Prepare filter parameters
      const filterParams = {
        type,
        page: pageNum,
        limit: ITEMS_PER_PAGE
      }

      // Add date filter
      if (dateFilter.type !== 'all') {
        filterParams.startDate = dateFilter.startDate ? new Date(dateFilter.startDate).toISOString() : undefined
        filterParams.endDate = dateFilter.endDate ? new Date(dateFilter.endDate).toISOString() : undefined
      }

      // Add regularity filter
      if (regularityFilter.type !== 'all') {
        filterParams.isRegular = regularityFilter.type === 'regular'
        if (regularityFilter.type === 'regular' && regularityFilter.period) {
          filterParams.regularPeriod = regularityFilter.period
        }
      }

      // Add category filter
      if (categoryFilter.categories.length > 0) {
        filterParams.categories = categoryFilter.categories
      }

      const transactions = await budgetService.transactions.getAllForExpense(filterParams)
    
      setExpenses(prev => reset ? transactions : [...prev, ...transactions])
      setHasMore(transactions.length === ITEMS_PER_PAGE)
    } catch (error) {
      console.error('Error fetching transactions:', error)
      notify.error(t('expenses.fetchError'))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await budgetService.transactions.delete(id)
      setExpenses(prev => prev.filter(expense => expense.id !== id))
    } catch (error) {
      console.error('Error deleting transaction:', error)
      throw error
    }
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchTransactions(nextPage)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <ExpenseFilters type={type} />

      {/* Expenses List */}
      <AnimatePresence>
        {loading && page === 1 ? (
          <div className="flex items-center justify-center py-8">
            <Loading />
          </div>
        ) : expenses.length > 0 ? (
          <>
            <div className="space-y-4">
              {expenses.map(expense => (
                <ExpenseItem 
                  key={expense.id} 
                  expense={expense} 
                  onDelete={handleDelete}
                />
              ))}
            </div>
            
            {hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-4"
              >
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="w-full p-4 flex items-center justify-center gap-2 bg-[#1e2b4a] text-white rounded-lg hover:bg-[#243351] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <Loading size="small" />
                      {t('common.loading')}
                    </>
                  ) : (
                    t('expenses.loadMore')
                  )}
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <EmptyState
            title={t('expenses.emptyState.title')}
            description={t('expenses.emptyState.description')}
            t={t}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default ExpensesList 