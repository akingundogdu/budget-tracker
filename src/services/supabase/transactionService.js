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

  getAll: async ({ type, page = 1, limit = 10 }) => {
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

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', type)
      .order('date', { ascending: false })
      .range(start, end)

    if (error) {
      throw error
    }

    return data
  },

  getStats: async () => {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      throw userError
    }

    if (!user) {
      throw new Error('User not authenticated')
    }

    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    // Get regular transactions for this month
    const { data: regularTransactions, error: regularError } = await supabase
      .from('transactions')
      .select('amount, type')
      .eq('user_id', user.id)
      .eq('is_regular', true)
      .gte('recurring_start_date', firstDayOfMonth.toISOString())
      .lte('recurring_end_date', lastDayOfMonth.toISOString())

    // Get non-regular transactions for this month
    const { data: nonRegularTransactions, error: nonRegularError } = await supabase
      .from('transactions')
      .select('amount, type')
      .eq('user_id', user.id)
      .eq('is_regular', false)
      .gte('date', firstDayOfMonth.toISOString())
      .lte('date', lastDayOfMonth.toISOString())

    if (regularError || nonRegularError) {
      throw regularError || nonRegularError
    }

    const allTransactions = [...(regularTransactions || []), ...(nonRegularTransactions || [])]

    const totalIncome = allTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = allTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      totalIncome,
      totalExpenses
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