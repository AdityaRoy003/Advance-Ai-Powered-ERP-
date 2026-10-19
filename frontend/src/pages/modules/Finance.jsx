import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaCreditCard, FaPrint, FaDollarSign, FaCheckCircle, FaDownload, FaFileInvoice, FaShieldAlt } from 'react-icons/fa';
import { FinanceAPI } from '../../services/api';
import { downloadReceipt, exportToCSV } from '../../utils/exportHelper';

const defaultInvoices = [
  {
    id: 'INV-2026-901',
    title: 'Semester 4 Tuition Fee (B.Tech CSE)',
    amountDue: 45000,
    amountPaid: 45000,
    status: 'paid',
    dueDate: '2026-07-15',
    student: 'Aditya Roy'
  },
  {
    id: 'INV-2026-902',
    title: 'Semester 5 Advanced AI & Lab Levy',
    amountDue: 28000,
    amountPaid: 10000,
    status: 'unpaid',
    dueDate: '2026-10-30',
    student: 'Aditya Roy'
  },
  {
    id: 'INV-2026-903',
    title: 'Campus Hostel & Smart Mess Fee (Q3)',
    amountDue: 18500,
    amountPaid: 0,
    status: 'unpaid',
    dueDate: '2026-11-15',
    student: 'Aditya Roy'
  },
  {
    id: 'INV-2026-904',
    title: 'Library Security Deposit & Examination Fee',
    amountDue: 6000,
    amountPaid: 6000,
    status: 'paid',
    dueDate: '2026-06-01',
    student: 'Aditya Roy'
  }
];

export default function Finance() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [paying, setPaying] = useState(false);
  const [invoices, setInvoices] = useState(defaultInvoices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFinance() {
      try {
        const data = await FinanceAPI.getOverview();
        const txns = data?.recentTransactions || [];
        if (txns.length > 0) {
          const formatted = txns.map((t, idx) => ({
            id: t.id || `INV-2026-${String(idx + 1).padStart(3, '0')}`,
            title: t.type || `${t.student || 'Student'} Tuition Fee`,
            amountDue: parseInt(String(t.amount || '45000').replace(/[^\d]/g, ''), 10) || 45000,
            amountPaid: t.status === 'Completed' ? parseInt(String(t.amount || '45000').replace(/[^\d]/g, ''), 10) || 45000 : 0,
            status: t.status === 'Completed' ? 'paid' : 'unpaid',
            dueDate: t.date || '2026-10-30',
            student: t.student || 'Aditya Roy'
          }));
          setInvoices(formatted);
        }
      } catch (err) {
        console.error('Error fetching finance records', err);
      } finally {
        setLoading(false);
      }
    }
    loadFinance();
  }, []);

  const handleOpenCheckout = (inv) => {
    setActiveInvoice(inv);
    setShowCheckout(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCVC) {
      toast.error('Please enter complete credit card details');
      return;
    }

    setPaying(true);
    setTimeout(() => {
      setInvoices((prev) => 
        prev.map((inv) => 
          inv.id === activeInvoice.id 
            ? { ...inv, amountPaid: inv.amountDue, status: 'paid' }
            : inv
        )
      );
      toast.success('Payment verified! Receipt generated.');
      setPaying(false);
      setShowCheckout(false);
      setCardNumber('');
      setCardExpiry('');
      setCardCVC('');
    }, 1200);
  };

  const handlePrintReceipt = (inv) => {
    downloadReceipt(inv);
    toast.success(`Downloaded official receipt for "${inv.title}".`);
  };

  const handleExportAll = () => {
    exportToCSV(invoices, 'EduVerse_Fee_Statement_2026');
    toast.success('Fee statement exported as CSV!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">Financial Tuition & Fee Statements</h1>
          <p className="text-slate-400 text-xs mt-0.5">Pay due balances instantly with instant payment gateways and download receipts.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700"
          >
            <FaDownload />
            <span>Export Statement</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {invoices.map((inv) => (
          <div key={inv.id} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl flex-shrink-0">
                <FaDollarSign />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-base block text-slate-100">{inv.title}</span>
                <span className="text-xxs text-slate-400 block mt-0.5">Due date: {inv.dueDate}</span>
                <div className="flex gap-4 mt-2 text-xxs text-slate-500 font-mono">
                  <span>Due: ${inv.amountDue}</span>
                  <span className="text-emerald-400">Paid: ${inv.amountPaid}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className={`px-2.5 py-0.5 rounded text-xxs font-extrabold uppercase ${
                inv.status === 'paid' 
                  ? 'bg-emerald-500/10 text-emerald-400' 
                  : inv.status === 'partial' 
                  ? 'bg-amber-500/10 text-amber-400' 
                  : 'bg-rose-500/10 text-rose-400'
              }`}>
                {inv.status}
              </span>

              {inv.status !== 'paid' ? (
                <button 
                  onClick={() => handleOpenCheckout(inv)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5"
                >
                  <FaCreditCard /> Pay Balance
                </button>
              ) : (
                <button 
                  onClick={() => handlePrintReceipt(inv)}
                  className="border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5"
                >
                  <FaPrint /> Print Receipt
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Stripe Payment Overlay Simulator */}
      <AnimatePresence>
        {showCheckout && activeInvoice && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#111827] border border-slate-850 p-8 rounded-3xl shadow-2xl flex flex-col gap-6"
            >
              <div className="text-center">
                <span className="text-indigo-400 font-bold text-xxs uppercase tracking-widest">EduVerse Safe Pay</span>
                <h3 className="text-2xl font-black text-white mt-1">Stripe Checkout Simulator</h3>
                <p className="text-slate-400 text-xs mt-1">Paying for: <span className="text-slate-200 font-bold">{activeInvoice.title}</span></p>
              </div>

              <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400">Total Transaction Amount</label>
                  <span className="text-2xl font-black text-white">${activeInvoice.amountDue - activeInvoice.amountPaid}</span>
                </div>

                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-xs font-bold text-slate-400">Card Number</label>
                  <input 
                    type="text" 
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-indigo-500 font-semibold text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400">Expiry MM/YY</label>
                    <input 
                      type="text" 
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-indigo-500 font-semibold text-xs text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400">CVC</label>
                    <input 
                      type="text" 
                      placeholder="123"
                      value={cardCVC}
                      onChange={(e) => setCardCVC(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-indigo-500 font-semibold text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button 
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="flex-1 border border-slate-850 hover:bg-slate-850 text-slate-300 font-bold py-3 rounded-xl transition text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={paying}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition text-xs disabled:opacity-50"
                  >
                    {paying ? 'Authorizing Card...' : 'Submit Payment'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
