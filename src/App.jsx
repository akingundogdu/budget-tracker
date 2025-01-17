import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import Dashboard from './components/Dashboard'
import Expense from './components/Expense'
import Profile from './components/Profile'
import LanguageSettings from './components/LanguageSettings'
import Navigation from './components/Navigation'
import AddTransactionPage from './pages/AddTransactionPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import { registerPWA, requestNotificationPermission } from './registerSW'
import { useAuth, AuthProvider } from './hooks/useAuth.jsx'
import { useLanguage } from './contexts/LanguageContext'
import Notifier from './components/Notifier'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-xl font-semibold text-gray-600">{t('common.loading')}</div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function AnimatedRoutes() {
  const location = useLocation()
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/forgot-password" element={!user ? <ForgotPasswordPage /> : <Navigate to="/dashboard" replace />} />

      {/* Protected Routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard key="dashboard" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expense"
        element={
          <ProtectedRoute>
            <Expense key="expense" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile key="profile" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/language"
        element={
          <ProtectedRoute>
            <LanguageSettings key="language" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-transaction/:type"
        element={
          <ProtectedRoute>
            <AddTransactionPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  useEffect(() => {
    // Initialize PWA
    registerPWA()
    
    // Request notification permission
    const initNotifications = async () => {
      const hasPermission = await requestNotificationPermission()
      if (hasPermission) {
        console.log('Notification permission granted')
      }
    }
    
    initNotifications()
  }, [])

  return (
    <>
      <Notifier />
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <div className="min-h-screen bg-[#0f172a] md:flex">
              <Navigation />
              <main className="flex-1 p-4 pb-24 md:p-6 md:pb-6">
                <AnimatedRoutes />
              </main>
            </div>
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </>
  )
}

export default App
