import { tr } from 'framer-motion/client'
import { supabase } from './index'

const transactionService = {
  create: async (transaction) => {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      throw userError
    }

    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        ...transaction,
        user_id: user.id
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  },

  getAllForDashboard: async ({ type, page = 1, limit = 10, startDate, endDate }) => {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      throw userError
    }

    if (!user) {
      throw new Error('User not authenticated')
    }

    const start = (page - 1) * limit
    const end = start + limit - 1

    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

      // Apply type filter if provided
      if (type) {
        query = query.eq('type', type)
      }

      // Apply date filters if provided
      if (startDate) {
        query = query.gte('date', startDate)
      }
      if (endDate) {
        query = query.lte('date', endDate)
      }

    // Apply pagination
    query = query.range(start, end)

      const { data, error } = await query

    if (error) {
      throw error
    }

    return data
  },

  getAllForExpense: async ({ type, page = 1, limit = 10, startDate, endDate, isRegular, regularPeriod, categories }) => {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      throw userError
    }

    if (!user) {
      throw new Error('User not authenticated')
    }

    const start = (page - 1) * limit
    const end = start + limit - 1

    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

      // Apply type filter if provided
      if (type) {
        query = query.eq('type', type)
      }

      // Apply date filters if provided
      if (startDate) {
        query = query.gte('date', startDate)
      }
      if (endDate) {
        query = query.lte('date', endDate)
      }

      if (isRegular) {
        query = query.eq('is_regular', true)
      }

      if (regularPeriod) {
        query = query.eq('regular_period', regularPeriod)
      }

      if (categories) {
        query = query.in('category', categories)
      }


    // Apply pagination
    query = query.range(start, end)

      const { data, error } = await query

    if (error) {
      throw error
    }

    return data
  },

  getStats: async ({ startDate, endDate } = {}) => {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      throw userError
    }

    if (!user) {
      throw new Error('User not authenticated')
    }

    console.log("getStats")
    // If no dates provided, use current month
    if (!startDate || !endDate) {
      const today = new Date()
      startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString()
    }

    // Get all transactions for the selected month (both regular and non-regular)
    const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount, type, is_regular')
        .eq('user_id', user.id)
.gte('date', startDate)
      .lte('date', endDate)

    if (error) {
      throw error
      }

      // Calculate totals
    const totals = (transactions || []).reduce((acc, t) => ({
      totalIncome: acc.totalIncome + (t.type === 'income' ? t.amount : 0),
      totalExpenses: acc.totalExpenses + (t.type === 'expense' ? t.amount : 0),
      regularExpenses: acc.regularExpenses + (t.type === 'expense' && t.is_regular ? t.amount : 0)
    }), {
        totalIncome: 0,
        totalExpenses: 0,
        regularExpenses: 0
            })

      return totals
      },

      getStatsForExpense: async ({ 
        type,
        startDate, 
        endDate,
        isRegular,
        regularPeriod,
        categories
      } = {}) => {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          throw userError
        }
    
        if (!user) {
          throw new Error('User not authenticated')
        }
    
        try {
          let query = supabase
            .from('transactions')
            .select('type, amount.sum()')
            .eq('user_id', user.id)
    
          // Apply type filter if provided
          if (type) {
            query = query.eq('type', type)
          }
    
          // Apply date filters if provided
          if (startDate) {
            query = query.gte('date', startDate)
          }
          if (endDate) {
            query = query.lte('date', endDate)
          }

          // Apply regularity filters if provided
          if (isRegular !== undefined) {
            query = query.eq('is_regular', isRegular)
          }

          if (regularPeriod) {
            query = query.eq('regular_period', regularPeriod)
          }

          // Apply category filters if provided
          if (categories && categories.length > 0) {
            query = query.in('category', categories)
          }
    
          const { data, error } = await query
        
          if (error) throw error
    
          // Initialize default values
          const totals = {
            totalIncome: 0,
            totalExpenses: 0,
            regularExpenses: 0
          }
    
          // Map the results to our totals object
          data?.forEach(row => {
            if (row.type === 'income') {
              totals.totalIncome = parseFloat(row.sum)
            } else if (row.type === 'expense') {
              totals.totalExpenses = parseFloat(row.sum)
            }
          })
    
          return totals
        } catch (error) {
          console.error('Error in getStatsForExpense:', error)
          throw error
        }
      },

  delete: async (id) => {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      throw userError
    }

    if (!user) {
      throw new Error('User not authenticated')
    }

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      throw error
    }
  }
}

export default transactionService 