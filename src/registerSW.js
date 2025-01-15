import { registerSW } from 'virtual:pwa-register'
import { Workbox } from 'workbox-window'

if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js')

  wb.addEventListener('installed', (event) => {
    if (event.isUpdate) {
      if (confirm('New content is available! Click OK to refresh.')) {
        window.location.reload()
      }
    }
  })

  wb.register()
}

// Request notification permission
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }
  return false
}

// Show notification
export const showNotification = (title, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/pwa-192x192.png',
      ...options
    })
  }
}

// Register PWA
export const registerPWA = () => {
  const updateSW = registerSW({
    onNeedRefresh() {
      if (confirm('New content available. Reload?')) {
        updateSW()
      }
    },
    onOfflineReady() {
      console.log('App ready to work offline')
    },
  })
} 