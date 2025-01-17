import { supabase } from '../../config/supabase';

class ReminderService {
  async getAll(filters = {}) {
    const { startDate, endDate } = filters;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    let query = supabase
      .from('reminders')
      .select(`
        *,
        transactions (
          id,
          amount,
          description,
          category_id,
          categories (
            name,
            color,
            icon
          )
        )
      `)
      .eq('user_id', user.id)
      .order('reminder_date');

    if (startDate) {
      query = query.gte('reminder_date', startDate);
    }
    if (endDate) {
      query = query.lte('reminder_date', endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async getById(id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('reminders')
      .select(`
        *,
        transactions (
          id,
          amount,
          description,
          category_id,
          categories (
            name,
            color,
            icon
          )
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(reminder) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('reminders')
      .insert([{
        ...reminder,
        user_id: user.id
      }])
      .select();

    if (error) throw error;
    return data[0];
  }

  async update(id, reminder) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('reminders')
      .update(reminder)
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
      .from('reminders')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  }

  async getUpcoming(days = 7) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('reminders')
      .select(`
        *,
        transactions (
          id,
          amount,
          description,
          category_id,
          categories (
            name,
            color,
            icon
          )
        )
      `)
      .eq('user_id', user.id)
      .gte('reminder_date', new Date().toISOString())
      .lte('reminder_date', new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString())
      .order('reminder_date');

    if (error) throw error;
    return data;
  }
}

export default new ReminderService(); 