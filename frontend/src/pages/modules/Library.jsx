import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaSearch, FaBook, FaBarcode, FaCheck, FaDownload, FaFilePdf, FaBookOpen } from 'react-icons/fa';
import { LibraryAPI } from '../../services/api';
import { exportToCSV, downloadBlob } from '../../utils/exportHelper';

const defaultBooksCatalog = [
  { id: 'BK-101', title: 'Introduction to Algorithms (CLRS 4th Ed)', author: 'Thomas H. Cormen, Charles E. Leiserson', isbn: '978-0262046305', category: 'Computer Science', status: 'available', shelf: 'Shelf A-1 (CS)', rating: '4.9' },
  { id: 'BK-102', title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell & Peter Norvig', isbn: '978-0134610993', category: 'Artificial Intelligence', status: 'available', shelf: 'Shelf A-3 (AI)', rating: '4.8' },
  { id: 'BK-103', title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', isbn: '978-1449373320', category: 'Distributed Systems', status: 'available', shelf: 'Shelf B-2 (Sys)', rating: '5.0' },
  { id: 'BK-104', title: 'Clean Architecture: A Craftsman\'s Guide', author: 'Robert C. Martin (Uncle Bob)', isbn: '978-0134494166', category: 'Software Eng', status: 'issued', shelf: 'Shelf B-4 (SE)', rating: '4.7' },
  { id: 'BK-105', title: 'Computer Networking: A Top-Down Approach', author: 'James Kurose & Keith Ross', isbn: '978-0136681557', category: 'Networking', status: 'available', shelf: 'Shelf C-1 (Net)', rating: '4.8' },
  { id: 'BK-106', title: 'Deep Learning with Python & PyTorch', author: 'François Chollet', isbn: '978-1617296864', category: 'Artificial Intelligence', status: 'available', shelf: 'Shelf A-4 (AI)', rating: '4.9' },
  { id: 'BK-107', title: 'Database System Concepts (7th Edition)', author: 'Abraham Silberschatz & Henry F. Korth', isbn: '978-0078022159', category: 'Databases', status: 'available', shelf: 'Shelf C-3 (DB)', rating: '4.6' },
  { id: 'BK-108', title: 'Principles of Neural Science & Brain Models', author: 'Eric Kandel & James Schwartz', isbn: '978-0071390118', category: 'Neuroscience', status: 'available', shelf: 'Shelf D-2 (Bio)', rating: '4.9' }
];

export default function Library() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [booksList, setBooksList] = useState(defaultBooksCatalog);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBooks() {
      try {
        const data = await LibraryAPI.getBooks();
        if (data && data.length > 0) {
          const formatted = data.map((b, i) => ({
            id: b.id || b._id || `BK-${101 + i}`,
            title: b.title || 'Textbook',
            author: b.author || 'Academic Faculty',
            isbn: b.isbn || '978-0123456789',
            category: b.category || (b.title?.includes('AI') || b.title?.includes('Learning') ? 'Artificial Intelligence' : 'Computer Science'),
            status: (b.available > 0 || b.status === 'available') ? 'available' : 'issued',
            shelf: b.location || `Shelf ${String.fromCharCode(65 + (i % 6))}-${(i % 4) + 1}`,
            rating: '4.8'
          }));
          setBooksList(formatted);
        }
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
    toast.success('Book issued to student profile! Return SLA: 14 Days.');
  };

  const handleReturn = (id) => {
    setBooksList((prev) => 
      prev.map((b) => 
        b.id === id ? { ...b, status: 'available' } : b
      )
    );
    toast.success('Book checked back in successfully.');
  };

  const handleDownloadSyllabus = (book) => {
    const text = `EDUVERSE DIGITAL LIBRARY\n========================\n\nTitle: ${book.title}\nAuthor: ${book.author}\nISBN: ${book.isbn}\nLocation: ${book.shelf}\n\nCourse Syllabus & Chapter Excerpts:\n1. Foundation & Theory Concepts\n2. Practical Implementations & Case Studies\n3. Advanced Problems and AI Research Applications\n\nVerified by Central Library Governance`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    downloadBlob(blob, `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}_Syllabus.txt`);
    toast.success(`Downloaded syllabus excerpt for "${book.title}".`);
  };

  const handleExportCatalog = () => {
    exportToCSV(booksList, 'EduVerse_Library_Books_Catalog');
    toast.success('Library catalog exported to CSV!');
  };

  const categories = ['All', 'Computer Science', 'Artificial Intelligence', 'Distributed Systems', 'Software Eng', 'Networking', 'Databases', 'Neuroscience'];

  const filteredBooks = booksList.filter((b) => {
    const matchSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        b.isbn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'All' || b.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black">Library Book Shelf Catalog</h1>
          <p className="text-slate-400 text-xs mt-0.5">Explore physical & digital books, instant self check-out, and syllabus downloads.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportCatalog}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700"
          >
            <FaDownload />
            <span>Export Catalog</span>
          </button>
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"><FaSearch /></span>
            <input 
              type="text" 
              placeholder="Search title, author, ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((b) => (
          <div key={b.id} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 shadow-sm flex flex-col justify-between gap-5 hover:border-indigo-500/40 transition">
            <div className="flex gap-4">
              <div className="w-12 h-16 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                <FaBook size={24} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-sm block truncate text-slate-100">{b.title}</span>
                <span className="text-xxs text-slate-400 block mt-0.5">By {b.author}</span>
                <span className="text-xxs text-indigo-400 block mt-1 font-mono">{b.shelf}</span>
                <span className="text-xxs text-slate-500 font-mono mt-0.5">ISBN: {b.isbn}</span>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800/80 pt-4 flex justify-between items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xxs font-extrabold uppercase ${b.status === 'available' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                {b.status}
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadSyllabus(b)}
                  title="Download Syllabus Excerpt"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition border border-slate-700"
                >
                  <FaDownload />
                </button>

                {b.status === 'available' ? (
                  <button 
                    onClick={() => handleCheckout(b.id)}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg text-xxs transition shadow-md shadow-indigo-600/20"
                  >
                    <FaBarcode /> Check Out
                  </button>
                ) : (
                  <button 
                    onClick={() => handleReturn(b.id)}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-400/30 font-bold px-3 py-1.5 rounded-lg text-xxs transition"
                  >
                    <FaCheck /> Return
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
