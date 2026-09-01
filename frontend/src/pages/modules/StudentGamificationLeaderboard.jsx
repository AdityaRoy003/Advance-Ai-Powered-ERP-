import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SocialGamificationAPI } from '../../services/api';
import { 
  FaMedal, FaTrophy, FaStar, FaFire, 
  FaCheckCircle, FaAward, FaCrown, FaBolt 
} from 'react-icons/fa';

export default function StudentGamificationLeaderboard() {
  const [profileData, setProfileData] = useState({ profile: null, leaderboard: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGamification = async () => {
      setLoading(true);
      try {
        const res = await SocialGamificationAPI.getGamificationProfile();
        setProfileData(res);
      } catch (err) {
        console.error('Gamification error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGamification();
  }, []);

  const profile = profileData.profile || {
    totalXp: 3450,
    level: 4,
    rank: 1,
    unlockedBadges: [
      { badgeId: '1', name: 'Attendance Vanguard', icon: '🏆', description: 'Maintained 95%+ attendance across active subjects.', rarity: 'Rare' },
      { badgeId: '2', name: 'Hackathon Champion', icon: '🥇', description: 'Placed 1st in Inter-College Innovation Sprint.', rarity: 'Legendary' },
      { badgeId: '3', name: 'Curriculum Master', icon: '📚', description: 'Completed 10 LMS courses with 90%+ scores.', rarity: 'Epic' }
    ]
  };

  const getRarityBadge = (rarity) => {
    switch (rarity) {
      case 'Legendary': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Epic': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Rare': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xl">
              <FaTrophy />
            </span>
            <div>
              <h1 className="text-2xl font-black">Student Achievements & Gamification</h1>
              <p className="text-slate-400 text-xs mt-0.5">Experience points (XP), unlocked achievement badges & institutional peer leaderboards</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-2xl">
          <FaFire className="text-amber-400" />
          <span className="text-xs font-bold text-amber-300">Level {profile.level} Scholar • #{profile.rank} Campus Rank</span>
        </div>
      </div>

      {/* Progress & Stats Card */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-slate-900 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xxs font-bold text-amber-400 uppercase tracking-wider">Active Scholar XP</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black text-white">{profile.totalXp?.toLocaleString()}</span>
              <span className="text-xs text-amber-400 font-bold">XP Earned</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">550 XP needed to reach Level {profile.level + 1} Grandmaster</p>
          </div>

          <div className="w-full md:w-80">
            <div className="flex justify-between text-xxs text-slate-400 mb-1.5 font-bold">
              <span>Level {profile.level}</span>
              <span>Level {profile.level + 1}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-700">
              <div className="bg-gradient-to-r from-amber-500 to-purple-500 h-full rounded-full" style={{ width: '72%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Unlocked Badges Showcase */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <FaAward className="text-amber-400" />
          <span>Unlocked Achievement Badges ({profile.unlockedBadges?.length || 3})</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {profile.unlockedBadges?.map((b, i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2 rounded-xl bg-black/40 border border-slate-800 inline-block">{b.icon}</span>
                  <span className={`text-xxs px-2 py-0.5 rounded-full font-bold border ${getRarityBadge(b.rarity)}`}>
                    {b.rarity}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{b.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{b.description}</p>
              </div>
              <span className="text-xxs text-emerald-400 font-semibold flex items-center gap-1">
                <FaCheckCircle size={10} /> Unlocked
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <FaCrown className="text-amber-400" />
            <span>Campus Leaderboard (Top Scholars)</span>
          </h2>
          <span className="text-xxs text-slate-400">Updated Daily</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-slate-400 text-xxs uppercase tracking-wider">
              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4">Student</th>
                <th className="p-4">Department</th>
                <th className="p-4">Level</th>
                <th className="p-4">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {(profileData.leaderboard?.length > 0 ? profileData.leaderboard : [
                { rank: 1, studentName: 'Aditya Roy', department: 'Computer Science', level: 4, totalXp: 3450 },
                { rank: 2, studentName: 'Kunal Sharma', department: 'Electronics (ECE)', level: 4, totalXp: 3120 },
                { rank: 3, studentName: 'Pooja Verma', department: 'Mechanical Eng', level: 3, totalXp: 2850 },
                { rank: 4, studentName: 'Ananya Mehta', department: 'Information Tech', level: 3, totalXp: 2600 }
              ]).map((st, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition">
                  <td className="p-4 font-black">
                    {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                  </td>
                  <td className="p-4 font-bold text-white">{st.studentName}</td>
                  <td className="p-4 text-slate-400">{st.department}</td>
                  <td className="p-4 text-amber-400 font-bold">Level {st.level}</td>
                  <td className="p-4 font-mono font-bold text-emerald-400">{st.totalXp?.toLocaleString()} XP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
