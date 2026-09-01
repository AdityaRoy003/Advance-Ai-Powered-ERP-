import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaUserGraduate, FaChalkboardTeacher, FaCalendarAlt,
  FaCheckCircle, FaStar, FaVideo, FaComments, FaClock
} from 'react-icons/fa';
import { InnovationAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function MentorshipMarketplace() {
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [bookingSlot, setBookingSlot] = useState('4:00 PM - 5:00 PM');
  const [bookingTopic, setBookingTopic] = useState('System Design & Distributed AI Review');

  const mentors = [
    {
      name: 'Dr. Arjun Mehta',
      title: 'Professor of AI & Former Google Senior Staff Scientist',
      domain: 'Artificial Intelligence & Distributed Systems',
      rating: '4.9 ★ (84 sessions)',
      slots: ['Tomorrow 4:00 PM - 5:00 PM', 'Wednesday 2:00 PM - 3:00 PM', 'Friday 5:00 PM - 6:00 PM'],
      bio: 'Advising students on deep learning architectures, research publications, and Silicon Valley career roadmaps.'
    },
    {
      name: 'Priya Sundaram',
      title: 'VP of Engineering at CloudScale (EduVerse Alumni 2018)',
      domain: 'Cloud Architecture & Web3',
      rating: '4.8 ★ (62 sessions)',
      slots: ['Thursday 6:00 PM - 7:00 PM', 'Saturday 11:00 AM - 12:00 PM'],
      bio: 'Hands-on mock technical interviews, resume roasts, and Kubernetes microservice reviews.'
    },
    {
      name: 'Vikram Joshi',
      title: 'Principal Security Architect',
      domain: 'Cybersecurity & Cryptography',
      rating: '5.0 ★ (41 sessions)',
      slots: ['Wednesday 4:00 PM - 5:00 PM', 'Friday 3:00 PM - 4:00 PM'],
      bio: 'Specialized in offensive security, SIEM architecture, and zero-day threat analysis.'
    }
  ];

  const handleBook = async (mentor) => {
    try {
      const res = await InnovationAPI.bookMentor({
        mentorName: mentor.name,
        slot: bookingSlot,
        topic: bookingTopic
      });
      toast.success(`Booking Confirmed! Meeting link generated: ${res.bookingId}`);
      setSelectedMentor(null);
    } catch {
      toast.error('Booking failed');
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#070b14] text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 text-xl border border-purple-500/30">
              <FaChalkboardTeacher />
            </span>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Mentorship Marketplace & Advisory
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                1-on-1 Faculty, Alumni & Industry Expert Sessions, Mock Interviews & Career Advising
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mentors.map((m, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-5 hover:border-slate-700 transition">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xxs font-mono font-bold">
                  {m.domain}
                </span>
                <span className="text-xs font-bold text-amber-400 font-mono">{m.rating}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{m.name}</h3>
                <p className="text-xxs text-slate-400 mt-0.5">{m.title}</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
                {m.bio}
              </p>

              <div className="space-y-1">
                <span className="text-xxs font-bold text-slate-500 uppercase block">Available 1-on-1 Slots:</span>
                {m.slots.map((s, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-2 text-xxs text-slate-300 font-mono">
                    <FaClock className="text-purple-400 text-xxs" /> {s}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleBook(m)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition shadow-lg flex items-center justify-center gap-2"
            >
              <FaVideo /> Book 1-on-1 Mentorship Slot
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
