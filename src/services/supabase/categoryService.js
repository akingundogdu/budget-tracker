import { supabase } from '../../config/supabase';

class CategoryService {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }

  async getById(id) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(category) {
    const { data, error } = await supabase
      .from('categories')
      .insert([{
        ...category,
        user_id: (await supabase.auth.getUser()).data.user.id
      }])
      .select();

    if (error) throw error;
    return data[0];
  }

  async update(id, category) {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  }

  async delete(id) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getWithTransactionCounts() {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        transactions (
          count
        )
      `);

    if (error) throw error;
    return data.map(category => ({
      ...category,
      transactionCount: category.transactions[0]?.count || 0
    }));
  }
}

export default new CategoryService(); 