import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import LoginSvg from '../assets/login-page-svg.jsx';
import { motion } from 'framer-motion';
import { supabase } from '../config/supabase';
import i18n from '../i18n';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data: signInData, error: signInError } = await signIn(formData.email, formData.password);
      if (signInError) throw signInError;

      // Get user metadata
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      // Check if this is the first login (no language preference in metadata)
      if (!user?.user_metadata?.preferred_language) {
        // Get language preference from localStorage (saved during registration)
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage) {
          // Update user metadata with saved language preference
          const { error: metadataError } = await supabase.auth.updateUser({
            data: { preferred_language: savedLanguage }
          });
          if (metadataError) throw metadataError;
        }
      }

      // Set language from metadata or localStorage
      const preferredLanguage = user?.user_metadata?.preferred_language || localStorage.getItem('preferredLanguage');
      if (preferredLanguage) {
        localStorage.setItem('preferredLanguage', preferredLanguage);
        i18n.changeLanguage(preferredLanguage);
      }

      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
            {t('common.auth.login.title')}
          </h2>
        </div>
        <form className="space-y-4 px-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-500/10 p-4">
              <div className="text-sm text-red-500">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                {t('common.auth.login.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-t-lg relative block w-full px-4 py-2.5 bg-[#1e2b4a] border border-[#2d3c5d] placeholder-gray-400 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 text-base"
                placeholder={t('common.auth.login.email')}
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {t('common.auth.login.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-b-lg relative block w-full px-4 py-2.5 bg-[#1e2b4a] border border-[#2d3c5d] placeholder-gray-400 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 text-base"
                placeholder={t('common.auth.login.password')}
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-violet-500 hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors"
          >
            {loading ? t('common.loading') : t('common.auth.login.submit')}
          </button>

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-violet-500 hover:text-violet-400 transition-colors"
              >
                {t('common.auth.login.forgotPassword')}
              </Link>
            </div>
            <div className="text-sm">
              <Link
                to="/register"
                className="font-medium text-violet-500 hover:text-violet-400 transition-colors"
              >
                {t('common.auth.login.signUp')}
              </Link>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
} 