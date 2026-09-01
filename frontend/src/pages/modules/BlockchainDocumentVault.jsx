import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaFolder, FaLink, FaQrcode, FaCheckCircle, FaShieldAlt,
  FaFilePdf, FaPlus, FaTimes, FaSearch, FaSyncAlt, FaExternalLinkAlt
} from 'react-icons/fa';
import { DocumentsAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function BlockchainDocumentVault() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [verifyHashInput, setVerifyHashInput] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // New Document State
  const [studentName, setStudentName] = useState('Rahul Sharma');
  const [docType, setDocType] = useState('Degree Certificate');
  const [docTitle, setDocTitle] = useState('Bachelor of Technology (Computer Science & Engineering)');

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const data = await DocumentsAPI.getAll();
      if (Array.isArray(data) && data.length > 0) {
        setDocuments(data);
      } else {
        const initialDoc = await DocumentsAPI.issue({
          studentName: 'Aditya Raj',
          docType: 'Degree Certificate',
          title: 'Bachelor of Technology (Computer Science & Engineering) - Honors'
        });
        setDocuments([initialDoc]);
      }
    } catch (err) {
      console.error('Error fetching vault:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleIssueDoc = async (e) => {
    e.preventDefault();
    try {
      const doc = await DocumentsAPI.issue({ studentName, docType, title: docTitle });
      toast.success('Document issued & notarized with SHA-256 hash on Blockchain ledger!');
      setShowIssueModal(false);
      fetchDocs();
    } catch {
      toast.error('Failed to issue document');
    }
  };

  const handleVerifyHash = async () => {
    if (!verifyHashInput.trim()) return;
    setVerifying(true);
    try {
      const res = await DocumentsAPI.verifyHash(verifyHashInput.trim());
      setVerifyResult(res);
      if (res.authentic) {
        toast.success('Blockchain Cryptographic Verification Successful!');
      } else {
        toast.error('Cryptographic signature NOT found on immutable ledger.');
      }
    } catch {
      toast.error('Verification query failed');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#070b14] text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xl border border-emerald-500/30">
              <FaShieldAlt />
            </span>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Digital Document Vault & Blockchain Ledger
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Tamper-Proof Academic Credentials, QR Verification & Immutable Merkle Hash Explorer
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowIssueModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-900/30 flex items-center gap-2"
          >
            <FaPlus /> Issue Verifiable Credential
          </button>
        </div>
      </div>

      {/* Instant Cryptographic Hash Verification Explorer */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
            Public Cryptographic SHA-256 Ledger Verifier
          </span>
          <span className="text-xxs font-mono text-slate-400">Smart Contract: 0x71C7...976F</span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={verifyHashInput}
            onChange={e => setVerifyHashInput(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            placeholder="Paste SHA-256 Transaction Hash (0x...) to verify tamper-proof authenticity..."
          />
          <button
            onClick={handleVerifyHash}
            disabled={verifying}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-2"
          >
            {verifying ? 'Querying Merkle Tree...' : 'Verify on Ledger'}
          </button>
        </div>

        {verifyResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-4 rounded-2xl border ${verifyResult.authentic ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-rose-950/20 border-rose-500/40'} space-y-2`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xl ${verifyResult.authentic ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {verifyResult.authentic ? <FaCheckCircle /> : <FaTimes />}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {verifyResult.authentic ? 'Certificate Authenticity Guaranteed by EduVerse Blockchain' : 'Invalid or Tampered Hash Record'}
                  </h4>
                  {verifyResult.document && (
                    <p className="text-xxs text-slate-300 font-mono">
                      Issued to: <strong>{verifyResult.document.studentName}</strong> · Type: {verifyResult.document.docType}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-xxs font-mono bg-slate-900 px-2 py-1 rounded text-slate-400">
                Block #{verifyResult.ledgerProof?.blockNumber || 'N/A'}
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Document Vault Records */}
      <div className="space-y-4">
        <span className="text-xs font-black uppercase text-slate-300">Vault Credentials in Active Circulation</span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {documents.map((doc, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xxs font-mono font-bold">
                    {doc.docType}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{doc.title}</h3>
                  <p className="text-xxs text-slate-400 font-mono mt-0.5">Recipient: {doc.studentName}</p>
                </div>
                <div className="p-2 bg-white rounded-xl text-black">
                  <FaQrcode className="text-2xl" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1 font-mono text-xxs">
                <div className="flex justify-between text-slate-400">
                  <span>Tx Hash:</span>
                  <span className="text-emerald-400 truncate max-w-[200px]">{doc.blockchainLedger?.txHash}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Block: #{doc.blockchainLedger?.blockNumber}</span>
                  <span className="text-cyan-400">Consensus: Immutable</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    setVerifyHashInput(doc.blockchainLedger?.txHash || '');
                    toast.success('Hash copied to verifier!');
                  }}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xxs font-bold transition border border-slate-700"
                >
                  Verify Hash
                </button>
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xxs font-bold transition flex items-center gap-1.5"
                >
                  <FaFilePdf /> View Doc
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Issue Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Issue Verifiable Academic Credential</h3>
              <button onClick={() => setShowIssueModal(false)} className="text-slate-400 hover:text-white"><FaTimes /></button>
            </div>

            <form onSubmit={handleIssueDoc} className="space-y-3">
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Student Recipient Name</label>
                <input value={studentName} onChange={e => setStudentName(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" required />
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Document Type</label>
                <select value={docType} onChange={e => setDocType(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-bold">
                  {['Degree Certificate', 'Mark Sheet', 'Bonafide', 'Transfer Certificate', 'Fee Receipt', 'Internship Certificate'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xxs uppercase font-bold text-slate-400">Credential Title / Description</label>
                <input value={docTitle} onChange={e => setDocTitle(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" required />
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition">
                Notarize & Dispatch to Blockchain Vault
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
