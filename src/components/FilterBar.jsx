import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { RadioGroup, Listbox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

function FilterBar({ onFilterChange }) {
  const { t } = useLanguage()
  const [filterType, setFilterType] = useState('monthly') // 'total' or 'monthly'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)

  const years = Array.from({ length: 5 }, (_, i) => selectedYear - i)

  useEffect(() => {
    onFilterChange({
      type: filterType,
      year: selectedYear,
      month: selectedMonth
    })
  }, [filterType, selectedYear, selectedMonth])

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Period Type Selection */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('dashboard.filter.period')}
          </label>
          <RadioGroup value={filterType} onChange={setFilterType} className="mt-1">
            <div className="flex gap-4">
              <RadioGroup.Option value="monthly">
                {({ checked }) => (
                  <span className={`
                    ${checked ? 'bg-primary text-white' : 'bg-white text-gray-900'}
                    px-3 py-1 rounded-md cursor-pointer border border-gray-200 text-sm
                  `}>
                    {t('dashboard.filter.monthly')}
                  </span>
                )}
              </RadioGroup.Option>
              <RadioGroup.Option value="total">
                {({ checked }) => (
                  <span className={`
                    ${checked ? 'bg-primary text-white' : 'bg-white text-gray-900'}
                    px-3 py-1 rounded-md cursor-pointer border border-gray-200 text-sm
                  `}>
                    {t('dashboard.filter.total')}
                  </span>
                )}
              </RadioGroup.Option>
            </div>
          </RadioGroup>
        </div>

        {/* Year Selection */}
        <div className="w-full md:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('dashboard.filter.year')}
          </label>
          <Listbox value={selectedYear} onChange={setSelectedYear}>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-200 focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:text-sm">
                <span className="block truncate">{selectedYear}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {years.map((year) => (
                  <Listbox.Option
                    key={year}
                    value={year}
                    className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-primary text-white' : 'text-gray-900'
                    }`}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {year}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        {/* Month Selection */}
        {filterType === 'monthly' && (
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('dashboard.filter.month')}
            </label>
            <Listbox value={selectedMonth} onChange={setSelectedMonth}>
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-200 focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:text-sm">
                  <span className="block truncate">{t(`dashboard.filter.months.${selectedMonth}`)}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <Listbox.Option
                      key={month}
                      value={month}
                      className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-primary text-white' : 'text-gray-900'
                      }`}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {t(`dashboard.filter.months.${month}`)}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>
        )}
      </div>
    </div>
  )
}

export default FilterBar 