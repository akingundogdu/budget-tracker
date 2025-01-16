import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to handle Supabase errors
export const handleSupabaseError = (error) => {
  if (error.message === 'Invalid login credentials') {
    return 'E-posta veya şifre hatalı'
  }
  if (error.message.includes('Email not confirmed')) {
    return 'Lütfen e-posta adresinizi onaylayın'
  }
  return error.message
}

export { default as transactionService } from './transactionService';
export { default as categoryService } from './categoryService';
export { default as reminderService } from './reminderService';
export { default as authService } from './authService'; 