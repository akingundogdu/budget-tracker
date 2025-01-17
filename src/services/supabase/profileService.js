import { supabase } from '../../config/supabase'

class ProfileService {
  async updatePreferredLanguage(language) {
    const { data, error } = await supabase.auth.updateUser({
      data: { preferred_language: language }
    })

    if (error) throw error
    return data.user
  }

  async getProfile() {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) throw error
    return user
  }
}

export default new ProfileService() 