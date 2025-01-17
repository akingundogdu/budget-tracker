import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../hooks/useAuth'
import {
  ArrowLeftIcon,
  UserCircleIcon,
  BellIcon,
  GlobeAltIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  KeyIcon,
  UserIcon,
  AtSymbolIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { notify } from './Notifier'
import { feedbackService } from '../services/supabase/feedbackService'

const MenuItem = ({ icon: Icon, title, subtitle, onClick, showBadge, disabled, comingSoon, t, isLogout, isWarning }) => (
  <motion.button
    whileTap={{ scale: disabled ? 1 : 0.98 }}
    onClick={disabled ? undefined : onClick}
    className={`w-full ${isLogout ? 'bg-red-900/50 hover:bg-red-900/70' : isWarning ? 'bg-amber-900/50 hover:bg-amber-900/70' : 'bg-[#1e2b4a] hover:bg-[#243351]'} p-4 rounded-xl flex items-center ${
      disabled ? 'opacity-60 cursor-not-allowed' : ''
    } transition-colors`}
  >
    <div className={`p-2 rounded-xl ${isLogout ? 'bg-red-800' : isWarning ? 'bg-amber-800' : 'bg-[#243351]'} mr-4`}>
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

const UpdateModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#1e2b4a] rounded-xl p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
        {children}
      </motion.div>
    </motion.div>
  );
};

