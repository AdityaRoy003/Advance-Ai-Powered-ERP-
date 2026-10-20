import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AcademicAPI } from '../services/api';
import { FaCheckCircle, FaExclamationTriangle, FaShieldAlt, FaQrcode, FaArrowLeft, FaPrint } from 'react-icons/fa';

export default function HallTicketVerification() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function verify() {
      try {
        setLoading(true);
        const res = await AcademicAPI.verifyHallTicket(id);
        if (res && res.verified) {
          setData(res);
        } else {
          setError(res?.message || 'Verification record not found');
        }
      } catch (err) {
        setError('Unable to verify credential against institution notarization ledger.');
      } finally {
        setLoading(false);
      }
    }
    if (id) verify();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-purple-500/30 font-sans">
      <div className="w-full max-w-xl bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Branding */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <FaShieldAlt size={20} />
            </div>
            <div>
              <span className="text-xxs uppercase tracking-widest font-mono text-purple-400 font-bold">EduVerse AI ERP • Official Notary</span>
              <h1 className="text-base sm:text-lg font-black text-white">Digital Hall Ticket Verification</h1>
            </div>
          </div>
          <Link to="/" className="text-slate-400 hover:text-white transition p-2 rounded-xl bg-slate-800/60 text-xs">
            <FaArrowLeft />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-400 font-mono">Querying Institution Examination Registry...</span>
          </div>
        ) : error ? (
          <div className="py-8 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-2xl">
              <FaExclamationTriangle />
            </div>
            <div>
              <h2 className="text-base font-bold text-rose-300">Verification Check Failed</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">{error}</p>
            </div>
          </div>
        ) : data ? (
          <div className="flex flex-col gap-6">
            {/* Status Banner */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3.5">
              <FaCheckCircle className="text-emerald-400 text-2xl shrink-0" />
              <div>
                <span className="text-xs font-bold text-emerald-300">AUTHENTIC EXAMINATION CREDENTIAL</span>
                <p className="text-xxs text-emerald-400/80">Authorized by EduVerse Academic Examination Control Wing.</p>
              </div>
            </div>

            {/* Candidate Summary */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <div>
                <span className="text-xxs uppercase tracking-wider text-slate-500 font-bold block">Candidate Name</span>
                <span className="font-bold text-white text-sm">{data.studentName}</span>
              </div>
              <div>
                <span className="text-xxs uppercase tracking-wider text-slate-500 font-bold block">Roll Number</span>
                <span className="font-mono font-bold text-indigo-400 text-sm">{data.rollNumber}</span>
              </div>
              <div>
                <span className="text-xxs uppercase tracking-wider text-slate-500 font-bold block">Department / Sem</span>
                <span className="text-slate-300 font-semibold">{data.department} • Sem {data.semester}</span>
              </div>
              <div>
                <span className="text-xxs uppercase tracking-wider text-slate-500 font-bold block">Assigned Seat</span>
                <span className="font-mono font-bold text-amber-400">{data.seatNumber}</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-800">
                <span className="text-xxs uppercase tracking-wider text-slate-500 font-bold block">Examination Center</span>
                <span className="text-slate-300 text-xs">{data.examCenter}</span>
              </div>
            </div>

            {/* Subjects Roster */}
            <div>
              <span className="text-xxs uppercase font-bold text-slate-400 tracking-wider mb-2 block font-mono">Approved Examination Subjects</span>
              <div className="flex flex-col gap-2">
                {data.subjects?.map((sub, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-white block">{sub.subject}</span>
                      <span className="text-xxs text-slate-400 font-mono">Code: {sub.code} • Date: {sub.date} • {sub.time}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 font-mono font-bold text-xxs">
                      Room: {sub.room}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Cryptographic Hash */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xxs font-mono text-slate-500">
              <span className="truncate max-w-[280px]">Seal: {data.officialSeal}</span>
              <button 
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5"
              >
                <FaPrint /> Print Official Verification
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
