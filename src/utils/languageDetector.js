export const detectUserLanguage = () => {
  // Check if running in PWA mode
  const isPWA = window.matchMedia('(display-mode: standalone)').matches;
  
  // Get the device language if in PWA mode (works for mobile devices)
  if (isPWA) {
    const deviceLanguage = navigator.language.split('-')[0];
    return deviceLanguage === 'tr' ? 'tr' : 'en';
  }

  // Get browser language for web mode
  const browserLanguage = navigator.language || navigator.userLanguage;
  const language = browserLanguage.split('-')[0];
  console.log(language);
  console.log(browserLanguage);
  // Currently we only support 'en' and 'tr'
  return language === 'tr' ? 'tr' : 'en';
}; 