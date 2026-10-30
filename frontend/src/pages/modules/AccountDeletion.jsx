import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-hot-toast';
import { UsersAPI } from '../../services/api';
import {
  FaExclamationTriangle,
  FaTrash,
  FaShieldAlt,
  FaArrowLeft,
  FaLock,
  FaUserCheck,
  FaBuilding,
  FaEnvelope,
  FaIdBadge,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

export default function AccountDeletion() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  const [confirmationText, setConfirmationText] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [reason, setReason] = useState('Graduation / Leaving institution');
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isConfirmed = confirmationText.trim().toUpperCase() === 'DELETE';

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!isConfirmed) {
      setErrorMessage("Please type 'DELETE' in uppercase to unlock permanent deletion.");
      return;
    }

    setIsDeleting(true);
    setErrorMessage('');

    try {
      await UsersAPI.deleteMyAccount({
        confirmationText: confirmationText.trim().toUpperCase(),
        password,
        reason,
        email: user?.email,
        userId: user?.id || user?._id
      });

      toast.success('Your account and all associated personal records have been permanently erased.');
      if (typeof logout === 'function') {
        await logout();
      }
      navigate('/login', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete account. Please verify your credentials.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto w-full py-4 px-2 sm:px-4 flex flex-col gap-6"
    >
      {/* ─── Top Navigation Bar ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition flex items-center gap-2 text-xs font-bold"
          >
            <FaArrowLeft /> Back
          </button>
          <div className="flex items-center gap-2 text-xxs font-mono text-slate-400">
            <Link to="/dashboard" className="hover:text-indigo-400">Dashboard</Link>
            <span>/</span>
            <Link to="/dashboard/profile" className="hover:text-indigo-400">Security & Privacy</Link>
            <span>/</span>
            <span className="text-rose-400 font-bold">Permanent Erasure</span>
          </div>
        </div>

        <Link
          to="/dashboard/profile"
          className="text-xs font-bold text-slate-400 hover:text-indigo-400 transition"
        >
          View Full Profile →
        </Link>
      </div>

      {/* ─── Hero Danger Banner ─── */}
      <div className="p-6 sm:p-8 rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-950/40 via-red-950/20 to-slate-900/90 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-red-500 to-amber-500" />
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 text-2xl shadow-lg shadow-rose-950/40">
              <FaExclamationTriangle />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Account Security & Permanent Deletion
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xxs font-mono font-bold uppercase tracking-wider">
                  Irreversible
                </span>
              </div>
              <p className="text-xs text-rose-400/90 mt-1 font-mono">
                Statutory Right to Erasure (GDPR Article 17 · India DPDP Act 2023)
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed max-w-2xl">
          Permanently delete your EduVerse ERP user account. This action immediately invalidates all active sessions, purges associated institutional academic profiles, removes student and teacher records, and cannot be undone by system administrators.
        </p>
      </div>

      {/* ─── Account Profile Snapshot Card ─── */}
      <div className="p-5 sm:p-6 rounded-2xl border border-slate-800 bg-slate-900/70 flex flex-col gap-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <FaUserCheck className="text-indigo-400" /> Authenticated Account To Be Erased
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-xxs text-slate-500 font-mono block mb-1">User Full Name</span>
            <span className="text-xs font-bold text-white block truncate">
              {user?.firstName || 'Current'} {user?.lastName || 'User'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-xxs text-slate-500 font-mono block mb-1">Primary Email</span>
            <span className="text-xs font-bold text-indigo-400 block truncate">
              {user?.email || 'student@eduverse.com'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-xxs text-slate-500 font-mono block mb-1">System Role</span>
            <span className="text-xs font-bold text-emerald-400 block truncate">
              {user?.roleName || user?.role || 'STUDENT'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-xxs text-slate-500 font-mono block mb-1">Institutional Realm</span>
            <span className="text-xs font-bold text-slate-300 block truncate">
              EduVerse Main Campus
            </span>
          </div>
        </div>
      </div>

      {/* ─── Impact & Consequences Checklist ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
          <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
            <FaShieldAlt /> Session Destruction
          </span>
          <p className="text-xxs text-slate-400 leading-relaxed">
            All active browser session cookies, refresh tokens, passkeys, and multi-factor secrets are permanently wiped.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
          <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
            <FaIdBadge /> Cascade Record Purge
          </span>
          <p className="text-xxs text-slate-400 leading-relaxed">
            Linked student enrollment records, faculty schedules, exams, and attendance logs are unlinked and permanently scrubbed.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
          <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
            <FaLock /> Audit Hashing
          </span>
          <p className="text-xxs text-slate-400 leading-relaxed">
            An anonymized cryptographic compliance entry is logged to institutional SIEM audit trails to verify lawful erasure.
          </p>
        </div>
      </div>

      {/* ─── Interactive Account Deletion Form ─── */}
      <div className="p-6 sm:p-8 rounded-3xl border border-rose-500/40 bg-slate-900/90 flex flex-col gap-6 shadow-2xl relative">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <FaTrash className="text-rose-500" /> Confirm Permanent Deletion
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Please fill in the confirmation safeguards below to execute irreversible account erasure.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
            <FaTimesCircle className="shrink-0 text-rose-400 text-base" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleDeleteAccount} className="flex flex-col gap-5">
          {/* Reason Selection */}
          <div>
            <label className="block text-xxs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Reason for Deletion (Optional)
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isDeleting}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-500 transition"
            >
              <option value="Graduation / Leaving institution">Graduation / Leaving institution</option>
              <option value="Privacy and data protection concerns">Privacy and data protection concerns</option>
              <option value="Switching to a different institutional account">Switching to a different institutional account</option>
              <option value="Temporary or test account">Temporary or test account</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xxs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Account Security Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isDeleting}
                placeholder="Enter your account password (e.g. EduVerse@2026)"
                className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <span className="text-[11px] text-slate-500 mt-1.5 block">
              Enter your current account password to authenticate ownership.
            </span>
          </div>

          {/* Typing Safeguard */}
          <div>
            <label className="block text-xxs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Confirmation Safeguard
            </label>
            <p className="text-xs text-slate-400 mb-2.5">
              To confirm this permanent action, type <strong className="text-rose-400 font-mono font-bold tracking-widest bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">DELETE</strong> in the box below:
            </p>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              disabled={isDeleting}
              placeholder="Type DELETE"
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-rose-400 placeholder-slate-600 focus:outline-none focus:border-rose-500 transition font-mono font-bold tracking-widest"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800 mt-2">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              disabled={isDeleting}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer disabled:opacity-50 text-center"
            >
              Cancel & Keep My Account
            </button>

            <button
              type="submit"
              disabled={!isConfirmed || isDeleting}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
            >
              {isDeleting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Purging Account Records...</span>
                </>
              ) : (
                <>
                  <FaTrash />
                  <span>Permanently Delete My Account</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

