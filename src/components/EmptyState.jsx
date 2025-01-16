import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BanknotesIcon, PlusIcon } from '@heroicons/react/24/outline'

function EmptyState({ title, description, t }) {
  return (
    <div className="bg-[#1e2b4a] rounded-2xl p-8 text-center">
      <div className="w-16 h-16 bg-[#243351] rounded-xl flex items-center justify-center mx-auto mb-4">
        <BanknotesIcon className="w-8 h-8 text-white/60" />
      </div>
      <h3 className="text-white font-medium text-lg mb-2">{title}</h3>
      <p className="text-white/60 mb-6">{description}</p>
      <motion.div whileTap={{ scale: 0.98 }}>
        <Link
          to="/add-transaction/expense"
          className="inline-flex items-center gap-2 bg-violet-500 text-white px-6 py-3 rounded-xl font-medium"
        >
          <PlusIcon className="w-5 h-5" />
          <span>{t('expenses.addNew')}</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default EmptyState 