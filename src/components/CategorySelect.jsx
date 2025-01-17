import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, CATEGORY_GROUPS } from '../constants/categories';

function CategorySelect({ onClose, onSelect, type = 'expense' }) {
  const { t } = useTranslation();

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const groups = CATEGORY_GROUPS[type];

  // Group categories
  const groupedCategories = categories.reduce((acc, category) => {
    if (!acc[category.group]) {
      acc[category.group] = [];
    }
    acc[category.group].push(category);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 500 }}
        className="absolute bottom-0 left-0 right-0 bg-[#162036] rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-white mb-6">
          {t('expenses.form.category')}
        </h2>

        <div className="space-y-6">
          {Object.entries(groupedCategories).map(([groupId, groupCategories]) => (
            <div key={groupId}>
              <h3 className="text-white/60 text-sm mb-3">
                {t(`expenses.categories.${groupId}`)}
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {groupCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => onSelect(category)}
                    className="flex flex-col items-center p-3 rounded-lg bg-[#1e2b4a] hover:bg-[#243351] transition-colors"
                  >
                    <span className="text-2xl mb-2">{category.icon}</span>
                    <span className="text-white text-sm text-center">
                      {t(`expenses.categories.${category.id}`)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CategorySelect; 