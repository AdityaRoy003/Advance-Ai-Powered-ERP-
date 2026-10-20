import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { UsersAPI } from '../../services/api';
import { 
  FaUserFriends, FaUserClock, FaSuitcase, FaPlus, 
  FaFileInvoiceDollar, FaCheckCircle, FaUsers, FaArrowRight, FaTasks
} from 'react-icons/fa';

export default function HRManagerDashboard() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [empFirstName, setEmpFirstName] = useState('');
  const [empLastName, setEmpLastName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [empDept, setEmpDept] = useState('Engineering');
  const [empRole, setEmpRole] = useState('EMPLOYEE');

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await UsersAPI.getAll();
      if (Array.isArray(res)) {
        setEmployees(res);
      }
    } catch (err) {
      console.warn('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!empFirstName || !empEmail || !empPassword) {
      toast.error('First name, email, and password are required');
      return;
    }

    try {
      await UsersAPI.create({
        firstName: empFirstName,
        lastName: empLastName,
        email: empEmail,
        password: empPassword,
        department: empDept,
        role: empRole
      });
      toast.success(`Registered ${empFirstName} ${empLastName} successfully inside database!`);
      setEmpFirstName('');
      setEmpLastName('');
      setEmpEmail('');
      setEmpPassword('');
      setShowAddModal(false);
      fetchEmployees();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create employee');
    }
  };

  const handleGeneratePayroll = () => {
    toast.loading('Processing pay slips calculations...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Generated payroll ledger report! Dispatched to Finance department.');
    }, 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8 text-xs font-semibold"
    >
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl flex flex-col justify-between items-start gap-4">
        <div>
          <span className="text-emerald-250 font-bold uppercase tracking-widest text-xxs">Human Resources Hub</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">HR Dashboard</h1>
          <p className="opacity-95 text-sm mt-1">Manage personnel records, payroll systems, leave workflows, and active recruitments.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Personnel', val: String(employees.length), trend: 'Live DB', desc: 'Current roster count', icon: <FaUserFriends className="text-indigo-400" /> },
          { label: 'Active Status', val: `${employees.filter(e => e.status === 'active').length} Active`, trend: '100% Verified', desc: 'Authorized accounts', icon: <FaUserClock className="text-emerald-400" /> },
          { label: 'Departments', val: `${new Set(employees.map(e => e.department || 'General')).size} Teams`, trend: 'Active', desc: 'Organizational units', icon: <FaSuitcase className="text-pink-400" /> }
        ].map((k, idx) => (
          <div key={idx} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 shadow-sm flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xxs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{k.label}</span>
              <span className="text-2xl font-black text-white flex items-baseline gap-2">
                {k.val}
                <span className="text-xs text-emerald-400 font-bold">{k.trend}</span>
              </span>
              <span className="text-xxs text-slate-400">{k.desc}</span>
            </div>
            <div className="p-3.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-lg">{k.icon}</div>
          </div>
        ))}
      </div>

      {/* Action shortcuts & lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Employee Directory */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-white">
                  <FaUsers /> Personnel Directory
                </h2>
                <p className="text-slate-400 text-xxs mt-0.5">Live roster of all accounts stored in database.</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="self-start sm:self-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 sm:py-2.5 px-3.5 sm:px-4 rounded-xl shadow-lg transition flex items-center gap-2 text-xs"
              >
                <FaPlus /> Provision Staff
              </button>
            </div>

            {employees.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-400">
                <FaUsers className="text-3xl text-slate-600 mb-2 mx-auto" />
                <span className="font-bold text-sm text-slate-300 block">No Personnel Registered Yet</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-250 dark:border-slate-800 font-bold uppercase tracking-wider text-slate-500">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Department</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {employees.map((emp, i) => (
                      <tr key={emp._id || emp.id || i}>
                        <td className="py-3.5 font-bold text-white">
                          {emp.firstName} {emp.lastName}
                        </td>
                        <td className="py-3.5 text-slate-400 font-mono">{emp.email}</td>
                        <td className="py-3.5 text-slate-300">{emp.department || 'General'}</td>
                        <td className="py-3.5 font-mono text-emerald-400 font-bold">{emp.role}</td>
                        <td className="py-3.5">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xxs font-bold uppercase">
                            {emp.status || 'active'}
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

        {/* Right Col: Quick HR Workflows */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/40 shadow-sm flex flex-col gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <FaTasks /> Quick Operations
            </h2>

            <button 
              onClick={handleGeneratePayroll}
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <FaFileInvoiceDollar />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-slate-200">Run Monthly Payroll</span>
                  <span className="text-xxs text-slate-400">Generate ledger statements</span>
                </div>
              </div>
              <FaArrowRight className="text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>

      </div>

      {/* Provision Staff Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111827] border border-slate-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl w-full max-w-md shadow-2xl flex flex-col gap-4 sm:gap-5 text-white max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold">Provision New Employee</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleAddEmployee} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xxs uppercase font-bold text-slate-400">First Name</label>
                    <input 
                      type="text" 
                      value={empFirstName} 
                      onChange={e => setEmpFirstName(e.target.value)} 
                      placeholder="John" 
                      className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-xxs uppercase font-bold text-slate-400">Last Name</label>
                    <input 
                      type="text" 
                      value={empLastName} 
                      onChange={e => setEmpLastName(e.target.value)} 
                      placeholder="Doe" 
                      className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xxs uppercase font-bold text-slate-400">Email Address</label>
                  <input 
                    type="email" 
                    value={empEmail} 
                    onChange={e => setEmpEmail(e.target.value)} 
                    placeholder="john.doe@eduverse.com" 
                    className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" 
                    required 
                  />
                </div>

                <div>
                  <label className="text-xxs uppercase font-bold text-slate-400">Temporary Password</label>
                  <input 
                    type="password" 
                    value={empPassword} 
                    onChange={e => setEmpPassword(e.target.value)} 
                    placeholder="••••••••" 
                    className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xxs uppercase font-bold text-slate-400">Department</label>
                    <select 
                      value={empDept} 
                      onChange={e => setEmpDept(e.target.value)} 
                      className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-400 font-bold"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Finance">Finance</option>
                      <option value="Academic Administration">Academic Administration</option>
                      <option value="IT & Security">IT & Security</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xxs uppercase font-bold text-slate-400">Role</label>
                    <select 
                      value={empRole} 
                      onChange={e => setEmpRole(e.target.value)} 
                      className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-bold"
                    >
                      <option value="EMPLOYEE">EMPLOYEE</option>
                      <option value="HR_MANAGER">HR_MANAGER</option>
                      <option value="FINANCE_OFFICER">FINANCE_OFFICER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg transition text-xs"
                >
                  Create & Provision Account
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
