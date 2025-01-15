import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import {
  ArrowLeftIcon,
  UserCircleIcon,
  BellIcon,
  GlobeAltIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

const MenuItem = ({ icon: Icon, title, subtitle, onClick, showBadge, disabled, comingSoon, t }) => (
  <motion.button
    whileTap={{ scale: disabled ? 1 : 0.98 }}
    onClick={disabled ? undefined : onClick}
    className={`w-full bg-[#1e2b4a] p-4 rounded-xl flex items-center ${
      disabled ? 'opacity-60 cursor-not-allowed' : ''
    }`}
  >
    <div className="p-2 rounded-xl bg-[#243351] mr-4">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="flex-1 text-left">
      <h3 className="text-white font-medium">{title}</h3>
      {subtitle && <p className="text-white/60 text-sm mt-0.5">{subtitle}</p>}
    </div>
    {showBadge && (
      <span className="px-2 py-1 bg-primary text-white text-xs rounded-full mr-2">
        {t('common.new')}
      </span>
    )}
    {comingSoon && (
      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded-full mr-2">
        {t('common.comingSoon')}
      </span>
    )}
    <ChevronRightIcon className="w-5 h-5 text-white/60" />
  </motion.button>
)

function Profile() {
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const [user] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null
  })

  const menuItems = [
    {
      icon: BellIcon,
      title: t('profile.menu.notifications.title'),
      subtitle: t('profile.menu.notifications.subtitle'),
      onClick: () => console.log('Notifications clicked'),
      disabled: true,
      comingSoon: true
    },
    {
      icon: GlobeAltIcon,
      title: t('profile.menu.language.title'),
      subtitle: language === 'en' ? 'English' : 'Türkçe',
      onClick: () => navigate('/language')
    },
    {
      icon: CreditCardIcon,
      title: t('profile.menu.paymentMethods.title'),
      subtitle: t('profile.menu.paymentMethods.subtitle'),
      onClick: () => console.log('Payment Methods clicked'),
      disabled: true,
      comingSoon: true
    },
    {
      icon: EnvelopeIcon,
      title: t('profile.menu.emailPreferences.title'),
      subtitle: t('profile.menu.emailPreferences.subtitle'),
      onClick: () => console.log('Email Preferences clicked'),
      disabled: true,
      comingSoon: true
    },
    {
      icon: Cog6ToothIcon,
      title: t('profile.menu.settings.title'),
      subtitle: t('profile.menu.settings.subtitle'),
      onClick: () => console.log('Settings clicked'),
      disabled: true,
      comingSoon: true
    }
  ]

  return (
    <div className="px-4 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-[#1e293b] text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-semibold text-white">{t('profile.title')}</h1>
      </div>

      <div className="bg-[#1e2b4a] p-4 rounded-xl mb-6 flex items-center">
        <div className="w-16 h-16 bg-[#243351] rounded-xl flex items-center justify-center mr-4">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full rounded-xl object-cover"
            />
          ) : (
            <UserCircleIcon className="w-8 h-8 text-white/60" />
          )}
        </div>
        <div>
          <h2 className="text-white font-medium text-lg">{user.name}</h2>
          <p className="text-white/60">{user.email}</p>
        </div>
      </div>

      <div className="space-y-3">
        {menuItems.map((item, index) => (
          <MenuItem key={index} {...item} t={t} />
        ))}
      </div>
    </div>
  )
}

export default Profile 