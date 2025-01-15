import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import {
  ShoppingBagIcon,
  HomeIcon,
  CreditCardIcon,
  PaperAirplaneIcon,
  DevicePhoneMobileIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

function AddExpenseForm({ isOpen, onClose, onSubmit }) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })

  const categories = [
    { id: 'food', icon: <ShoppingBagIcon className="w-6 h-6" />, color: 'text-yellow-500', label: t('expenses.categories.food') },
    { id: 'transport', icon: <HomeIcon className="w-6 h-6" />, color: 'text-blue-500', label: t('expenses.categories.transport') },
    { id: 'bills', icon: <CreditCardIcon className="w-6 h-6" />, color: 'text-red-500', label: t('expenses.categories.bills') },
    { id: 'travel', icon: <PaperAirplaneIcon className="w-6 h-6" />, color: 'text-green-500', label: t('expenses.categories.travel') },
    { id: 'mobile', icon: <DevicePhoneMobileIcon className="w-6 h-6" />, color: 'text-purple-500', label: t('expenses.categories.mobile') }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[#1e2b4a] rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">{t('expenses.addNew')}</h2>
              <button onClick={onClose} className="text-white/60 hover:text-white">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/60 mb-2">{t('expenses.form.amount')}</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-[#243351] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-white/60 mb-2">{t('expenses.form.category')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.id })}
                      className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-colors
                        ${formData.category === cat.id ? 'bg-primary text-white' : 'bg-[#243351] hover:bg-[#2d3c5d]'}`}
                    >
                      <div className={cat.color}>{cat.icon}</div>
                      <span className="text-xs text-white">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-2">{t('expenses.form.description')}</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#243351] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-white/60 mb-2">{t('expenses.form.date')}</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-[#243351] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 rounded-lg bg-[#243351] text-white hover:bg-[#2d3c5d] transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  {t('common.save')}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AddExpenseForm 