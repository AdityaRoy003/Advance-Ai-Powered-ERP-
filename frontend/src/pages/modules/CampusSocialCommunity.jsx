import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { SocialGamificationAPI } from '../../services/api';
import { 
  FaUsers, FaComments, FaTrophy, FaPlus, 
  FaHeart, FaShare, FaBullhorn, FaRobot, FaPaperPlane 
} from 'react-icons/fa';

export default function CampusSocialCommunity() {
  const [activeTab, setActiveTab] = useState('feed'); // feed | clubs
  const [posts, setPosts] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [postContent, setPostContent] = useState('');
  const [selectedClub, setSelectedClub] = useState('General');
  const [isAnnouncement, setIsAnnouncement] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        SocialGamificationAPI.getPosts(),
        SocialGamificationAPI.getClubs()
      ]);
      setPosts(pRes);
      setClubs(cRes);
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

    try {
      await SocialGamificationAPI.createPost({
        content: postContent,
        clubCategory: selectedClub,
        isAnnouncement
      });
      toast.success('Post published to EduVerse Community!');
      setPostContent('');
      fetchData();
    } catch {
      toast.error('Failed to post');
    }
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
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
              <form onSubmit={handleCreatePost}>
                <textarea
                  rows={3}
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  placeholder="Share a project milestone, research paper, club event, or hackathon victory..."
                  className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedClub}
                      onChange={e => setSelectedClub(e.target.value)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xxs text-slate-300"
                    >
                      <option value="General">📢 General Campus</option>
                      <option value="Coding & AI">💻 Coding & AI Guild</option>
                      <option value="Robotics">🤖 Robotics Club</option>
                      <option value="Entrepreneurship">🚀 E-Cell Incubator</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs transition shadow-lg shadow-rose-500/20"
                  >
                    <FaPaperPlane size={11} />
                    <span>Publish</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {posts.map(p => (
                <div key={p._id || p.content} className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                        {p.authorName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{p.authorName}</h4>
                        <p className="text-xxs text-slate-400">{p.authorRole} • {p.clubCategory || 'Campus'}</p>
                      </div>
                    </div>

                    {p.isAnnouncement && (
                      <span className="text-xxs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold flex items-center gap-1">
                        <FaBullhorn size={9} /> Official
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed my-3">{p.content}</p>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1.5 hover:text-rose-400 transition">
                        <FaHeart className="text-rose-500" />
                        <span>{p.likesCount || 12} Likes</span>
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-white transition">
                        <FaComments />
                        <span>{p.commentsCount || 3} Comments</span>
                      </button>
                    </div>
                    <span className="text-xxs text-slate-500">Verified Member</span>
                  </div>
                </div>
              ))}
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
                  <div key={c.clubId} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{c.name}</h4>
                      <p className="text-xxs text-slate-400">{c.memberCount} Members • {c.category}</p>
                    </div>
                    <button className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xxs font-bold hover:bg-rose-500/20 transition">
                      Join
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
            <div key={c.clubId} className="rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden flex flex-col justify-between">
              <div className={`h-24 bg-gradient-to-r ${c.bannerColor} p-4 flex items-end`}>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-black/60 text-white backdrop-blur-sm">
                  {c.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white mb-1">{c.name}</h3>
                  <p className="text-xs text-slate-400 mb-4">{c.description}</p>

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
                  <button className="px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs transition">
                    Explore Space
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
