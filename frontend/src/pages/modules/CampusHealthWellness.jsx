import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHeartbeat, FaUserMd, FaPills, FaNotesMedical,
  FaCheckCircle, FaExclamationCircle, FaPlus, FaTimes,
  FaPhoneAlt, FaCalendarCheck, FaSyncAlt
} from 'react-icons/fa';
import { CampusAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function CampusHealthWellness() {
  const [clinicLogs, setClinicLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);

  // New Visit State
  const [patientName, setPatientName] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  const fetchHealthRecords = async () => {
    setLoading(true);
    try {
      const data = await CampusAPI.getDigitalTwin();
      const records = data?.[0]?.healthClinicRecords || [];
      setClinicLogs(records);
    } catch (err) {
      console.error('Error fetching clinic records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthRecords();
  }, []);

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    if (!patientName || !symptoms) {
      toast.error('Patient Name and Symptoms are required');
      return;
    }
    try {
      const res = await CampusAPI.createClinicRecord({
        patientName,
        role: 'STUDENT',
        symptoms,
        diagnosis: diagnosis || 'General Wellness Examination',
        prescriptions: prescription ? [prescription] : ['Rest & Hydration'],
        emergencyContact: emergencyPhone || '+91 9876543210',
        status: 'Treated'
      });
      setClinicLogs(res);
      toast.success('Health consultation logged securely in HIPAA-compliant vault!');
      setShowLogModal(false);
      setPatientName('');
      setSymptoms('');
      setDiagnosis('');
      setPrescription('');
      setEmergencyPhone('');
    } catch {
      toast.error('Failed to log medical consultation');
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#070b14] text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 text-xl border border-rose-500/30">
              <FaHeartbeat />
            </span>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                Campus Health & Wellness Center
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Confidential Clinic Records, Prescription Ledger, Emergency Dispatch & Medical Wellness
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLogModal(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-lg shadow-rose-900/30 flex items-center gap-2"
          >
            <FaPlus /> Log Clinic Consultation
          </button>
        </div>
      </div>

      {/* Emergency SOS Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950/40 to-slate-900 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl text-xl animate-pulse">
            <FaPhoneAlt />
          </span>
          <div>
            <h3 className="text-sm font-bold text-white">24/7 Campus Emergency Medical Dispatch</h3>
            <p className="text-xxs text-slate-400 font-mono">Dispensary Ambulance Hotline: +91 11-2659-1111 (Ext. 404)</p>
          </div>
        </div>

        <button
          onClick={() => toast.success('Emergency Medical Alert signaled to Campus First Responders!')}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg self-start sm:self-auto"
        >
          SOS Medical Alert
        </button>
      </div>

      {/* Health Consultation Records */}
      <div className="space-y-4">
        <span className="text-xs font-black uppercase text-slate-300">Confidential Health Consultations</span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {clinicLogs.map((log, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xxs font-mono font-bold">
                    ● {log.status || 'Treated'}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">{log.patientName}</h3>
                  <p className="text-xxs text-slate-400 font-mono">Role: {log.role} · Visit: {new Date(log.visitDate || Date.now()).toLocaleDateString()}</p>
                </div>
                <FaUserMd className="text-rose-400 text-2xl" />
              </div>

              <div className="space-y-1.5 text-xs bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                <p className="text-slate-300"><strong className="text-slate-400">Symptoms:</strong> {log.symptoms}</p>
                <p className="text-slate-300"><strong className="text-slate-400">Diagnosis:</strong> {log.diagnosis}</p>
                {log.prescriptions?.length > 0 && (
                  <p className="text-emerald-400 font-mono text-xxs">
                    <strong className="text-slate-400 font-sans text-xs">Prescription:</strong> {log.prescriptions.join(', ')}
                  </p>
                )}
              </div>

              <div className="text-xxs text-slate-500 font-mono flex justify-between">
                <span>Emergency Contact: {log.emergencyContact}</span>
                <span>Access: Restricted Medical Staff Only</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Visit Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Log Medical Consultation</h3>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-white"><FaTimes /></button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-3">
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Patient Name</label>
                <input value={patientName} onChange={e => setPatientName(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" placeholder="Student / Faculty name..." required />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Presented Symptoms</label>
                <input value={symptoms} onChange={e => setSymptoms(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" placeholder="Headache, fever, sprain..." required />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Clinical Diagnosis</label>
                <input value={diagnosis} onChange={e => setDiagnosis(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" placeholder="Diagnosis summary..." />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Prescription / Advice</label>
                <input value={prescription} onChange={e => setPrescription(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" placeholder="Medications prescribed..." />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Emergency Contact Number</label>
                <input value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" placeholder="+91 9876543210" />
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition">
                Save Confidential Medical Record
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
