import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaUserGraduate, FaGithub, FaLinkedin, FaCode,
  FaAward, FaCheckCircle, FaQrcode, FaExternalLinkAlt,
  FaDownload, FaShareAlt, FaShieldAlt
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function StudentPublicPortfolio() {
  const [copied, setCopied] = useState(false);

  const student = {
    name: 'Aditya Raj',
    handle: 'aditya-raj',
    role: 'B.Tech Computer Science & Engineering',
    institution: 'EduVerse Institute of Technology',
    batch: 'Class of 2026',
    cgpa: '9.42 / 10.0',
    bio: 'Full-Stack Distributed Systems Developer & AI Researcher. Passionate about building high-throughput microservices, multi-agent frameworks, and Web3 cryptographic verification.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    skills: [
      { name: 'React.js / TypeScript', level: 'Expert (96%)' },
      { name: 'Node.js / Express', level: 'Expert (94%)' },
      { name: 'PyTorch & LLM RAG', level: 'Advanced (88%)' },
      { name: 'PostgreSQL / MongoDB', level: 'Advanced (90%)' },
      { name: 'Docker & Kubernetes', level: 'Proficient (82%)' },
      { name: 'Solidity & Blockchain', level: 'Proficient (78%)' }
    ],
    projects: [
      {
        title: 'EduVerse Enterprise ERP Platform',
        tech: ['React', 'Node.js', 'MongoDB', 'Socket.IO', 'TypeScript'],
        desc: 'Engineered a 20-module SaaS ERP system supporting Multi-Tenant isolation, 3D Campus Digital Twin, AI Firewall, and Blockchain credentials.',
        github: 'https://github.com/adityaraj/eduverse-erp',
        live: 'https://eduverse.app'
      },
      {
        title: 'Neural Consensus: Distributed AI Model Optimizer',
        tech: ['PyTorch', 'FastAPI', 'Redis', 'Docker'],
        desc: 'Implemented asynchronous parameter synchronization algorithms reducing cross-node gradient latency by 34%.',
        github: 'https://github.com/adityaraj/neural-consensus',
        live: 'https://neural-consensus.io'
      }
    ],
    certifications: [
      { title: 'Bachelor of Technology (CSE) - Honors', issuer: 'EduVerse Central Ledger', verified: true, txHash: '0x8f14e45fceea167a5a36dedd01013a93ebf30e06' },
      { title: 'Deep Learning Specialization', issuer: 'DeepLearning.AI', verified: true, txHash: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' }
    ]
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`https://eduverse.app/student/${student.handle}`);
    setCopied(true);
    toast.success('Public Recruiter Portfolio URL copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#070b14] text-white max-w-5xl mx-auto">
      {/* Recruiter Share Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xxs uppercase font-black text-cyan-400 tracking-wider">Public Recruiter Link Ready</span>
          <h3 className="text-sm font-bold text-white mt-0.5">eduverse.app/student/{student.handle}</h3>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg flex items-center gap-1.5"
          >
            <FaShareAlt /> {copied ? 'URL Copied!' : 'Share with Recruiters'}
          </button>
          <button
            onClick={() => toast.success('Official Verified Transcript & Resume PDF generated!')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition border border-slate-700 flex items-center gap-1.5"
          >
            <FaDownload /> Download Resume
          </button>
        </div>
      </div>

      {/* Hero Profile Card */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-1 flex-shrink-0 shadow-2xl">
          <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center text-4xl text-indigo-400 font-black">
            AR
          </div>
        </div>

        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-black text-white">{student.name}</h1>
              <p className="text-xs text-indigo-400 font-mono font-bold mt-0.5">{student.role} · {student.batch}</p>
              <p className="text-xxs text-slate-400">{student.institution}</p>
            </div>
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-right">
              <span className="text-xxs uppercase font-mono text-slate-400 block">Verified CGPA</span>
              <span className="text-xl font-black text-emerald-400 font-mono">{student.cgpa}</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            {student.bio}
          </p>

          <div className="flex justify-center md:justify-start gap-2 pt-2">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"><FaGithub /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      {/* Verified Skills & Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verified Skills */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <FaCode />
            <span className="text-xs font-black uppercase tracking-wider">Verified Skill Proficiency</span>
          </div>

          <div className="space-y-3">
            {student.skills.map((sk, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xxs font-mono">
                  <span className="text-white font-bold">{sk.name}</span>
                  <span className="text-emerald-400 font-bold">{sk.level}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full" style={{ width: sk.level.match(/\d+/)?.[0] + '%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blockchain Academic Credentials */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <FaShieldAlt />
            <span className="text-xs font-black uppercase tracking-wider">Blockchain Verified Credentials</span>
          </div>

          <div className="space-y-3">
            {student.certifications.map((cert, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 font-mono text-xxs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{cert.title}</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1"><FaCheckCircle /> Verified</span>
                </div>
                <span className="text-slate-400 block">Issuer: {cert.issuer}</span>
                <span className="text-slate-500 truncate block">Hash: {cert.txHash}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Projects Showcase */}
      <div className="space-y-4">
        <span className="text-xs font-black uppercase text-slate-300">Featured Capstone & Open Source Projects</span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {student.projects.map((proj, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">{proj.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{proj.desc}</p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {proj.tech.map((t, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xxs font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-800">
                <a href={proj.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xxs font-bold text-slate-300 hover:text-white transition">
                  <FaGithub /> Repository
                </a>
                <a href={proj.live} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xxs font-bold text-cyan-400 hover:text-cyan-300 transition">
                  <FaExternalLinkAlt /> Live Demo
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
