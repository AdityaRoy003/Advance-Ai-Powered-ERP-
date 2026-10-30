import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-hot-toast';
import { FaEnvelope, FaArrowLeft, FaKey, FaLock, FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { AuthAPI } from '../services/api';
import AuthFooter from '../components/layout/AuthFooter';

export default function ForgotPassword() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1 = Request OTP, 2 = Verify OTP & Set Password
  const [loading, setLoading] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState('');

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your registered email address');
      return;
    }

    setLoading(true);
    try {
      const res = await AuthAPI.forgotPassword(email);
      if (res?.data?.otp && res.data.otp !== '000000') {
        setDevOtpHint(res.data.otp);
        toast.success(`OTP code sent! (Dev Hint: ${res.data.otp})`, { duration: 6000 });
      } else {
        toast.success('OTP verification code sent to your email!');
      }
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to request password reset OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      toast.error('Please enter the 6-digit OTP and your new password');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await AuthAPI.resetPassword({ email, otp, newPassword });
      toast.success('Password reset successfully! You can now log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid or expired OTP code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between relative p-4 sm:p-6 overflow-hidden ${theme === 'dark' ? 'bg-[#090d16]' : 'bg-slate-50'}`}>
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[80px] pointer-events-none" />

      <Link 
        to="/login" 
        className="absolute top-6 left-6 flex items-center gap-2 font-semibold text-slate-500 hover:text-indigo-600 transition text-sm z-10"
      >
        <FaArrowLeft /> Back to login
      </Link>

      <div className="my-auto w-full flex items-center justify-center py-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/80 backdrop-blur-md shadow-2xl flex flex-col gap-6">
          <div className="text-center flex flex-col items-center">
            <div className="bg-indigo-600/20 p-4 rounded-full text-indigo-400 mb-4 animate-pulse">
              <FaKey className="text-2xl" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Reset Password</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
              {step === 1 ? 'Enter your email to receive a 6-digit verification OTP' : 'Enter the 6-digit OTP code and choose your new password'}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Registered Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><FaEnvelope /></span>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@institution.edu"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:border-indigo-500 focus:outline-none transition font-semibold text-xs"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 transition text-xs flex items-center justify-center gap-2"
              >
                {loading ? 'Sending OTP Code...' : 'Send OTP Verification Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              {devOtpHint && (
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xxs font-mono text-indigo-400 text-center">
                  🔐 Development OTP Hint: <strong>{devOtpHint}</strong>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">6-Digit OTP Code</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><FaShieldAlt /></span>
                  <input 
                    type="text" 
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="e.g. 849201"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:border-indigo-500 focus:outline-none transition font-mono font-bold text-xs tracking-widest"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">New Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><FaLock /></span>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:border-indigo-500 focus:outline-none transition font-semibold text-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition focus:outline-none cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 transition text-xs"
              >
                {loading ? 'Resetting Password...' : 'Verify OTP & Set New Password'}
              </button>

              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="text-xxs text-slate-400 hover:text-indigo-400 font-semibold text-center mt-1"
              >
                ← Request a new OTP code
              </button>
            </form>
          )}

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Remember your credentials? <Link to="/login" className="text-indigo-500 font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </motion.div>
      </div>

      <AuthFooter />
    </div>
  );
}
