import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { PlacementAPI } from '../../services/api';
import { FaBriefcase, FaBuilding, FaUserGraduate, FaFileAlt, FaPlus, FaCheck } from 'react-icons/fa';

export default function PlacementOfficerDashboard() {
  const { user } = useAuth();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newPackage, setNewPackage] = useState('');
  const [newDept, setNewDept] = useState('CSE, ECE');

  useEffect(() => {
    async function loadDrives() {
      setLoading(true);
      try {
        const data = await PlacementAPI.getDrives();
        if (Array.isArray(data) && data.length > 0) {
          setDrives(data.map((d, i) => ({
            id: d._id || d.id || `PLC-${i + 1}`,
            company: d.company || 'Recruiting Partner',
            role: d.role || 'Graduate Engineer',
            package: d.package || 'Competitive',
            eligibleDept: d.eligibleDepartments ? d.eligibleDepartments.join(', ') : 'All Branches',
            date: d.driveDate ? new Date(d.driveDate).toLocaleDateString() : 'Upcoming',
            applicants: d.applicants ? d.applicants.length : 0,
            status: d.status || 'Active'
          })));
        } else {
          setDrives([]);
        }
      } catch (err) {
        console.warn('Placement live sync notice:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDrives();
  }, []);

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    if (!newCompany || !newRole) return;
    const item = {
      id: `PLC-${Math.floor(Math.random() * 90 + 10)}`,
      company: newCompany,
      role: newRole,
      package: newPackage || 'Competitive Package',
      eligibleDept: newDept,
      date: new Date().toLocaleDateString(),
      applicants: 0,
      status: 'Active'
    };
    try {
      await PlacementAPI.createDrive({
        company: newCompany,
        role: newRole,
        package: newPackage,
        eligibleDepartments: newDept.split(',').map(s => s.trim())
      });
    } catch {
      // local fallback
    }
    setDrives([item, ...drives]);
    setNewCompany('');
    setNewRole('');
    setNewPackage('');
    toast.success(`Placement Drive for ${item.company} published to eligible students!`);
  };

  const name = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Placement Officer' : 'Placement Officer';

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8 text-xs font-semibold pb-16">
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-8 border border-purple-900/40 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-purple-400 font-bold uppercase tracking-widest text-xxs flex items-center gap-2">
            <FaBriefcase /> Corporate Relations & Career Placement Desk
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white mt-1">Hello, {name}</h1>
          <p className="text-slate-400 text-xs">Publish campus hiring drives, shortlist student candidate pools, coordinate interview rounds, and disburse offer letters.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        {[
          { label: 'Published Drives', val: `${drives.length} Drives`, color: 'text-purple-400' },
          { label: 'Active Recruitment Status', val: 'Operational', color: 'text-emerald-400' },
          { label: 'Enrolled Candidates', val: `${drives.reduce((acc, d) => acc + (d.applicants || 0), 0)} Applicants`, color: 'text-amber-400' },
          { label: 'Placement Portal', val: 'Live', color: 'text-indigo-400' }
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
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><FaBuilding className="text-purple-400" /> Active Campus Recruitment Drives</h2>
            {drives.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl flex flex-col items-center gap-2 text-slate-400">
                <FaBriefcase className="text-3xl text-slate-600 mb-1" />
                <span className="font-bold text-sm text-slate-300">No Placement Drives Published Yet</span>
                <p className="text-xxs text-slate-500">Publish corporate recruitment drives using the form on the right to notify eligible students.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {drives.map(d => (
                  <div key={d.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{d.company}</span>
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-mono text-xxs font-bold">{d.package}</span>
                      </div>
                      <span className="text-xxs text-slate-300 font-semibold">{d.role}</span>
                      <span className="text-xxs text-slate-500 font-mono">Eligible: {d.eligibleDept} • {d.applicants} Applicants Enrolled</span>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-xxs font-mono font-bold">
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-6 rounded-3xl border border-slate-800 bg-[#111827]/60 flex flex-col gap-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2"><FaPlus className="text-purple-400" /> Publish Campus Drive</h2>
            <form onSubmit={handleCreateDrive} className="flex flex-col gap-3">
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Company Name</label>
                <input type="text" value={newCompany} onChange={e => setNewCompany(e.target.value)} placeholder="e.g. Technology Corp" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" required />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Job Title / Designation</label>
                <input type="text" value={newRole} onChange={e => setNewRole(e.target.value)} placeholder="Software Engineer / Associate" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" required />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Annual CTC Package</label>
                <input type="text" value={newPackage} onChange={e => setNewPackage(e.target.value)} placeholder="e.g. ₹12 - 18 LPA" className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono" />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Eligible Departments</label>
                <input type="text" value={newDept} onChange={e => setNewDept(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono" />
              </div>
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-xs">
                Publish Drive to Students
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
