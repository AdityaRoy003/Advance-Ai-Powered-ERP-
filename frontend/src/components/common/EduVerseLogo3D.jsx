import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * EduVerseLogo3D - Advance Interactive 3D Web Logo
 * 
 * Features:
 * - 3D dual-axis gyroscopic orbital rings with glowing quantum particle
 * - Isometric 3D mortarboard & neural AI core with levitation dynamics
 * - Realistic glassmorphism with specular light sweep & ambient bloom
 * - Mouse gyro-tilt interaction in 3D space
 * - High-performance hardware acceleration
 */
export default function EduVerseLogo3D({
  size = 'md',
  showText = true,
  showTagline = false,
  interactive = true,
  className = ''
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  // Size preset mappings
  const sizeMap = {
    sm: { orb: 28, text: 'text-sm', badge: 'text-[8px]', gap: 'gap-2' },
    md: { orb: 38, text: 'text-base sm:text-lg', badge: 'text-[9px]', gap: 'gap-2.5' },
    lg: { orb: 52, text: 'text-xl sm:text-2xl', badge: 'text-[10px]', gap: 'gap-3.5' },
    xl: { orb: 72, text: 'text-3xl sm:text-4xl', badge: 'text-xs', gap: 'gap-4' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const handleMouseMove = (e) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Map to subtle tilt degrees (-15deg to +15deg)
    setTilt({
      x: -(y / (rect.height / 2)) * 14,
      y: (x / (rect.width / 2)) * 14
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`inline-flex items-center select-none group cursor-pointer ${currentSize.gap} ${className}`}
      style={{ perspective: '800px' }}
      role="img"
      aria-label="EduVerse 3D AI Logo"
    >
      {/* ─── 3D Orb & Gyroscopic Rings Container ─── */}
      <motion.div
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale: isHovered ? 1.08 : 1
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        style={{
          width: currentSize.orb,
          height: currentSize.orb,
          transformStyle: 'preserve-3d'
        }}
        className="relative shrink-0 flex items-center justify-center"
      >
        {/* 1. Ambient Background Glow Halo */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/40 via-indigo-600/30 to-fuchsia-500/40 blur-[8px] opacity-75 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* 2. Gyroscopic Orbital Ring 1 (Rotates Clockwise) */}
        <div 
          className="absolute inset-[-4px] rounded-full border border-cyan-400/60 border-dashed pointer-events-none animate-[spin_6s_linear_infinite]"
          style={{ transform: 'rotateX(65deg) rotateY(15deg)' }}
        >
          {/* Orbiting Quantum Electron Node */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#22d3ee]" />
        </div>

        {/* 3. Gyroscopic Orbital Ring 2 (Counter-Clockwise Cross Axis) */}
        <div 
          className="absolute inset-[-3px] rounded-full border border-purple-400/50 border-dotted pointer-events-none animate-[spin_8s_linear_infinite_reverse]"
          style={{ transform: 'rotateY(65deg) rotateX(25deg)' }}
        >
          {/* Orbiting Magenta Node */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_6px_#d946ef]" />
        </div>

        {/* 4. Deep 3D Glass Sphere Body */}
        <div className="relative w-full h-full rounded-full p-[1.5px] bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.4)]">
          <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center relative bg-gradient-to-br from-[#0e162e] via-[#090e1c] to-[#04060d] backdrop-blur-md">
            
            {/* Specular Light Crescent Top */}
            <div className="absolute -top-1 inset-x-1 h-[45%] rounded-full bg-gradient-to-b from-white/50 via-white/10 to-transparent pointer-events-none opacity-85" />
            
            {/* Violet Caustic Bottom Reflection */}
            <div className="absolute -bottom-1.5 inset-x-2 h-2.5 rounded-full bg-indigo-500/40 blur-[2px] pointer-events-none" />

            {/* 5. 3D Isometric Mortarboard & Neural Nexus Emblem */}
            <svg
              viewBox="0 0 24 24"
              className="w-[62%] h-[62%] relative z-10 transition-transform duration-300 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <defs>
                <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#38bdf8" />
                  <stop offset="50%" stop-color="#6366f1" />
                  <stop offset="100%" stop-color="#a855f7" />
                </linearGradient>
              </defs>

              {/* 3D Mortarboard Rhombus Top */}
              <polygon points="12,4 21,8.5 12,13 3,8.5" fill="url(#capGrad)" stroke="#38bdf8" strokeWidth="0.8" />
              
              {/* 3D Mortarboard Lower Edge */}
              <path d="M3,8.5 L12,13 L21,8.5 L12,14 Z" fill="#1e1b4b" opacity="0.8" />
              
              {/* Cap Skull Rim */}
              <path d="M6,10.5 C6,15.5 18,15.5 18,10.5" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
              
              {/* Graduation Tassel with Red Node */}
              <path d="M12,8.5 L4.5,10.5 L4,15" stroke="#f43f5e" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="4" cy="15.5" r="1.2" fill="#f43f5e" />

              {/* Glowing Center Core */}
              <circle cx="12" cy="8.5" r="1.5" fill="#ffffff" className="animate-pulse" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* ─── Typography Branding ─── */}
      {showText && (
        <div className="flex flex-col text-left min-w-0">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-black tracking-tight ${currentSize.text} bg-gradient-to-r from-white via-indigo-100 to-cyan-200 dark:from-white dark:via-slate-100 dark:to-cyan-200 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-indigo-300 transition-all duration-300`}>
              EduVerse
            </span>
            <span className={`font-black ${currentSize.text} bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent`}>
              AI
            </span>
            <span className={`px-1.5 py-0.5 rounded-md font-mono font-bold uppercase bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 ${currentSize.badge}`}>
              ERP
            </span>
          </div>

          {showTagline && (
            <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5 truncate">
              Autonomous Higher Education Governance
            </span>
          )}
        </div>
      )}
    </div>
  );
}
