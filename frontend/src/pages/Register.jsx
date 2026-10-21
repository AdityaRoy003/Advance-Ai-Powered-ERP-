import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaArrowLeft, FaIdCard } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AuthFooter from '../components/layout/AuthFooter';

export default function Register() {
  const { register, loading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    const res = await register(firstName, lastName, email, password, role);
    if (res.success) {
      toast.success(`Account created as ${role}!`);
      navigate(`/dashboard/${role.toLowerCase()}`);
    } else {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between relative p-4 sm:p-6 overflow-hidden ${theme === 'dark' ? 'bg-[#090d16]' : 'bg-slate-50'}`}>
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Back button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 font-semibold text-slate-500 hover:text-indigo-600 transition z-10"
      >
        <FaArrowLeft /> Back to home
      </Link>

      <div className="my-auto w-full flex items-center justify-center py-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md my-4"
        >
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/80 backdrop-blur-md shadow-2xl flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight">Create Account</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Join the EduVerse AI ERP platform</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">First Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><FaUser /></span>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Aditya"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:border-indigo-500 focus:outline-none transition font-semibold text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Last Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><FaUser /></span>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Raj"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:border-indigo-500 focus:outline-none transition font-semibold text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><FaEnvelope /></span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institution.edu"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:border-indigo-500 focus:outline-none transition font-semibold text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Role</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><FaIdCard /></span>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:border-indigo-500 focus:outline-none transition font-semibold text-sm appearance-none"
                >
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="PARENT">Parent</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><FaLock /></span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:border-indigo-500 focus:outline-none transition font-semibold text-sm"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
            Already have an account? <Link to="/login" className="text-indigo-500 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </motion.div>
      </div>

      <AuthFooter />
    </div>
  );
}
