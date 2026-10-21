import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCloudUploadAlt, FaFileCsv, FaFileExcel, FaCheckCircle,
  FaExclamationTriangle, FaArrowRight, FaSyncAlt, FaDownload,
  FaDatabase, FaUsers, FaGraduationCap, FaBook, FaCheck
} from 'react-icons/fa';
import { MigrationAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ENTITY_CONFIGS = {
  students: {
    label: 'Students Directory',
    icon: <FaGraduationCap />,
    requiredFields: ['firstName', 'email'],
    sampleData: `firstName,lastName,email,phone,program,semester\nAditya,Roy,aditya.roy@example.edu,+919876543210,CSE,4\nAnanya,Mehta,ananya.mehta@example.edu,+919876543211,ECE,2\nRohan,Kulkarni,rohan.kulkarni@example.edu,+919876543212,AI,1`
  },
  faculty: {
    label: 'Faculty & Professors',
    icon: <FaUsers />,
    requiredFields: ['firstName', 'email'],
    sampleData: `firstName,lastName,email,department,designation\nDr. Priya,Nair,priya.nair@example.edu,Computer Science,Associate Professor\nDr. Vikram,Sengupta,vikram.sengupta@example.edu,Management,Dean\nProf. Sarah,Connor,sarah.connor@example.edu,Artificial Intelligence,Head of Dept`
  },
  courses: {
    label: 'Academic Courses & Curriculum',
    icon: <FaBook />,
    requiredFields: ['code', 'title'],
    sampleData: `code,title,department,credits,semester\nCS401,Distributed Systems Architecture,Computer Science,4,5\nAI302,Natural Language Processing with LLMs,Artificial Intelligence,4,4\nEC201,Digital Signal Processing,Electronics,3,3`
  }
};

export default function DataMigrationEngine() {
  const [selectedEntity, setSelectedEntity] = useState('students');
  const [csvContent, setCsvContent] = useState('');
  const [parsedRows, setParsedRows] = useState([]);
  const [validationResult, setValidationResult] = useState(null);
  const [validating, setValidating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(null);

  const handleLoadSample = () => {
    const sample = ENTITY_CONFIGS[selectedEntity].sampleData;
    setCsvContent(sample);
    parseCSV(sample);
  };

  const parseCSV = (text) => {
    try {
      const lines = text.trim().split('\n');
      if (lines.length < 2) {
        setParsedRows([]);
        return;
      }
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const rows = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const obj = {};
        headers.forEach((h, idx) => {
          obj[h] = values[idx] || '';
        });
        rows.push(obj);
      }
      setParsedRows(rows);
      setValidationResult(null);
      setImportSuccess(null);
    } catch (e) {
      toast.error('Failed to parse CSV format');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      setCsvContent(content);
      parseCSV(content);
    };
    reader.readAsText(file);
  };

  const handleDryRunValidation = async () => {
    if (parsedRows.length === 0) {
      toast.error('Please upload or paste CSV rows first');
      return;
    }
    setValidating(true);
    try {
      const res = await MigrationAPI.validate(selectedEntity, parsedRows);
      setValidationResult(res);
      if (res?.hasErrors) {
        toast.error(`Found ${res.invalidCount} rows with schema validation issues.`);
      } else {
        toast.success(`All ${res.validCount} rows validated successfully! Ready to import.`);
      }
    } catch (err) {
      toast.error('Validation request failed');
    } finally {
      setValidating(false);
    }
  };

  const handleExecuteImport = async () => {
    if (!validationResult || validationResult.hasErrors) {
      toast.error('Please resolve validation errors before executing import');
      return;
    }
    setImporting(true);
    try {
      const res = await MigrationAPI.execute(selectedEntity, parsedRows);
      setImportSuccess(res);
      toast.success(`🎉 ${res.importedCount} records imported successfully into EduVerse!`);
    } catch (err) {
      toast.error('Import failed');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 font-sans max-w-7xl mx-auto">
      
      {/* ─── HEADER ─── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 text-lg">
              <FaCloudUploadAlt />
            </span>
            <span className="text-xxs font-mono font-bold uppercase tracking-wider text-indigo-400">
              BULK DATA INGESTION & ETL MIGRATION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Bulk CSV / Excel Migration Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Zero-friction legacy data onboarding with interactive auto-mapping and dry-run error validation.
          </p>
        </div>

        <button
          onClick={handleLoadSample}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition flex items-center gap-2"
        >
          <FaDownload /> Load Demo {ENTITY_CONFIGS[selectedEntity].label} Sample
        </button>
      </div>

      {/* ─── ENTITY SELECTOR ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(ENTITY_CONFIGS).map(([key, config]) => {
          const isSelected = selectedEntity === key;
          return (
            <button
              key={key}
              onClick={() => {
                setSelectedEntity(key);
                setParsedRows([]);
                setValidationResult(null);
                setImportSuccess(null);
              }}
              className={`p-4 rounded-2xl border-2 transition text-left flex items-center gap-3.5 ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10 text-white'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/60 text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                {config.icon}
              </span>
              <div>
                <p className="font-bold text-xs text-slate-900 dark:text-white">{config.label}</p>
                <p className="text-xxs text-slate-500 font-mono">Target: {key.toUpperCase()}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── CSV FILE UPLOADER & TEXT EDITOR ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Dropzone */}
        <div className="p-6 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0f172a]/60 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-3xl">
            <FaFileCsv />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Upload CSV or Excel Export</h3>
            <p className="text-xs text-slate-400 mt-1">Supports standard RFC 4180 CSV files up to 50,000 rows.</p>
          </div>
          <label className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer shadow-md">
            <span>Browse Computer</span>
            <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Live Paste & Raw Content */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a]/60 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Or Paste Raw CSV Data</span>
            <span className="text-xxs font-mono text-indigo-400">{parsedRows.length} Rows Detected</span>
          </div>
          <textarea
            rows={6}
            value={csvContent}
            onChange={(e) => {
              setCsvContent(e.target.value);
              parseCSV(e.target.value);
            }}
            placeholder="paste CSV data here with headers on line 1..."
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200"
          />
          <button
            onClick={handleDryRunValidation}
            disabled={validating || parsedRows.length === 0}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {validating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running Dry-Run Validation...</span>
              </>
            ) : (
              <>
                <FaSyncAlt />
                <span>Run Schema Dry-Run Validation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── VALIDATION RESULTS & PREVIEW ─── */}
      {validationResult && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a]/80 backdrop-blur-xl shadow-xl space-y-6"
        >
          {/* Status Metrics Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                validationResult.hasErrors ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {validationResult.hasErrors ? <FaExclamationTriangle /> : <FaCheckCircle />}
              </span>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {validationResult.hasErrors ? 'Validation Errors Encountered' : 'Schema Passed Dry-Run Validation'}
                </h4>
                <p className="text-xxs text-slate-400">
                  {validationResult.validCount} valid records • {validationResult.invalidCount} error rows detected.
                </p>
              </div>
            </div>

            <button
              onClick={handleExecuteImport}
              disabled={importing || validationResult.hasErrors}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/30 disabled:opacity-40 flex items-center gap-2"
            >
              {importing ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Importing Batch...</span>
                </>
              ) : (
                <>
                  <FaDatabase />
                  <span>Execute 1-Click Import ({validationResult.validCount} Records)</span>
                </>
              )}
            </button>
          </div>

          {/* Error Log if any */}
          {validationResult.hasErrors && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Detected Row Anomalies:</span>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1 max-h-40 overflow-y-auto">
                {validationResult.errors.map((err, idx) => (
                  <p key={idx} className="text-xxs text-rose-300 font-mono">
                    ● Row #{err.row} [{err.field}]: {err.message}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Data Preview Table */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Preview Parsed Payload (First 10 Rows):</span>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-400 text-xxs uppercase">
                  <tr>
                    {Object.keys(parsedRows[0] || {}).map((col, i) => (
                      <th key={i} className="p-3 border-b border-slate-200 dark:border-slate-800">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {parsedRows.slice(0, 10).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      {Object.values(row).map((val, cIdx) => (
                        <td key={cIdx} className="p-3 truncate max-w-[200px] text-slate-800 dark:text-slate-200">{String(val)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── IMPORT SUCCESS BANNER ─── */}
      {importSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900/40 border border-emerald-500/30 text-white space-y-2"
        >
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <FaCheckCircle className="text-xl" />
            <h4 className="text-lg font-black">Data Migration Successfully Completed!</h4>
          </div>
          <p className="text-xs text-slate-300">
            Imported {importSuccess.importedCount} {importSuccess.targetEntity} records into the multi-tenant database.
            Accounts have been provisioned with credentials and scoped under your active campus.
          </p>
        </motion.div>
      )}

    </div>
  );
}
