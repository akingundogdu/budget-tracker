import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import Dashboard from './components/Dashboard'
import Expense from './components/Expense'
import Profile from './components/Profile'
import LanguageSettings from './components/LanguageSettings'
import Navigation from './components/Navigation'
import AddTransactionPage from './pages/AddTransactionPage'
import { registerPWA, requestNotificationPermission } from './registerSW'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/expense" element={<Expense />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/language" element={<LanguageSettings />} />
        <Route path="/add-transaction/:type" element={<AddTransactionPage />} />
      </Routes>
    </AnimatePresence>
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
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-[#0f172a] md:flex">
          <Navigation />
          <main className="flex-1 p-4 md:p-6">
            <AnimatedRoutes />
          </main>
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App
