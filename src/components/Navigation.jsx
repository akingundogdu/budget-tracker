import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import {
  HomeIcon,
  CurrencyDollarIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

function Navigation() {
  const { t } = useLanguage()
  
  const navItems = [
    { path: '/dashboard', icon: HomeIcon, label: t('navigation.dashboard') },
    { path: '/expense', icon: CurrencyDollarIcon, label: t('navigation.expenses') },
    { path: '/profile', icon: UserCircleIcon, label: t('navigation.profile') }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1e2b4a] border-t border-[#243351] md:relative md:border-t-0 md:border-r md:w-64 md:h-screen">
      <div className="flex justify-around md:flex-col md:justify-start md:p-4 md:space-y-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${isActive
                ? 'text-primary bg-[#243351]'
                : 'text-white/60 hover:bg-[#243351] hover:text-white'
              }
              md:w-full`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    color: isActive ? 'currentColor' : 'currentColor'
                  }}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
                <span className="hidden md:block">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default Navigation 