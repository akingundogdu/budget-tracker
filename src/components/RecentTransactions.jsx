import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { ArrowPathIcon, BanknotesIcon } from '@heroicons/react/24/outline'
import { ContentLoading, Loading } from './Loading'
import EmptyState from './EmptyState'

function RecentTransactionCard({ transaction }) {
  const { formatMoney, t } = useLanguage()
  
  return (
    <div className="flex items-center justify-between p-4 bg-[#1e2b4a] rounded-2xl">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${transaction.type === 'expense' ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
          <BanknotesIcon className={`w-5 h-5 ${transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'}`} />
        </div>
        <div>
          <h4 className="text-white font-medium">{t(`expenses.categories.${transaction.category}`)}</h4>
          {transaction.description && (
            <p className="text-white/60 text-sm">{transaction.description}</p>
          )}
        </div>
      </div>
      <div className="text-right">
        {transaction.is_regular && (
          <div className="flex items-center justify-end gap-1 mb-1">
            <span className="text-sm text-violet-400">{t(`expenses.regularPeriods.${transaction.regular_period}`)}</span>
            <ArrowPathIcon className="w-4 h-4 text-violet-400" title={t('expenses.recurring')} />
          </div>
        )}
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

function RecentTransactions({ 
  transactions = [], 
  isLoading, 
  page = 1,
  hasMore = false,
  onLoadMore,
  onRefresh
}) {
  const { t } = useLanguage()

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{t('dashboard.recentTransactions')}</h3>
        <button 
          onClick={onRefresh}
          className="p-2 rounded-xl bg-[#1e293b] text-white/60 hover:text-white transition-colors"
        >
          <ArrowPathIcon className="w-4 h-4" />
        </button>
      </div>
      
      {isLoading && page === 1 ? (
        <div className="min-h-[400px] bg-[#1e2b4a] rounded-2xl">
          <ContentLoading />
        </div>
      ) : transactions.length > 0 ? (
        <>
          <div className="space-y-3">
            {transactions.map(transaction => (
              <RecentTransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>

          {hasMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-4"
            >
              <button
                onClick={onLoadMore}
                disabled={isLoading}
                className="w-full p-4 flex items-center justify-center gap-2 bg-[#1e2b4a] text-white rounded-2xl hover:bg-[#243351] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
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
          title={t('dashboard.emptyState.title')}
          description={t('dashboard.emptyState.description')}
          t={t}
        />
      )}
    </div>
  )
}

export default RecentTransactions 