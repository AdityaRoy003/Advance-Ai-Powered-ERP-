import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { SocialGamificationAPI } from '../../services/api';
import { 
  FaUsers, FaComments, FaTrophy, FaPlus, 
  FaHeart, FaShare, FaBullhorn, FaRobot, FaPaperPlane, FaCheckCircle, FaFire 
} from 'react-icons/fa';

const defaultClubsList = [
  { clubId: 'club-code', name: 'Binary Beasts: AI & Coding Guild', category: 'Coding & AI', description: 'Competitive programming, open-source hackathons, and deep learning study groups.', leadStudentName: 'Aditya Roy', facultyMentorName: 'Dr. Priya Nair', memberCount: 148, bannerColor: 'from-blue-600 to-indigo-600', upcomingEventTitle: 'Hack-the-Campus 48-hour Sprint', joined: true },
  { clubId: 'club-robo', name: 'RoboKnights Robotics & IoT', category: 'Robotics', description: 'Autonomous drones, embedded ROS systems, and national rover challenge team.', leadStudentName: 'Kunal Sharma', facultyMentorName: 'Prof. Rajesh Kumar', memberCount: 92, bannerColor: 'from-amber-600 to-rose-600', upcomingEventTitle: 'Line Follower & Drone Arena Battle', joined: false },
  { clubId: 'club-ecell', name: 'E-Cell: Nexus Incubator', category: 'Entrepreneurship', description: 'Pitch decks, seed grants, venture mentoring, and startup demo days.', leadStudentName: 'Ananya Mehta', facultyMentorName: 'Dr. Sarah Connor', memberCount: 110, bannerColor: 'from-emerald-600 to-teal-600', upcomingEventTitle: 'Angel Investor Pitch Night 2026', joined: false },
  { clubId: 'club-cyber', name: 'ZeroDay Cyber Defense Club', category: 'Cybersecurity', description: 'CTF competitions, ethical hacking drills, reverse engineering and SIEM threat response.', leadStudentName: 'Vikram Seth', facultyMentorName: 'Prof. Alok Gupta', memberCount: 84, bannerColor: 'from-cyan-600 to-blue-700', upcomingEventTitle: 'Annual Red vs Blue Team CTF', joined: true }
];

const defaultPostsList = [
  {
    _id: 'post-01',
    authorName: 'Dr. Priya Nair (Faculty Lead)',
    authorRole: 'TEACHER',
    clubCategory: 'Coding & AI',
    content: '🚀 Congratulations to Team EduVerse for securing 1st prize at the National AI Hackathon! Certificate badges have been notarized on the Blockchain Vault.',
    likesCount: 54,
    commentsCount: 12,
    isAnnouncement: true,
    isLiked: false,
    createdAt: '10 mins ago'
  },
  {
    _id: 'post-02',
    authorName: 'Aditya Roy',
    authorRole: 'STUDENT',
    clubCategory: 'Robotics',
    content: 'Our autonomous obstacle-avoidance rover completed its first campus lawn circuit test with 99.2% path accuracy. Testing telemetry is now live on the Smart Campus IoT dashboard!',
    likesCount: 38,
    commentsCount: 7,
    isAnnouncement: false,
    isLiked: true,
    createdAt: '1 hour ago'
  },
  {
    _id: 'post-03',
    authorName: 'Ananya Mehta',
    authorRole: 'STUDENT',
    clubCategory: 'Entrepreneurship',
    content: '💡 E-Cell Nexus is opening micro-grant applications ($5,000) for student startups in GreenTech & EdTech. Pitch deck deadline is Nov 15!',
    likesCount: 29,
    commentsCount: 5,
    isAnnouncement: true,
    isLiked: false,
    createdAt: '3 hours ago'
  }
];

