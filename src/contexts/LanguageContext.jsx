import React, { createContext, useContext, useState, useEffect } from 'react'
import i18n from '../i18n'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  // Initialize language from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage')
    return savedLanguage || 'en'
  })

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