const UpdateForm = ({ onSubmit, fields, loading, error, buttonText }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    {error && (
      <div className="rounded-md bg-red-500/10 p-4">
        <div className="text-sm text-red-500">{error}</div>
      </div>
    )}
    {fields.map((field, index) => (
      <div key={index}>
        <label htmlFor={field.id} className="block text-sm font-medium text-white mb-1">
          {field.label}
        </label>
        {field.type === 'textarea' ? (
          <textarea
            id={field.id}
            value={field.value}
            onChange={field.onChange}
            required={field.required}
            className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-[#243351] border border-[#2d3c5d] placeholder-gray-400 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 text-base min-h-[150px] resize-y"
            placeholder={field.placeholder}
          />
        ) : (
          <input
            id={field.id}
            type={field.type}
            value={field.value}
            onChange={field.onChange}
            required={field.required}
            className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-[#243351] border border-[#2d3c5d] placeholder-gray-400 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 text-base"
            placeholder={field.placeholder}
          />
        )}
      </div>
    ))}
    <button
      type="submit"
      disabled={loading}
      className="w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-violet-500 hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors"
    >
      {loading ? 'Loading...' : buttonText}
    </button>
  </form>
);

function Profile() {
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const { signOut, user: authUser } = useAuth()
  const [user, setUser] = useState({
    full_name: authUser?.user_metadata?.full_name || '',
    username: authUser?.user_metadata?.username || '',
    email: authUser?.email || '',
    avatar: null
  })

  // Modal states
  const [showNameModal, setShowNameModal] = useState(false)
  const [showUsernameModal, setShowUsernameModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Form states
  const [fullName, setFullName] = useState(user.full_name)
  const [username, setUsername] = useState(user.username)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [feedbackData, setFeedbackData] = useState({
    fullName: user.full_name || '',
    email: user.email || '',
    message: ''
  })

  const handleUpdateName = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      })

      if (error) throw error
      setUser(prev => ({ ...prev, full_name: fullName }))
      setShowNameModal(false)
      notify.success(t('profile.notifications.nameUpdated'))
    } catch (error) {
      setError(error.message)
      notify.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUsername = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({
        data: { username }
      })

      if (error) throw error
      setUser(prev => ({ ...prev, username }))
      setShowUsernameModal(false)
      notify.success(t('profile.notifications.usernameUpdated'))
    } catch (error) {
      setError(error.message)
      notify.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError(t('common.auth.validation.passwordMatch'))
      notify.error(t('common.auth.validation.passwordMatch'))
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) throw error
      setShowPasswordModal(false)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      notify.success(t('profile.notifications.passwordUpdated'))
    } catch (error) {
      setError(error.message)
      notify.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitFeedback = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await feedbackService.submitFeedback(feedbackData)
      setShowFeedbackModal(false)
      setFeedbackData({
        fullName: user.full_name || '',
        email: user.email || '',
        message: ''
      })
      notify.success(t('profile.notifications.feedbackSubmitted'))
    } catch (error) {
      setError(error.message)
      notify.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const menuItems = [
    {
      icon: UserIcon,
      title: t('profile.menu.fullName.title'),
      subtitle: user.full_name || t('profile.menu.fullName.setName'),
      onClick: () => setShowNameModal(true)
    },
    {
      icon: AtSymbolIcon,
      title: t('profile.menu.username.title'),
      subtitle: user.username || t('profile.menu.username.setUsername'),
      onClick: () => setShowUsernameModal(true)
    },
    {
      icon: KeyIcon,
      title: t('profile.menu.password.title'),
      subtitle: t('profile.menu.password.subtitle'),
      onClick: () => setShowPasswordModal(true),
      isWarning: true
    },
    {
      icon: GlobeAltIcon,
      title: t('profile.menu.language.title'),
      subtitle: language === 'en' ? 'English' : 'Türkçe',
      onClick: () => navigate('/language')
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: t('profile.menu.feedback.title'),
      subtitle: t('profile.menu.feedback.subtitle'),
      onClick: () => setShowFeedbackModal(true)
    },
    // Coming Soon items
    {
      icon: BellIcon,
      title: t('profile.menu.notifications.title'),
      subtitle: t('profile.menu.notifications.subtitle'),
      onClick: () => console.log('Notifications clicked'),
      disabled: true,
      comingSoon: true
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
    },
    // Logout at the very bottom
    {
      icon: ArrowRightOnRectangleIcon,
      title: t('profile.menu.logout'),
      subtitle: t('profile.menu.logoutSubtitle'),
      onClick: handleLogout,
      isLogout: true
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:relative">
        <div className="flex items-center">
        
        </div>
      </div>

      <div className="px-4 pb-28 md:pb-6 pt-20 md:pt-0">
        <div className="bg-[#1e2b4a] p-4 rounded-xl mb-6 flex items-center">
          <div className="w-16 h-16 bg-[#243351] rounded-xl flex items-center justify-center mr-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.full_name}
                className="w-full h-full rounded-xl object-cover"
              />
            ) : (
              <UserCircleIcon className="w-8 h-8 text-white/60" />
            )}
          </div>
          <div>
            <h2 className="text-white font-medium text-lg">{user.full_name || t('profile.defaultName')}</h2>
            <p className="text-white/60">{user.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <MenuItem key={index} {...item} t={t} />
          ))}
        </div>
      </div>

      {/* Update Full Name Modal */}
      <UpdateModal
        isOpen={showNameModal}
        onClose={() => setShowNameModal(false)}
        title={t('profile.menu.fullName.title')}
      >
        <UpdateForm
          onSubmit={handleUpdateName}
          fields={[
            {
              id: 'fullName',
              label: t('profile.menu.fullName.label'),
              type: 'text',
              value: fullName,
              onChange: (e) => setFullName(e.target.value),
              required: true,
              placeholder: t('profile.menu.fullName.placeholder')
            }
          ]}
          loading={loading}
          error={error}
          buttonText={t('common.save')}
        />
      </UpdateModal>

      {/* Update Username Modal */}
      <UpdateModal
        isOpen={showUsernameModal}
        onClose={() => setShowUsernameModal(false)}
        title={t('profile.menu.username.title')}
      >
        <UpdateForm
          onSubmit={handleUpdateUsername}
          fields={[
            {
              id: 'username',
              label: t('profile.menu.username.label'),
              type: 'text',
              value: username,
              onChange: (e) => setUsername(e.target.value),
              required: true,
              placeholder: t('profile.menu.username.placeholder')
            }
          ]}
          loading={loading}
          error={error}
          buttonText={t('common.save')}
        />
      </UpdateModal>

      {/* Update Password Modal */}
      <UpdateModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title={t('profile.menu.password.title')}
      >
        <UpdateForm
          onSubmit={handleUpdatePassword}
          fields={[
            {
              id: 'currentPassword',
              label: t('profile.menu.password.current'),
              type: 'password',
              value: passwordData.currentPassword,
              onChange: (e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value })),
              required: true,
              placeholder: t('profile.menu.password.currentPlaceholder')
            },
            {
              id: 'newPassword',
              label: t('profile.menu.password.new'),
              type: 'password',
              value: passwordData.newPassword,
              onChange: (e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value })),
              required: true,
              placeholder: t('profile.menu.password.newPlaceholder')
            },
            {
              id: 'confirmPassword',
              label: t('profile.menu.password.confirm'),
              type: 'password',
              value: passwordData.confirmPassword,
              onChange: (e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value })),
              required: true,
              placeholder: t('profile.menu.password.confirmPlaceholder')
            }
          ]}
          loading={loading}
          error={error}
          buttonText={t('common.save')}
        />
      </UpdateModal>

      {/* Feedback Modal */}
      <UpdateModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        title={t('profile.menu.feedback.title')}
      >
        <UpdateForm
          onSubmit={handleSubmitFeedback}
          fields={[
            {
              id: 'fullName',
              label: t('profile.menu.feedback.fullName'),
              type: 'text',
              value: feedbackData.fullName,
              onChange: (e) => setFeedbackData(prev => ({ ...prev, fullName: e.target.value })),
              required: true,
              placeholder: t('profile.menu.feedback.fullNamePlaceholder')
            },
            {
              id: 'email',
              label: t('profile.menu.feedback.email'),
              type: 'email',
              value: feedbackData.email,
              onChange: (e) => setFeedbackData(prev => ({ ...prev, email: e.target.value })),
              required: true,
              placeholder: t('profile.menu.feedback.emailPlaceholder')
            },
            {
              id: 'message',
              label: t('profile.menu.feedback.message'),
              type: 'textarea',
              value: feedbackData.message,
              onChange: (e) => setFeedbackData(prev => ({ ...prev, message: e.target.value })),
              required: true,
              placeholder: t('profile.menu.feedback.messagePlaceholder')
            }
          ]}
          loading={loading}
          error={error}
          buttonText={t('profile.menu.feedback.submit')}
        />
      </UpdateModal>
    </motion.div>
  )
}

export default Profile 