import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { HomeIcon, BanknotesIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useEffect } from 'react'

export default function Navigation() {
  const { t } = useTranslation()
  const location = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    console.log('Navigation: Route changed to:', location.pathname)
  }, [location])

  // Don't render navigation if user is not authenticated or on auth pages
  if (!user || location.pathname === '/login' || location.pathname === '/register') {
    return null
  }

  const isActive = (path) => location.pathname === path

  const navigationItems = [
    {
      path: '/dashboard',
      label: t('navigation.dashboard'),
      icon: HomeIcon
    },
    {
      path: '/expense',
      label: t('navigation.expenses'),
      icon: BanknotesIcon
    },
    {
      path: '/profile',
      label: t('navigation.profile'),
      icon: UserCircleIcon
    }
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-col gap-2 p-4 bg-[#1e2b4a] min-w-[240px]">
        {navigationItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
              isActive(path)
                ? 'bg-violet-500 text-white'
                : 'text-white/60 hover:text-white hover:bg-[#243351]'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1e2b4a] border-t border-[#2d3c5d] z-50">
        <div className="flex items-center justify-around px-4 py-3">
          {navigationItems.map(({ path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={`p-2 rounded-lg transition-colors ${
                isActive(path)
                  ? 'text-violet-500'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Icon className="w-6 h-6" />
            </NavLink>
          ))}
        </div>
      </div>
    </>
  )
} 