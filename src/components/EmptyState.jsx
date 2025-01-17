import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { BanknotesIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'

function EmptyState({ title, description, t }) {
  const navigate = useNavigate()
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[400px] bg-[#1e2b4a] rounded-2xl p-8 flex flex-col items-center justify-center text-center"
    >
      <div className="w-16 h-16 bg-[#243351] rounded-xl flex items-center justify-center mx-auto mb-4">
        <BanknotesIcon className="w-8 h-8 text-white/60" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/60 mb-8 max-w-sm">{description}</p>
      
      <div className="flex flex-col gap-4 w-full max-w-md">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/add-transaction/expense')}
          className="w-full p-4 bg-[#243351] rounded-2xl group hover:bg-[#2a3b5e] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
              <ArrowTrendingDownIcon className="w-6 h-6 text-red-500" />
            </div>
            <h4 className="text-lg font-medium text-white">{t('expenses.addNew')}</h4>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/add-transaction/income')}
          className="w-full p-4 bg-[#243351] rounded-2xl group hover:bg-[#2a3b5e] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
              <ArrowTrendingUpIcon className="w-6 h-6 text-green-500" />
            </div>
            <h4 className="text-lg font-medium text-white">{t('income.addNew')}</h4>
          </div>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default EmptyState 