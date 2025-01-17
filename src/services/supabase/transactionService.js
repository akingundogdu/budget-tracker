import { supabase } from '../../config/supabase';

class TransactionService {
  async getAll(filters = {}) {
    const {
      startDate,
      endDate,
      category,
      type,
      searchQuery,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = filters;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range((page - 1) * limit, page * limit - 1);

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (type) {
      query = query.eq('type', type);
    }
    if (searchQuery) {
      query = query.ilike('category', `%${searchQuery}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async getById(id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(transaction) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        ...transaction,
        is_regular: transaction.is_regular || false,
        user_id: user.id
      }])
      .select();

    if (error) throw error;
    return data[0];
  }

  async update(id, transaction) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id)
      .eq('user_id', user.id)
      .select();

    if (error) throw error;
    return data[0];
  }

  async delete(id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  }

  async getStats(filters = {}) {
    const { startDate, endDate, category } = filters;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id);

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }
    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;

    const expenses = data.filter(t => t.type === 'expense');
    const regularExpenses = expenses.filter(t => t.is_regular);

    // Group regular expenses by period
    const regularExpensesByPeriod = regularExpenses.reduce((acc, t) => {
      const period = t.regular_period || 'monthly'; // Default to monthly for backward compatibility
      if (!acc[period]) {
        acc[period] = 0;
      }
      acc[period] += t.amount;
      return acc;
    }, {});

    // Group by category
    const byCategory = Object.values(data.reduce((acc, t) => {
      const key = t.category;
      if (!acc[key]) {
        acc[key] = {
          category: t.category,
          amount: 0,
          count: 0
        };
      }
      acc[key].amount += t.amount;
      acc[key].count += 1;
      return acc;
    }, {}));

    return {
      totalIncome: data.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
      totalExpenses: expenses.reduce((sum, t) => sum + t.amount, 0),
      regularExpenses: regularExpenses.reduce((sum, t) => sum + t.amount, 0),
      regularExpensesByPeriod,
      byCategory
    };
  }
}

export default new TransactionService(); 