import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useLanguage } from '../contexts/LanguageContext';
import LoginSvg from '../assets/login-page-svg.jsx';
import { motion } from 'framer-motion';
import i18n from '../i18n';
import { notify } from '../components/Notifier';

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    preferred_language: language // Default to current language
  });

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleLanguage = () => {
    const newLanguage = formData.preferred_language === 'en' ? 'tr' : 'en';
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      preferred_language: newLanguage
    }));

    // Update localStorage and i18n
    localStorage.setItem('preferredLanguage', newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  const validateForm = () => {
    if (!formData.email) {
      setError(t('common.auth.validation.emailRequired'));
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError(t('common.auth.validation.emailInvalid'));
      return false;
    }
    if (!formData.password) {
      setError(t('common.auth.validation.passwordRequired'));
      return false;
    }
    if (formData.password.length < 6) {
      setError(t('common.auth.validation.passwordMinLength'));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('common.auth.validation.passwordMatch'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      const { error } = await signUp(formData.email, formData.password, {
        preferred_language: formData.preferred_language
      });
      if (error) throw error;
      notify.success(t('common.auth.register.verificationEmailSent'));
      navigate('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedLanguage = languages.find(lang => lang.code === formData.preferred_language);

  useEffect(() => {
    // Disable scrolling on mount
    document.body.style.overflow = 'hidden';
    
    // Re-enable scrolling on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center bg-[#0f172a] px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Top Illustration */}
      <div className="w-full max-w-md lg:max-w-lg mt-4 lg:mt-8">
        <LoginSvg className="w-full h-auto" />
      </div>

      {/* Form */}
      <div className="w-full max-w-md space-y-6 mt-4">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            {t('common.auth.register.title')}
          </h2>
        </div>
        <form className="mt-8 space-y-6 px-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-500/10 p-4">
              <div className="text-sm text-red-500">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                {t('common.auth.register.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-t-lg relative block w-full px-4 py-3 bg-[#1e2b4a] border border-[#2d3c5d] placeholder-gray-400 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 text-base"
                placeholder={t('common.auth.register.email')}
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {t('common.auth.register.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-[#1e2b4a] border border-[#2d3c5d] placeholder-gray-400 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 text-base"
                placeholder={t('common.auth.register.password')}
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                {t('common.auth.register.confirmPassword')}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none rounded-b-lg relative block w-full px-4 py-3 bg-[#1e2b4a] border border-[#2d3c5d] placeholder-gray-400 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 text-base"
                placeholder={t('common.auth.register.confirmPassword')}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex justify-center">
            <motion.button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 bg-[#1e2b4a] rounded-xl hover:bg-[#243351] transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">{selectedLanguage.flag}</span>
              <span className="text-white font-medium">{selectedLanguage.name}</span>
            </motion.button>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-violet-500 hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors"
            >
              {loading ? t('common.loading') : t('common.auth.register.submit')}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link
              to="/login"
              className="font-medium text-violet-500 hover:text-violet-400 transition-colors"
            >
              {t('common.auth.register.hasAccount')} {t('common.auth.register.signIn')}
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
} 