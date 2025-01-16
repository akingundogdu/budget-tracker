import { supabase } from '../../config/supabase';

class TransactionService {
  async getAll(filters = {}) {
    const {
      startDate,
      endDate,
      categoryId,
      type,
      searchQuery,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = filters;

    let query = supabase
      .from('transactions')
      .select(`
        *,
        categories (
          id,
          name,
          color,
          icon
        )
      `)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range((page - 1) * limit, page * limit - 1);

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    if (type) {
      query = query.eq('type', type);
    }
    if (searchQuery) {
      query = query.ilike('description', `%${searchQuery}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async getById(id) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories (
          id,
          name,
          color,
          icon
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(transaction) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        ...transaction,
        user_id: (await supabase.auth.getUser()).data.user.id
      }])
      .select();

    if (error) throw error;
    return data[0];
  }

  async update(id, transaction) {
    const { data, error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  }

  async delete(id) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getStats(filters = {}) {
    const { startDate, endDate, categoryId } = filters;

    let query = supabase
      .from('transactions')
      .select(`
        type,
        amount,
        category_id,
        categories (
          name,
          color
        )
      `);

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return {
      totalIncome: data.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
      totalExpenses: data.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
      byCategory: Object.values(data.reduce((acc, t) => {
        const key = t.category_id;
        if (!acc[key]) {
          acc[key] = {
            categoryId: t.category_id,
            categoryName: t.categories?.name,
            categoryColor: t.categories?.color,
            amount: 0,
            count: 0
          };
        }
        acc[key].amount += t.amount;
        acc[key].count += 1;
        return acc;
      }, {}))
    };
  }
}

export default new TransactionService(); 