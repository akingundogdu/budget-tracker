import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import profileService from '../services/supabase/profileService'
import { notify } from './Notifier'

function LanguageSettings() {
  const { language, setLanguage, t } = useLanguage()
  const [selectedLanguage, setSelectedLanguage] = useState(language)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
  ]

  useEffect(() => {
    // Update selected language when context language changes
    setSelectedLanguage(language)
  }, [language])

  const handleLanguageSelect = (langCode) => {
    setSelectedLanguage(langCode)
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      // Save to localStorage to persist the language preference
      localStorage.setItem('preferredLanguage', selectedLanguage)
      
      // Save to database
      await profileService.updatePreferredLanguage(selectedLanguage)
      
      // Update context
      setLanguage(selectedLanguage)
      
      navigate(-1)
    } catch (error) {
      console.error('Error saving language preference:', error)
      notify.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-[#1e293b] text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-semibold text-white">{t('profile.menu.language.title')}</h1>
      </div>

      {/* Language Options */}
      <div className="space-y-4">
        {languages.map((lang) => (
          <motion.button
            key={lang.code}
            onClick={() => handleLanguageSelect(lang.code)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl ${
              selectedLanguage === lang.code ? 'bg-violet-500' : 'bg-[#1e293b]'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{lang.flag}</span>
              <span className="text-white font-medium">{lang.name}</span>
            </div>
            {selectedLanguage === lang.code && (
              <div className="w-3 h-3 rounded-full bg-white" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Save Button */}
      <motion.button
        onClick={handleSave}
        className={`fixed bottom-24 left-4 right-4 py-4 rounded-2xl font-medium ${
          selectedLanguage !== language
            ? 'bg-violet-500 text-white'
            : 'bg-[#1e293b] text-white/60'
        }`}
        whileTap={{ scale: 0.98 }}
        disabled={selectedLanguage === language || loading}
      >
        {loading ? t('common.saving') : t('common.save')}
      </motion.button>
    </div>
  )
}

export default LanguageSettings 