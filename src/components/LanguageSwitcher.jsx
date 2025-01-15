import { useLanguage } from '../contexts/LanguageContext'

function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 px-4 py-2 bg-[#1e2b4a] text-white rounded-xl hover:bg-[#243351] transition-colors"
    >
      {language === 'en' ? '🇹🇷 TR' : '🇬🇧 EN'}
    </button>
  )
}

export default LanguageSwitcher 