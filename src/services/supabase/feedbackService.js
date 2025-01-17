import { supabase } from './index'

export const feedbackService = {
  async submitFeedback({ fullName, email, message }) {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('feedback')
      .insert([
        {
          user_id: user.id,
          full_name: fullName,
          email: email,
          message: message
        }
      ])
      .select()

    if (error) throw error
    return data
  },

  async getUserFeedback() {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
} 