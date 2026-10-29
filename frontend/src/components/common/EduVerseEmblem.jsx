import React from 'react';

/**
 * EduVerseEmblem - Lightweight 3D Glass Orb Emblem
 * 
 * Features:
 * - Multi-layered translucent glass orb with cyan, electric blue, and violet highlights
 * - Crisp internal 3D isometric education node glyph
 * - Restrained ambient glow & specular highlights
 * - GPU-accelerated gentle floating animation with prefers-reduced-motion fallback
 * - Zero heavy dependencies (Pure CSS + SVG)
 */
export default function EduVerseEmblem({ size = 28, className = '' }) {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 select-none group ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="EduVerse 3D Emblem"
    >
      {/* 1. Ambient Background Glow (Soft & Restrained) */}
      <div 
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/25 via-indigo-500/20 to-purple-500/25 blur-[5px] opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      />

      {/* 2. Glass Orb Outer Ring & Inset Rim Lighting */}
      <div 
        className="relative w-full h-full rounded-full p-[1px] bg-gradient-to-b from-cyan-300/40 via-indigo-500/20 to-purple-500/35 shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.35)]"
      >
        {/* 3. Deep Navy Orb Core */}
        <div 
          className="w-full h-full rounded-full overflow-hidden flex items-center justify-center relative bg-gradient-to-br from-[#0c1427]/95 via-[#070c18]/98 to-[#03060f] backdrop-blur-md"
        >
          {/* Top-left Specular Crescent Reflection */}
          <div 
            className="absolute -top-0.5 left-1 right-1 h-[45%] rounded-full bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none opacity-85"
          />

          {/* Bottom Violet Bounce Light */}
          <div 
            className="absolute -bottom-1 inset-x-1.5 h-2 rounded-full bg-purple-500/30 blur-[2px] pointer-events-none"
          />

          {/* 4. Education & AI Nexus Symbol (3D Geometric Mortarboard & Neural Node) */}
          <svg 
            viewBox="0 0 24 24" 
            className="w-[64%] h-[64%] relative z-10 transition-transform duration-300 motion-safe:animate-[subtleFloat_3.5s_ease-in-out_infinite_alternate]"
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.6" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            {/* Top Rhombus Cap Facet with gradient */}
            <path 
              d="M12 3.5L2.5 8.5L12 13.5L21.5 8.5L12 3.5Z" 
              stroke="url(#orbCapStroke)" 
              fill="url(#orbCapFill)" 
            />
            {/* Under Cap Volume / Lower Rim */}
            <path 
              d="M6 10.5V15.5C6 15.5 8.5 18 12 18C15.5 18 18 15.5 18 15.5V10.5" 
              stroke="url(#orbCapStroke)" 
              strokeWidth="1.4"
              opacity="0.9"
            />
            {/* Tassel line */}
            <path 
              d="M21.5 8.5V14.5" 
              stroke="#a78bfa" 
              strokeWidth="1.4" 
            />
            <circle cx="21.5" cy="15" r="0.8" fill="#c084fc" />
            {/* Central Connected AI Core Node */}
            <circle 
              cx="12" 
              cy="8.5" 
              r="1.4" 
              fill="#38bdf8" 
              className="drop-shadow-[0_0_3px_rgba(56,189,248,0.9)]"
            />

            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="orbCapStroke" x1="2.5" y1="3.5" x2="21.5" y2="18" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="0.5" stopColor="#818cf8" />
                <stop offset="1" stopColor="#c084fc" />
              </linearGradient>
              <linearGradient id="orbCapFill" x1="12" y1="3.5" x2="12" y2="13.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" stopOpacity="0.45" />
                <stop offset="1" stopColor="#6366f1" stopOpacity="0.15" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

