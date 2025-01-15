import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  FunnelIcon, 
  MagnifyingGlassIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline'
import { Listbox } from '@headlessui/react'

function SearchAndFilter({ onSearch, onFilter }) {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedDateRange, setSelectedDateRange] = useState('all')
  const [selectedSort, setSelectedSort] = useState('date-desc')

  const dateRanges = [
    { id: 'all', label: t('expenses.filter.dateRange.all') },
    { id: 'today', label: t('expenses.filter.dateRange.today') },
    { id: 'week', label: t('expenses.filter.dateRange.week') },
    { id: 'month', label: t('expenses.filter.dateRange.month') },
    { id: 'year', label: t('expenses.filter.dateRange.year') }
  ]

  const sortOptions = [
    { id: 'date-desc', label: t('expenses.filter.dateDesc') },
    { id: 'date-asc', label: t('expenses.filter.dateAsc') },
    { id: 'amount-desc', label: t('expenses.filter.amountDesc') },
    { id: 'amount-asc', label: t('expenses.filter.amountAsc') }
  ]

  const handleSearch = (value) => {
    setSearchTerm(value)
    onSearch(value)
  }

  const handleFilter = () => {
    onFilter({
      dateRange: selectedDateRange,
      sort: selectedSort
    })
    setShowFilters(false)
  }

  return (
    <div className="mb-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="w-5 h-5 text-white/60" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={t('common.search')}
          className="w-full bg-[#1e2b4a] text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary placeholder-white/60"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute inset-y-0 right-3 flex items-center"
        >
          <FunnelIcon className="w-5 h-5 text-white/60" />
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-[#1e2b4a] rounded-xl p-4 space-y-4"
        >
          {/* Date Range */}
          <div>
            <label className="block text-white/60 mb-2">{t('expenses.filter.dateRange.title')}</label>
            <div className="grid grid-cols-2 gap-2">
              {dateRanges.map((range) => (
                <button
                  key={range.id}
                  onClick={() => setSelectedDateRange(range.id)}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    selectedDateRange === range.id
                      ? 'bg-primary text-white'
                      : 'bg-[#243351] text-white/60 hover:bg-[#2d3c5d]'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-white/60 mb-2">{t('expenses.filter.sortBy')}</label>
            <Listbox value={selectedSort} onChange={setSelectedSort}>
              <div className="relative">
                <Listbox.Button className="w-full bg-[#243351] text-white rounded-lg p-3 text-left">
                  {sortOptions.find(option => option.id === selectedSort)?.label}
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 w-full mt-1 bg-[#243351] rounded-lg shadow-lg">
                  {sortOptions.map((option) => (
                    <Listbox.Option
                      key={option.id}
                      value={option.id}
                      className={({ active }) =>
                        `${active ? 'bg-primary text-white' : 'text-white/60'}
                        cursor-pointer select-none relative p-3`
                      }
                    >
                      {option.label}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>

          {/* Apply Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleFilter}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium"
          >
            {t('common.apply')}
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

export default SearchAndFilter 