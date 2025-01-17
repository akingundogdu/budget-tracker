import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { XMarkIcon, CreditCardIcon, BuildingLibraryIcon, BanknotesIcon } from '@heroicons/react/24/outline'

function PaymentMethodSelect({ isOpen, onClose, onSelect, selectedMethod }) {
  const { t } = useLanguage()

  const paymentMethods = [
    {
      id: 'credit_card',
      icon: <CreditCardIcon className="w-6 h-6" />,
      name: t('expenses.paymentMethods.creditCard'),
      description: t('expenses.paymentMethods.creditCardDesc')
    },
    {
      id: 'bank',
      icon: <BuildingLibraryIcon className="w-6 h-6" />,
      name: t('expenses.paymentMethods.bank'),
      description: t('expenses.paymentMethods.bankDesc')
    },
    {
      id: 'cash',
      icon: <BanknotesIcon className="w-6 h-6" />,
      name: t('expenses.paymentMethods.cash'),
      description: t('expenses.paymentMethods.cashDesc')
    }
  ]

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="w-full max-w-md bg-[#162036] rounded-t-3xl sm:rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            {t('expenses.paymentMethods.title')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Payment Methods List */}
        <div className="p-4">
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => {
                  onSelect(method)
                  onClose()
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  selectedMethod?.id === method.id
                    ? 'bg-primary text-white'
                    : 'bg-[#1e2b4a] hover:bg-[#243351] text-white'
                }`}
              >
                <div className="p-2 rounded-xl bg-black/20">
                  {method.icon}
                </div>
                <div className="text-left">
                  <h3 className="font-medium">{method.name}</h3>
                  <p className="text-sm opacity-60">{method.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default PaymentMethodSelect 