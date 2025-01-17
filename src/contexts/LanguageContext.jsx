import React, { createContext, useContext, useState, useEffect } from 'react'
import i18n from '../i18n'
import profileService from '../services/supabase/profileService'
import { useAuth } from '../hooks/useAuth'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const { user } = useAuth()
  // Initialize language from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage')
    return savedLanguage || 'en'
  })
  const [loading, setLoading] = useState(true)

  // Load language preference from user metadata when authenticated
  useEffect(() => {
    const loadLanguagePreference = async () => {
      if (user) {
        try {
          const profile = await profileService.getProfile()
          if (profile?.user_metadata?.preferred_language) {
            setLanguage(profile.user_metadata.preferred_language)
            localStorage.setItem('preferredLanguage', profile.user_metadata.preferred_language)
          }
        } catch (error) {
          console.error('Error loading language preference:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    loadLanguagePreference()
  }, [user])

  // Update i18n whenever language changes
  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language])

  const formatMoney = (amount) => {
    return new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
      style: 'currency',
      currency: language === 'tr' ? 'TRY' : 'USD',
    }).format(amount)
  }

  const t = (key) => {
    return i18n.t(key)
  }

  const value = {
    language,
    setLanguage,
    formatMoney,
    t,
    loading
  }

  if (loading) {
    return null // or a loading spinner
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 