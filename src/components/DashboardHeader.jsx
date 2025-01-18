import React, { useState, useEffect } from 'react'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { useLanguage } from '../contexts/LanguageContext'
import { budgetService } from '../services'

function DashboardHeader({ onRefresh }) {
  const { t } = useLanguage()
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const preferences = await budgetService.getUserPreferences()
        const name = preferences?.full_name?.trim() ? preferences.full_name.trim().split(' ')[0] : t('common.user')
        setUserName(name)
      } catch (error) {
        console.error('Error loading user data:', error)
        setUserName(t('common.user'))
      }
    }

    loadUserData()
  }, [])

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold text-white">{t('dashboard.welcome')} {userName}</h1>
        <button 
          onClick={onRefresh}
          className="p-2 rounded-xl bg-[#1e293b] text-white/60 hover:text-white transition-colors"
        >
          <ArrowPathIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default DashboardHeader 