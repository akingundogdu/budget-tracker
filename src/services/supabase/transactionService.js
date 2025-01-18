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

  getAll: async ({ type, page = 1, limit = 10, startDate, endDate }) => {
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

  getStats: async ({ startDate, endDate } = {}) => {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      throw userError
    }

    if (!user) {
      throw new Error('User not authenticated')
    }

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