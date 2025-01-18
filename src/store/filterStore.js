import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialState = {
  dateFilter: {
    type: 'current_month',
    startDate: null,
    endDate: null
  },
  regularityFilter: {
    type: 'all',
    period: null
  },
  categoryFilter: {
    categories: []
  },
  refetchTrigger: 0
}

export const useFilterStore = create(
  persist(
    (set) => ({
      // State
      ...initialState,

      // Actions
      setDateFilter: (dateFilter) => set({ dateFilter }),
      setRegularityFilter: (regularityFilter) => set({ regularityFilter }),
      setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
      resetFilters: () => set(initialState),
      triggerRefetch: () => set(state => ({ refetchTrigger: state.refetchTrigger + 1 }))
    }),
    {
      name: 'expense-filters'
    }
  )
) 