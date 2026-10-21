import React from 'react';
import { motion } from 'framer-motion';

/**
 * EduVerseOrbLoader
 * 
 * Distinctive 3D Translucent Glass Orb with Cyan & Violet Volumetric Illumination,
 * internal floating particles, specular glass reflections, and a central education emblem.
 * Lightweight, 60fps hardware-accelerated SVG/CSS implementation (zero external 3D bundle bloat).
 * 
 * @param {'sm' | 'md' | 'lg' | 'xl'} size - Orb dimension preset ('sm': 56px, 'md': 96px, 'lg': 140px, 'xl': 180px) or numeric px.
 * @param {string} message - Primary caption beneath the orb.
 * @param {string} submessage - Secondary descriptive status caption.
 * @param {boolean} fullScreen - Renders full-screen backdrop for page/auth boots.
 * @param {boolean} showText - Whether to show title & loading indicators.
 * @param {string} className - Additional CSS classes.
 * @param {'default' | 'cyan' | 'violet'} variant - Color accent emphasis.
 */
export default function EduVerseOrbLoader({
  size = 'md',
  message = 'Loading EduVerse AI...',
  submessage = '',
  fullScreen = false,
  showText = true,
  className = '',
  variant = 'default',
  centerOrb = true
}) {
  // Resolve numeric dimensions
  const sizeMap = {
    sm: 56,
    md: 96,
    lg: 140,
    xl: 180
  };
  const dimension = typeof size === 'number' ? size : sizeMap[size] || 96;

  // Colors based on variant
  const cyanPrimary = '#06b6d4';
  const cyanBright = '#22d3ee';
  const violetPrimary = '#8b5cf6';
  const violetBright = '#a855f7';

  const loaderContent = (
    <div 
      className={`flex flex-col items-center justify-center gap-3 select-none ${className}`}
      role="status"
      aria-live="polite"
      aria-label={message || 'EduVerse AI is loading'}
    >
      {/* ─── OPTICAL COUNTER-BALANCE (Keeps 3D Orb precisely at the vertical midpoint) ─── */}
      {showText && centerOrb && (
        <div 
          className="invisible pointer-events-none select-none flex flex-col items-center gap-1.5 text-center px-4 max-w-xs sm:max-w-md"
          aria-hidden="true"
        >
          {/* Brand Name mirror */}
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs sm:text-sm tracking-widest uppercase font-mono">
              EduVerse AI
            </span>
            <span className="inline-flex h-2 w-2" />
          </div>

          {/* Primary Status Message mirror */}
          {message && (
            <p className="text-xs font-semibold tracking-tight">
              {message}
            </p>
          )}

          {/* Submessage mirror */}
          {submessage && (
            <p className="text-[11px] font-mono leading-tight">
              {submessage}
            </p>
          )}

          {/* Shimmer Bar mirror */}
          <div className="w-36 sm:w-44 h-1 mt-1 border border-transparent" />
        </div>
      )}

      {/* ─── 3D GLASS ORB CONTAINER ─── */}
      <div 
        className="relative flex items-center justify-center shrink-0"
        style={{ width: dimension, height: dimension }}
      >
        {/* Outer Volumetric Halo Glow */}
        <div 
          className="absolute inset-0 rounded-full blur-xl opacity-60 animate-pulse pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${cyanBright}40 0%, ${violetPrimary}35 50%, transparent 75%)`,
            transform: 'scale(1.25)'
          }}
        />

        {/* Outer 3D Gyroscopic Orbital Rings */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            perspective: 800,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Orbital Ring 1: Cyan Tilted Ellipse */}
          <div 
            className="absolute inset-0 rounded-full border border-cyan-400/30 dark:border-cyan-400/40"
            style={{
              transform: 'rotateX(70deg) rotateY(15deg)',
              animation: 'spinOrbit 8s linear infinite'
            }}
          >
            {/* Orbiting Quantum Particle 1 */}
            <div 
              className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee] absolute -top-0.5 left-1/2 -translate-x-1/2"
            />
          </div>

          {/* Orbital Ring 2: Violet Counter-Tilted Ellipse */}
          <div 
            className="absolute inset-0 rounded-full border border-purple-500/25 dark:border-purple-400/35"
            style={{
              transform: 'rotateX(65deg) rotateY(-40deg)',
              animation: 'spinOrbitReverse 11s linear infinite'
            }}
          >
            {/* Orbiting Quantum Particle 2 */}
            <div 
              className="w-1.5 h-1.5 rounded-full bg-purple-300 shadow-[0_0_8px_#c084fc] absolute -bottom-0.5 right-1/4"
            />
          </div>
        </div>

        {/* ─── MAIN 3D TRANSLUCENT GLASS SPHERE (Vector SVG) ─── */}
        <svg 
          width={dimension} 
          height={dimension} 
          viewBox="0 0 120 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 transition-transform duration-500"
          style={{
            filter: 'drop-shadow(0 10px 25px rgba(6, 182, 212, 0.25)) drop-shadow(0 15px 35px rgba(139, 92, 246, 0.2))'
          }}
        >
          <defs>
            {/* Background Radial Glow */}
            <radialGradient id="sphereCoreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="35%" stopColor={cyanBright} stopOpacity="0.35" />
              <stop offset="70%" stopColor={violetPrimary} stopOpacity="0.25" />
              <stop offset="100%" stopColor="#090d16" stopOpacity="0.7" />
            </radialGradient>

            {/* Glass Surface Specular Top Highlight */}
            <linearGradient id="specularReflection" x1="0%" y1="0%" x2="60%" y2="80%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="30%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="65%" stopColor={cyanBright} stopOpacity="0.1" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>

            {/* Rim Light Gradient */}
            <linearGradient id="rimLight" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={cyanPrimary} stopOpacity="0.7" />
              <stop offset="50%" stopColor={violetBright} stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
            </linearGradient>

            {/* Emblem Gradient */}
            <linearGradient id="emblemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#e0e7ff" />
              <stop offset="100%" stopColor={cyanBright} />
            </linearGradient>

            {/* Internal Core Plasma Glow Filter */}
            <filter id="coreGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Layer 1: Translucent Glass Sphere Base */}
          <circle 
            cx="60" 
            cy="60" 
            r="52" 
            fill="url(#sphereCoreGlow)" 
            stroke="url(#rimLight)" 
            strokeWidth="1.5"
            className="animate-[orbBreathe_4s_ease-in-out_infinite]"
          />

          {/* Layer 2: Internal Swirling Plasma Core */}
          <circle 
            cx="60" 
            cy="60" 
            r="38" 
            fill="radial-gradient(circle, rgba(6,182,212,0.4) 0%, rgba(139,92,246,0.3) 60%, transparent 100%)"
            filter="url(#coreGlowFilter)"
            opacity="0.85"
            className="animate-[pulse_3s_ease-in-out_infinite]"
          />

          {/* Layer 3: Internal Floating Particle Micro-Stars */}
          <g className="animate-[spinOrbit_16s_linear_infinite]" style={{ transformOrigin: '60px 60px' }}>
            <circle cx="48" cy="40" r="1.5" fill="#ffffff" opacity="0.8" />
            <circle cx="74" cy="46" r="1.2" fill={cyanBright} opacity="0.9" />
            <circle cx="42" cy="72" r="1.3" fill={violetBright} opacity="0.85" />
            <circle cx="70" cy="78" r="1.6" fill="#ffffff" opacity="0.75" />
            <circle cx="60" cy="32" r="1.1" fill={cyanPrimary} opacity="0.7" />
          </g>

          {/* Layer 4: Central Education-Inspired Emblem (Graduation Cap & AI Atomic Core) */}
          <g 
            className="transition-transform duration-700 hover:scale-110" 
            style={{ transformOrigin: '60px 60px' }}
          >
            {/* Core Neural Energy Node */}
            <circle 
              cx="60" 
              cy="60" 
              r="7" 
              fill={cyanBright} 
              opacity="0.3" 
              className="animate-ping" 
              style={{ animationDuration: '3s' }}
            />

            {/* Academic Cap Emblem Rhombus / Top Plate */}
            <path 
              d="M60 45 L78 52 L60 59 L42 52 Z" 
              fill="url(#emblemGradient)" 
              stroke="#ffffff" 
              strokeWidth="0.8"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))"
            />

            {/* Academic Cap Base Skullcap */}
            <path 
              d="M48 55.5 L48 64 C48 68, 72 68, 72 64 L72 55.5" 
              fill="none" 
              stroke="url(#emblemGradient)" 
              strokeWidth="1.4" 
              strokeLinecap="round"
            />

            {/* Graduation Tassel with Micro-Pearl */}
            <path 
              d="M74 53.5 L77 60 L77 66" 
              fill="none" 
              stroke={cyanBright} 
              strokeWidth="1" 
              strokeLinecap="round"
            />
            <circle cx="77" cy="66" r="1.3" fill="#ffffff" />

            {/* Central Intelligent Core Sparkle */}
            <polygon 
              points="60,50 61.5,53.5 65,55 61.5,56.5 60,60 58.5,56.5 55,55 58.5,53.5" 
              fill="#ffffff"
              opacity="0.95"
            />
          </g>

          {/* Layer 5: 3D Curved Specular Glass Reflection (Top-Left Highlight) */}
          <ellipse 
            cx="48" 
            cy="36" 
            rx="26" 
            ry="14" 
            transform="rotate(-28 48 36)" 
            fill="url(#specularReflection)"
            opacity="0.85"
            pointerEvents="none"
          />

          {/* Bottom Refractive Secondary Specular Bounce */}
          <path 
            d="M40 98 C50 104, 70 104, 80 98" 
            fill="none" 
            stroke="url(#rimLight)" 
            strokeWidth="1" 
            strokeLinecap="round" 
            opacity="0.45"
            pointerEvents="none"
          />
        </svg>
      </div>

      {/* ─── TYPOGRAPHY & LOADING STATUS ─── */}
      {showText && (
        <div className="flex flex-col items-center gap-1.5 text-center px-4 max-w-xs sm:max-w-md">
          {/* Brand Name */}
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs sm:text-sm tracking-widest uppercase font-mono bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              EduVerse AI
            </span>
            {/* Live Quantum Pulse Indicator */}
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
          </div>

          {/* Primary Status Message */}
          {message && (
            <p className="text-xs font-semibold text-slate-300 dark:text-slate-200 tracking-tight">
              {message}
            </p>
          )}

          {/* Submessage / Operation detail */}
          {submessage && (
            <p className="text-[11px] font-mono text-slate-400 dark:text-slate-400 leading-tight">
              {submessage}
            </p>
          )}

          {/* Smooth High-Tech Shimmer Bar */}
          <div className="w-36 sm:w-44 h-1 rounded-full bg-slate-800/80 dark:bg-slate-800 overflow-hidden relative mt-1 border border-slate-700/50">
            <div 
              className="absolute top-0 bottom-0 rounded-full w-1/2 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500"
              style={{
                animation: 'orbShimmer 1.8s ease-in-out infinite'
              }}
            />
          </div>
        </div>
      )}

      {/* Hidden Accessible Status for Screen Readers */}
      <span className="sr-only">
        {message} {submessage}
      </span>
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#090d16]/95 dark:bg-[#070a12]/95 backdrop-blur-xl transition-all duration-300"
        role="alert"
        aria-busy="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {loaderContent}
        </motion.div>
      </div>
    );
  }

  return loaderContent;
}
