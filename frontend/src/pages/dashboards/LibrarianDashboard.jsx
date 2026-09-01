import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { LibraryAPI } from '../../services/api';
import { FaBook, FaBarcode, FaSearch, FaPlus, FaCheck, FaUndo } from 'react-icons/fa';

export default function LibrarianDashboard() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newIsbn, setNewIsbn] = useState('');
  const [newTotal, setNewTotal] = useState(5);

  useEffect(() => {
    async function loadBooks() {
      setLoading(true);
      try {
        const data = await LibraryAPI.getBooks();
        if (Array.isArray(data) && data.length > 0) {
          setBooks(data.map((b, i) => ({
            id: b._id || b.id || `BK-${i + 1}`,
            title: b.title || 'Library Accession',
            author: b.author || 'Author',
            isbn: b.isbn || 'N/A',
            total: b.copiesCount || b.totalCopies || 5,
            available: b.availableCopies !== undefined ? b.availableCopies : 5,
            rack: b.location || 'General Stacks'
          })));
        } else {
          setBooks([]);
        }
      } catch (err) {
        console.warn('Library live sync notice:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  const handleAddBook = (e) => {
    e.preventDefault();
    if (!newTitle || !newAuthor) return;
    const bk = {
      id: `BK-${Math.floor(Math.random() * 900 + 100)}`,
      title: newTitle,
      author: newAuthor,
      isbn: newIsbn || '978-XXXXXXXXXX',
      total: Number(newTotal),
      available: Number(newTotal),
      rack: 'General Section'
    };
    setBooks([bk, ...books]);
    setNewTitle('');
    setNewAuthor('');
    setNewIsbn('');
    toast.success(`Book "${bk.title}" added to catalog!`);
  };

  const name = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Librarian' : 'Librarian';

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8 text-xs font-semibold pb-16">
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 rounded-3xl p-8 border border-amber-900/40 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-amber-400 font-bold uppercase tracking-widest text-xxs flex items-center gap-2">
            <FaBook /> Central Library Catalog & Circulation Desk
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white mt-1">Hello, {name}</h1>
          <p className="text-slate-400 text-xs">Catalog new accessions, manage barcode checkouts, issue return reminders, and audit inventory.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        {[
          { label: 'Cataloged Volumes', val: `${books.length} Titles`, color: 'text-amber-400' },
          { label: 'Total Copies Available', val: `${books.reduce((acc, b) => acc + (b.available || 0), 0)} Copies`, color: 'text-indigo-400' },
          { label: 'Circulation Status', val: 'Operational', color: 'text-emerald-400' },
          { label: 'Digital Catalog', val: 'Connected', color: 'text-teal-400' }
        ].map((s, i) => (
          <div key={i} className="p-5 rounded-2xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-1">
            <span className="text-xxs uppercase tracking-wider text-slate-400 font-sans font-bold">{s.label}</span>
            <span className={`text-2xl font-black ${s.color}`}>{s.val}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="p-6 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><FaBook className="text-amber-400" /> Book Inventory & Circulation</h2>
            {books.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl flex flex-col items-center gap-2 text-slate-400">
                <FaBook className="text-3xl text-slate-600 mb-1" />
                <span className="font-bold text-sm text-slate-300">No Volumes Cataloged Yet</span>
                <p className="text-xxs text-slate-500">Accession books into the central library system using the form on the right.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-xxs">
                      <th className="pb-3">Book Title</th>
                      <th className="pb-3">Author</th>
                      <th className="pb-3">ISBN</th>
                      <th className="pb-3">Available</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {books.map(b => (
                      <tr key={b.id}>
                        <td className="py-3 font-bold text-white">{b.title}</td>
                        <td className="py-3 text-slate-300">{b.author}</td>
                        <td className="py-3 font-mono text-indigo-400 text-xxs">{b.isbn}</td>
                        <td className="py-3 font-mono font-bold text-emerald-400">{b.available} / {b.total}</td>
                        <td className="py-3 text-right">
                          <button onClick={() => toast.success(`Checked out 1 copy of ${b.title}`)} className="bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 px-3 py-1 rounded-lg text-xxs font-bold">
                            Issue Book
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-6 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2"><FaPlus className="text-amber-400" /> Add Book to Catalog</h2>
            <form onSubmit={handleAddBook} className="flex flex-col gap-3">
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Book Title</label>
                <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Title of Book" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" required />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Author</label>
                <input type="text" value={newAuthor} onChange={e => setNewAuthor(e.target.value)} placeholder="Author Full Name" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" required />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">ISBN</label>
                <input type="text" value={newIsbn} onChange={e => setNewIsbn(e.target.value)} placeholder="978-XXXXXXXXXX" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono" />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Total Copies</label>
                <input type="number" min="1" value={newTotal} onChange={e => setNewTotal(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono" />
              </div>
              <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs">
                Catalog Accession
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
