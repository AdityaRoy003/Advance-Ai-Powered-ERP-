import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { FinanceAPI } from '../../services/api';
import { exportToCSV } from '../../utils/exportHelper';
import {
  FaCreditCard, FaFileInvoiceDollar, FaChartPie, FaMoneyBillWave,
  FaFileAlt, FaCheck, FaTimes, FaPlus, FaDownload, FaHistory, FaReceipt
} from 'react-icons/fa';

export default function FinanceOfficerDashboard() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem('eduverse_finance_invoices');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [financeOverview, setFinanceOverview] = useState({
    totalRevenue: '₹0',
    pendingFees: '₹0',
    dispatchedSalaries: '₹0'
  });

  const [newStudent, setNewStudent] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState('Semester Tuition');

  useEffect(() => {
    async function loadFinance() {
      try {
        const data = await FinanceAPI.getOverview();
        if (data) {
          setFinanceOverview({
            totalRevenue: data.totalRevenue || '₹0',
            pendingFees: data.pendingFees || '₹0',
            dispatchedSalaries: data.dispatchedSalaries || '₹0'
          });
        }
      } catch (err) {
        console.warn('Finance live sync notice:', err);
      }
    }
    loadFinance();
  }, []);

  useEffect(() => {
    localStorage.setItem('eduverse_finance_invoices', JSON.stringify(invoices));
  }, [invoices]);

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    if (!newStudent || !newAmount) return;
    const inv = {
      id: `INV-2026-${Math.floor(Math.random() * 900 + 100)}`,
      student: newStudent,
      roll: 'STUDENT/GEN',
      amount: `₹${Number(newAmount).toLocaleString()}`,
      type: newType,
      status: 'PENDING',
      date: new Date().toISOString().split('T')[0]
    };
    setInvoices([inv, ...invoices]);
    setNewStudent('');
    setNewAmount('');
    toast.success(`Invoice ${inv.id} generated for ${newStudent}!`);
  };

  const name = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Finance Officer' : 'Finance Officer';

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8 text-xs font-semibold pb-16">
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-8 border border-emerald-900/40 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-emerald-400 font-bold uppercase tracking-widest text-xxs flex items-center gap-2">
            <FaMoneyBillWave /> Finance & Accounts Control Desk
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white mt-1">Hello, {name}</h1>
          <p className="text-slate-400 text-xs">Manage fee ledgers, disburse payroll, audit institutional invoices, and process expense claims.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        {[
          { label: 'Total Collections (MTD)', val: financeOverview.totalRevenue, color: 'text-emerald-400' },
          { label: 'Pending Dues', val: financeOverview.pendingFees, color: 'text-amber-400' },
          { label: 'Dispatched Salaries', val: financeOverview.dispatchedSalaries, color: 'text-indigo-400' },
          { label: 'Invoices Recorded', val: String(invoices.length), color: 'text-teal-400' }
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
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><FaFileInvoiceDollar className="text-emerald-400" /> Student Fee Invoices Ledger</h2>
              <button 
                onClick={() => {
                  const dataToExport = invoices.length ? invoices : [
                    { id: 'INV-2026-901', studentName: 'Aditya Roy', title: 'Semester 4 Tuition', amount: '₹45,000', status: 'Paid', date: '2026-07-15' },
                    { id: 'INV-2026-902', studentName: 'Priya Sharma', title: 'Semester 4 Tuition', amount: '₹45,000', status: 'Pending', date: '2026-10-30' },
                    { id: 'INV-2026-903', studentName: 'Rohan Gupta', title: 'Hostel & Mess Q3', amount: '₹18,500', status: 'Paid', date: '2026-08-01' }
                  ];
                  exportToCSV(dataToExport, 'EduVerse_Finance_Ledger_2026');
                  toast.success('Finance ledger exported as CSV!');
                }} 
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xxs font-bold flex items-center gap-1 border border-slate-700 transition"
              >
                <FaDownload /> Export Ledger
              </button>
            </div>

            {invoices.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl flex flex-col items-center gap-2 text-slate-400">
                <FaReceipt className="text-3xl text-slate-600 mb-1" />
                <span className="font-bold text-sm text-slate-300">No Invoices Issued Yet</span>
                <p className="text-xxs text-slate-500">Student fee invoices issued by the finance desk will appear here in real time.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-xxs">
                      <th className="pb-3">Invoice ID</th>
                      <th className="pb-3">Student Name</th>
                      <th className="pb-3">Fee Type</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {invoices.map(inv => (
                      <tr key={inv.id}>
                        <td className="py-3 font-mono text-indigo-400 font-bold">{inv.id}</td>
                        <td className="py-3 font-bold text-white">{inv.student}</td>
                        <td className="py-3 text-slate-300">{inv.type}</td>
                        <td className="py-3 font-mono font-bold text-white">{inv.amount}</td>
                        <td className="py-3 text-slate-400 font-mono">{inv.date}</td>
                        <td className="py-3 text-right">
                          <span className={`px-2.5 py-0.5 rounded text-xxs font-bold ${inv.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {inv.status}
                          </span>
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
            <h2 className="text-base font-bold text-white flex items-center gap-2"><FaPlus className="text-emerald-400" /> Issue Fee Invoice</h2>
            <form onSubmit={handleCreateInvoice} className="flex flex-col gap-3">
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Student Name / Email</label>
                <input type="text" value={newStudent} onChange={e => setNewStudent(e.target.value)} placeholder="Student Name or Roll Number" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" required />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Fee Amount (₹)</label>
                <input type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)} placeholder="e.g. 42000" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono" required />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Fee Description</label>
                <select value={newType} onChange={e => setNewType(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-400 font-bold">
                  <option value="Semester Tuition">Semester Tuition</option>
                  <option value="Hostel & Mess Fee">Hostel & Mess Fee</option>
                  <option value="Transport Shuttle Fee">Transport Shuttle Fee</option>
                  <option value="Examination Fee">Examination Fee</option>
                  <option value="Library Fine / Security Deposit">Library Fine / Security Deposit</option>
                </select>
              </div>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs">
                Issue Invoice
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
