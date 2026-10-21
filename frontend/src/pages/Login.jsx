import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-hot-toast';
import { FaEnvelope, FaLock, FaRobot, FaArrowLeft, FaEye, FaEyeSlash, FaCopy, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AuthFooter from '../components/layout/AuthFooter';

export default function Login() {
  const { login, loading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      toast.success(`Welcome, ${res.user.firstName} ${res.user.lastName}!`);
      navigate(`/dashboard/${res.user.role.toLowerCase()}`);
    } else {
      toast.error(res.error || 'Invalid credentials. Please verify your email and password.');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between relative p-4 sm:p-6 overflow-hidden ${theme === 'dark' ? 'bg-[#090d16]' : 'bg-slate-50'}`}>
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[80px] pointer-events-none" />

      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-400 transition z-10">
        <FaArrowLeft /> Back to home
      </Link>

      <div className="my-auto w-full flex items-center justify-center py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
        {/* Login card */}
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/80 backdrop-blur-md shadow-2xl flex flex-col gap-6">
          <div className="text-center flex flex-col items-center">
            <div className="bg-indigo-600 p-3.5 rounded-2xl shadow-xl shadow-indigo-600/35 mb-4 text-white">
              <FaRobot className="text-2xl" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sign in to your EduVerse ERP account</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><FaEnvelope /></span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@eduverse.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-indigo-500/40 focus:border-indigo-500 focus:outline-none transition font-semibold text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Password</label>
                <Link to="/forgot-password" className="text-xs text-indigo-500 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><FaLock /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-indigo-500/40 focus:border-indigo-500 focus:outline-none transition font-semibold text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 transition disabled:opacity-50 mt-1"
            >
              {loading ? 'Verifying session...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account? <Link to="/register" className="text-indigo-500 font-bold hover:underline">Create one</Link>
          </p>
        </div>
      </motion.div>
      </div>

      <AuthFooter />
    </div>
  );
}
