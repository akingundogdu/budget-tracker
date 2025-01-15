import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const categories = {
  income: {
    billsAndIncome: [
      { id: 'salary', icon: '💰' },
      { id: 'freelance', icon: '💻' },
      { id: 'investments', icon: '📈' },
      { id: 'rental', icon: '🏠' },
    ],
    otherIncome: [
      { id: 'gifts', icon: '🎁' },
      { id: 'refunds', icon: '💸' },
      { id: 'lottery', icon: '🎰' },
      { id: 'other', icon: '📝' },
    ],
  },
  expense: {
    billsAndUtilities: [
      { id: 'phone', icon: '📱' },
      { id: 'water', icon: '💧' },
      { id: 'gas', icon: '🔥' },
      { id: 'internet', icon: '📶' },
      { id: 'rent', icon: '🏠' },
      { id: 'tv', icon: '📺' },
    ],
    healthAndFitness: [
      { id: 'run', icon: '👟' },
      { id: 'doctor', icon: '🏥' },
      { id: 'medicine', icon: '💊' },
      { id: 'exercise', icon: '🏋️' },
      { id: 'cycling', icon: '🚲' },
      { id: 'swim', icon: '🏊' },
    ],
    foodAndShopping: [
      { id: 'grocery', icon: '🛒' },
      { id: 'coffee', icon: '☕' },
      { id: 'drinks', icon: '🍷' },
      { id: 'restaurants', icon: '🍽️' },
    ],
  },
};

function CategorySelect({ onClose, onSelect, type = 'expense' }) {
  const { t } = useLanguage();
  const categoryList = categories[type];

  return (
    <div className="fixed inset-0 z-50">
      {/* Modal Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black pointer-events-none"
      />
      
      {/* Category Selector */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="absolute bottom-0 inset-x-0 bg-[#1e2b4a] rounded-t-3xl"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#243351] text-white hover:bg-[#2d3c5d]"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold text-white">{t('expenses.form.category')}</h2>
            <div className="w-10" /> {/* Spacer for alignment */}
          </div>

          {/* Categories */}
          <div className="space-y-6">
            {Object.entries(categoryList).map(([section, items]) => (
              <div key={section}>
                <h2 className="text-xl font-semibold text-white/90 mb-4">
                  {t('expenses.categories.' + section)}
                </h2>
                <div className="grid grid-cols-4 gap-4">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSelect({ ...item, name: t('expenses.categories.' + item.id) })}
                      className="flex flex-col items-center space-y-2"
                    >
                      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#243351] hover:bg-[#2d3c5d]">
                        <span className="text-2xl">{item.icon}</span>
                      </div>
                      <span className="text-sm text-white text-center">
                        {t('expenses.categories.' + item.id)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default CategorySelect; 