export default function CampusSocialCommunity() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('feed'); // feed | clubs
  const [posts, setPosts] = useState(defaultPostsList);
  const [clubs, setClubs] = useState(defaultClubsList);
  const [loading, setLoading] = useState(true);

  const [postContent, setPostContent] = useState('');
  const [selectedClub, setSelectedClub] = useState('General');
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [posting, setPosting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        SocialGamificationAPI.getPosts(),
        SocialGamificationAPI.getClubs()
      ]);
      if (pRes && pRes.length > 0) {
        setPosts(pRes.map((p, i) => ({
          ...p,
          _id: p._id || `post-api-${i}`,
          isLiked: false,
          createdAt: p.createdAt ? new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'
        })));
      }
      if (cRes && cRes.length > 0) {
        setClubs(cRes.map(c => ({
          ...c,
          joined: c.joined || false
        })));
      }
    } catch (err) {
      console.error('Community error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) {
      toast.error('Post content is required');
      return;
    }

    setPosting(true);
    const authorName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user?.email?.split('@')[0] || 'Community Member' : 'Community Member';
    const newPost = {
      _id: `post-${Date.now()}`,
      authorName,
      authorRole: user?.role || 'STUDENT',
      clubCategory: selectedClub,
      content: postContent.trim(),
      likesCount: 1,
      commentsCount: 0,
      isAnnouncement,
      isLiked: true,
      createdAt: 'Just now'
    };

    // Optimistically update UI
    setPosts(prev => [newPost, ...prev]);
    toast.success('Post published to EduVerse Community!');
    setPostContent('');

    try {
      await SocialGamificationAPI.createPost({
        content: newPost.content,
        clubCategory: selectedClub,
        isAnnouncement
      });
    } catch {
      // Local post already present
    } finally {
      setPosting(false);
    }
  };

  const handleToggleLike = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p._id === postId) {
        const liked = !p.isLiked;
        return {
          ...p,
          isLiked: liked,
          likesCount: liked ? (p.likesCount || 0) + 1 : Math.max(0, (p.likesCount || 1) - 1)
        };
      }
      return p;
    }));
  };

  const handleToggleJoinClub = (clubId) => {
    setClubs(prev => prev.map(c => {
      if (c.clubId === clubId) {
        const joined = !c.joined;
        toast.success(joined ? `Joined ${c.name}!` : `Left ${c.name}`);
        return {
          ...c,
          joined,
          memberCount: joined ? c.memberCount + 1 : Math.max(1, c.memberCount - 1)
        };
      }
      return c;
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xl">
              <FaUsers />
            </span>
            <div>
              <h1 className="text-2xl font-black">EduVerse Campus Community</h1>
              <p className="text-slate-400 text-xs mt-0.5">Internal moderated student clubs, research circles, hackathon teams & achievements</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'feed' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:text-white'}`}
          >
            <FaComments />
            <span>Campus Feed</span>
          </button>
          <button
            onClick={() => setActiveTab('clubs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'clubs' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:text-white'}`}
          >
            <FaTrophy />
            <span>Student Clubs</span>
          </button>
        </div>
      </div>

      {activeTab === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post Box */}
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5 shadow-sm">
              <form onSubmit={handleCreatePost}>
                <textarea
                  rows={3}
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  placeholder="Share a project milestone, research paper, club event, or hackathon victory..."
                  className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedClub}
                      onChange={e => setSelectedClub(e.target.value)}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-semibold focus:outline-none"
                    >
                      <option value="General">📢 General Campus</option>
                      <option value="Coding & AI">💻 Coding & AI Guild</option>
                      <option value="Robotics">🤖 Robotics Club</option>
                      <option value="Entrepreneurship">🚀 E-Cell Incubator</option>
                      <option value="Cybersecurity">🛡️ ZeroDay Cyber Defense</option>
                    </select>

                    <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={isAnnouncement} 
                        onChange={e => setIsAnnouncement(e.target.checked)}
                        className="rounded bg-slate-900 border-slate-700 text-rose-500 focus:ring-0"
                      />
                      <span>Official</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={posting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs transition shadow-lg shadow-rose-500/20"
                  >
                    <FaPaperPlane size={11} className={posting ? 'animate-pulse' : ''} />
                    <span>{posting ? 'Publishing...' : 'Publish'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              <AnimatePresence>
                {posts.map(p => (
                  <motion.div 
                    key={p._id || p.content}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-slate-800 bg-[#111827] p-6 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
                          {p.authorName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{p.authorName}</h4>
                          <p className="text-xxs text-slate-400">{p.authorRole} • <span className="text-rose-400 font-semibold">{p.clubCategory || 'Campus'}</span> • {p.createdAt}</p>
                        </div>
                      </div>

                      {p.isAnnouncement && (
                        <span className="text-xxs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold flex items-center gap-1">
                          <FaBullhorn size={9} /> Official
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed my-3">{p.content}</p>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleToggleLike(p._id)}
                          className={`flex items-center gap-1.5 transition font-semibold ${p.isLiked ? 'text-rose-400 scale-105' : 'text-slate-400 hover:text-rose-400'}`}
                        >
                          <FaHeart className={p.isLiked ? 'text-rose-500' : ''} />
                          <span>{p.likesCount || 0} Likes</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-slate-400 hover:text-white transition font-semibold">
                          <FaComments />
                          <span>{p.commentsCount || 0} Comments</span>
                        </button>
                      </div>
                      <span className="text-xxs text-emerald-400 font-mono flex items-center gap-1">
                        <FaCheckCircle size={10} /> Verified Member
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Trending Clubs Sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <FaTrophy className="text-amber-400" />
                <span>Featured Campus Guilds</span>
              </h3>

              <div className="space-y-3">
                {clubs.map(c => (
                  <div key={c.clubId} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{c.name}</h4>
                      <p className="text-xxs text-slate-400 mt-0.5">{c.memberCount} Members • {c.category}</p>
                    </div>
                    <button 
                      onClick={() => handleToggleJoinClub(c.clubId)}
                      className={`px-3 py-1.5 rounded-lg text-xxs font-bold transition shrink-0 ${c.joined ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20'}`}
                    >
                      {c.joined ? 'Joined ✓' : 'Join'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'clubs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map(c => (
            <div key={c.clubId} className="rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden flex flex-col justify-between hover:border-slate-700 transition">
              <div className={`h-24 bg-gradient-to-r ${c.bannerColor || 'from-indigo-600 to-purple-600'} p-4 flex items-end justify-between`}>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-black/60 text-white backdrop-blur-sm">
                  {c.category}
                </span>
                {c.upcomingEventTitle && (
                  <span className="text-xxs font-bold px-2 py-0.5 rounded bg-amber-500/80 text-black flex items-center gap-1">
                    <FaFire size={9} /> Event Soon
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white mb-1">{c.name}</h3>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">{c.description}</p>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xxs text-slate-400 mb-4">
                    <div className="flex justify-between">
                      <span>Lead:</span>
                      <span className="font-semibold text-white">{c.leadStudentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Faculty Mentor:</span>
                      <span className="font-semibold text-white">{c.facultyMentorName}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400">{c.memberCount} Members</span>
                  <button 
                    onClick={() => handleToggleJoinClub(c.clubId)}
                    className={`px-4 py-1.5 rounded-xl font-bold text-xs transition ${c.joined ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500 hover:bg-rose-400 text-white shadow-lg shadow-rose-500/20'}`}
                  >
                    {c.joined ? 'Member ✓' : 'Join Guild'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
