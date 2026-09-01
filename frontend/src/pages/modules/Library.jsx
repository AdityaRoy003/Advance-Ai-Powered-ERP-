import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaSearch, FaBook, FaBarcode, FaCheck } from 'react-icons/fa';
import { LibraryAPI } from '../../services/api';

export default function Library() {
  const [searchTerm, setSearchTerm] = useState('');
  const [booksList, setBooksList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBooks() {
      try {
        const data = await LibraryAPI.getBooks();
        const formatted = (data || []).map((b, i) => ({
          id: b.id || b._id || String(i + 1),
          title: b.title || 'Textbook',
          author: b.author || 'Academic Faculty',
          isbn: b.isbn || '978-0123456789',
          status: b.available > 0 ? 'available' : 'issued',
          shelf: b.location || `Shelf ${String.fromCharCode(65 + i)}-1`
        }));
        setBooksList(formatted);
      } catch (err) {
        console.error('Failed to fetch books', err);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  const handleCheckout = (id) => {
    setBooksList((prev) => 
      prev.map((b) => 
        b.id === id ? { ...b, status: 'issued' } : b
      )
    );
    toast.success('Book successfully issued to student profile!');
  };

  const filteredBooks = booksList.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black">Library Book Shelf Catalog</h1>
          <p className="text-slate-400 text-xs mt-0.5">Search and check out textbooks directly to your account.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"><FaSearch /></span>
          <input 
            type="text" 
            placeholder="Search title, author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((b) => (
          <div key={b.id} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 shadow-sm flex flex-col justify-between gap-5">
            <div className="flex gap-4">
              <div className="w-12 h-16 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                <FaBook size={24} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-sm block truncate text-slate-100">{b.title}</span>
                <span className="text-xxs text-slate-400 block mt-0.5">By {b.author}</span>
                <span className="text-xxs text-slate-500 block mt-1 font-mono">{b.shelf}</span>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800/80 pt-4 flex justify-between items-center gap-4">
              <span className={`px-2 py-0.5 rounded text-xxs font-extrabold uppercase ${b.status === 'available' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {b.status}
              </span>
              
              {b.status === 'available' ? (
                <button 
                  onClick={() => handleCheckout(b.id)}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg text-xxs transition"
                >
                  <FaBarcode /> Check Out
                </button>
              ) : (
                <span className="text-xxs text-slate-400 flex items-center gap-1 font-semibold">
                  <FaCheck /> Issued
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
