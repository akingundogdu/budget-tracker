import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import LoginSvg from '../assets/login-page-svg.jsx';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center bg-[#0f172a] px-4 sm:px-6 lg:px-8"
    >
      {/* Top Illustration */}
      <div className="w-full max-w-md lg:max-w-lg mt-8 lg:mt-12">
        <LoginSvg className="w-full h-auto" />
      </div>

      {/* Form */}
      <div className="w-full max-w-md space-y-8 mt-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            {t('common.auth.forgotPassword.title')}
          </h2>
          <p className="mt-2 text-center text-base text-gray-400">
            {t('common.auth.forgotPassword.description')}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-500/10 p-4">
              <div className="text-sm text-red-500">{error}</div>
            </div>
          )}
          {success && (
            <div className="rounded-md bg-green-500/10 p-4">
              <div className="text-sm text-green-500">
                {t('common.auth.forgotPassword.success')}
              </div>
            </div>
          )}
          <div>
            <label htmlFor="email" className="sr-only">
              {t('common.auth.login.email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-[#1e2b4a] border border-[#2d3c5d] placeholder-gray-400 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 text-base"
              placeholder={t('common.auth.login.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-violet-500 hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors"
            >
              {loading
                ? t('common.loading')
                : t('common.auth.forgotPassword.submit')}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link
              to="/login"
              className="font-medium text-violet-500 hover:text-violet-400 transition-colors"
            >
              {t('common.auth.forgotPassword.backToLogin')}
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
} 