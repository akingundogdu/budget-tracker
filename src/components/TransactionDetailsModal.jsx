import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon, 
  ArrowPathIcon, 
  CalendarIcon, 
  CreditCardIcon, 
  ClockIcon, 
  DocumentTextIcon,
  TrashIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'
import { useLanguage } from '../contexts/LanguageContext'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants/categories'

function TransactionDetailsModal({ isOpen, onClose, transaction, onDelete }) {
  const { formatMoney, t } = useLanguage()

  if (!isOpen) return null

  const formatFullDate = (date) => {
    return new Date(date).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Find category icon
  const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]
  const category = allCategories.find(cat => cat.id === transaction.category)
  const categoryIcon = category?.icon || '💰'

  const handleDelete = async () => {
    try {
      await onDelete(transaction.id)
      onClose()
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60"
        />

        {/* Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-3xl bg-[#1e2b4a] p-6"
        >
          {/* Handle */}
          <div className="absolute left-1/2 top-3 h-1 w-12 -translate-x-1/2 rounded-full bg-white/20" />

          {/* Header */}
          <div className="mb-6 mt-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">{t('expenses.details.title')}</h2>
            <button 
              onClick={onClose}
              className="rounded-xl bg-[#243351] p-2 text-white/60 transition-colors hover:bg-[#2d3c5d] hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Amount Section */}
            <div className="rounded-2xl bg-[#243351] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">{t('expenses.details.amount')}</p>
                  <p className="mt-1 text-3xl font-bold text-white">
                    {formatMoney(transaction.amount)}
                  </p>
                </div>
                {transaction.is_regular && (
                  <div className="flex items-center gap-2 rounded-xl bg-violet-500/10 px-3 py-2">
                    <ArrowPathIcon className="h-5 w-5 text-violet-400" />
                    <span className="text-sm text-violet-400">
                      {t(`expenses.regularPeriods.${transaction.regular_period}`)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Category and Description */}
            <div className="space-y-4 rounded-2xl bg-[#243351] p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-violet-500/10 p-3">
                  <span className="text-2xl">
                    {categoryIcon}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">
                    {t(`expenses.categories.${transaction.category}`)}
                  </h3>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-4 rounded-2xl bg-[#243351] p-6">
              {/* Transaction Type */}
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-[#1e2b4a] p-3">
                  <BanknotesIcon className="h-6 w-6 text-white/60" />
                </div>
                <div>
                  <p className="text-sm text-white/60">{t('expenses.details.type')}</p>
                  <p className="text-white">{t(`expenses.menu.${transaction.type}`)}</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-[#1e2b4a] p-3">
                  <CalendarIcon className="h-6 w-6 text-white/60" />
                </div>
                <div>
                  <p className="text-sm text-white/60">{t('expenses.details.date')}</p>
                  <p className="text-white">{formatFullDate(transaction.date)}</p>
                </div>
              </div>

              {/* Payment Method */}
              {transaction.payment_method && (
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-[#1e2b4a] p-3">
                    <CreditCardIcon className="h-6 w-6 text-white/60" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">{t('expenses.details.paymentMethod')}</p>
                    <p className="text-white">
                      {t(`expenses.paymentMethods.${transaction.payment_method}`)}
                    </p>
                  </div>
                </div>
              )}

              {/* Recurring Details */}
              {transaction.is_regular && (
                <>
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-[#1e2b4a] p-3">
                      <ClockIcon className="h-6 w-6 text-white/60" />
                    </div>
                    <div>
                      <p className="text-sm text-white/60">{t('expenses.details.recurring')}</p>
                      <p className="text-white">
                        {t(`expenses.regularPeriods.${transaction.regular_period}`)}
                      </p>
                    </div>
                  </div>
                  {/* Next Payment Date */}
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-[#1e2b4a] p-3">
                      <CalendarIcon className="h-6 w-6 text-white/60" />
                    </div>
                    <div>
                      <p className="text-sm text-white/60">{t('expenses.details.nextPayment')}</p>
                      <p className="text-white">
                        {formatFullDate(transaction.next_payment_date || transaction.date)}
                      </p>
                    </div>
                  </div>
                  {/* End Date */}
                  {transaction.end_date && (
                    <div className="flex items-center gap-4">
                      <div className="rounded-xl bg-[#1e2b4a] p-3">
                        <CalendarIcon className="h-6 w-6 text-white/60" />
                      </div>
                      <div>
                        <p className="text-sm text-white/60">{t('expenses.details.endDate')}</p>
                        <p className="text-white">{formatFullDate(transaction.end_date)}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Notes/Description */}
              {transaction.description && (
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-[#1e2b4a] p-3">
                    <DocumentTextIcon className="h-6 w-6 text-white/60" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">{t('expenses.details.notes')}</p>
                    <p className="text-white">{transaction.description}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={onClose}
                className="rounded-xl bg-[#243351] px-6 py-3 text-white/60 transition-colors hover:bg-[#2d3c5d] hover:text-white"
              >
                {t('common.close')}
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-6 py-3 text-red-500 transition-colors hover:bg-red-500/20"
              >
                <TrashIcon className="h-5 w-5" />
                {t('common.delete')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default TransactionDetailsModal 