import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { ContentLoading } from './Loading'

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

function SummaryCards({ isLoading, summaryCards, isBalanceExpanded, onToggleBalance }) {
  const { t, formatMoney } = useLanguage()

  const dashboardStats = [
    {
      title: t('dashboard.stats.totalBalance.title'),
      amount: formatMoney(summaryCards?.totalBalance || 0),
      icon: BanknotesIcon,
      color: 'bg-violet-500',
      isExpandable: true,
      isExpanded: isBalanceExpanded,
      onToggle: onToggleBalance
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

  if (isLoading) {
    return (
      <div className="h-[100px] bg-[#1e2b4a] rounded-t-[32px]">
        <ContentLoading />
      </div>
    )
  }

  return (
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
  )
}

export default SummaryCards 