import React, { useState, useEffect } from 'react';
import { 
  Users, Briefcase, HeartHandshake, Search, Building2, MapPin, 
  Award, Sparkles, Filter, ExternalLink, Send, DollarSign, CheckCircle2 
} from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import { AlumniAPI } from '../../services/api';

export default function AlumniNetworkHub() {
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'referrals' | 'endowment'
  const [directory, setDirectory] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [endowments, setEndowments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('ALL');
  const [selectedBatch, setSelectedBatch] = useState('ALL');

  // Referral Modal
  const [referralTarget, setReferralTarget] = useState(null);
  const [pitchMessage, setPitchMessage] = useState('');
  const [resumeUrl, setResumeUrl] = useState('https://erp.portal/resumes/my-resume-2024.pdf');
  const [referralSent, setReferralSent] = useState(false);

  // Pledge Modal
  const [pledgeTarget, setPledgeTarget] = useState(null);
  const [pledgeAmount, setPledgeAmount] = useState(5000);
  const [pledgeDonorName, setPledgeDonorName] = useState('Pooja Nair (Batch of 2018)');
  const [pledgeSuccess, setPledgeSuccess] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [dirRes, jobsRes, endRes] = await Promise.all([
        AlumniAPI.getDirectory(),
        AlumniAPI.getJobs(),
        AlumniAPI.getEndowments()
      ]);
      if (dirRes?.data?.success) setDirectory(dirRes.data.data);
      if (jobsRes?.data?.success) setJobs(jobsRes.data.data);
      if (endRes?.data?.success) setEndowments(endRes.data.data);
    } catch (err) {
      console.error('Failed to load alumni data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReferral = (e) => {
    e.preventDefault();
    setReferralSent(true);
    setTimeout(() => {
      setReferralSent(false);
      setReferralTarget(null);
      setPitchMessage('');
    }, 1500);
  };

  const handlePledgeSubmit = async (e) => {
    e.preventDefault();
    if (!pledgeTarget) return;
    try {
      const res = await AlumniAPI.pledge({
        campaignId: pledgeTarget.id,
        amount: Number(pledgeAmount),
        donorName: pledgeDonorName
      });
      if (res?.data?.success) {
        setPledgeSuccess(true);
        // Update local campaign progress
        setEndowments(prev => prev.map(c => {
          if (c.id === pledgeTarget.id) {
            return {
              ...c,
              raised: c.raised + Number(pledgeAmount),
              donorsCount: c.donorsCount + 1
            };
          }
          return c;
        }));
        setTimeout(() => {
          setPledgeSuccess(false);
          setPledgeTarget(null);
        }, 1500);
      }
    } catch (err) {
      console.error('Pledge error:', err);
    }
  };

  const filteredDirectory = directory.filter(alumnus => {
    const matchesSearch = !search || 
      alumnus.name?.toLowerCase().includes(search.toLowerCase()) ||
      alumnus.company?.toLowerCase().includes(search.toLowerCase()) ||
      alumnus.role?.toLowerCase().includes(search.toLowerCase());
    const matchesCompany = selectedCompany === 'ALL' || alumnus.company === selectedCompany;
    const matchesBatch = selectedBatch === 'ALL' || String(alumnus.batch) === selectedBatch;
    return matchesSearch && matchesCompany && matchesBatch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Institutional Alumni Community
            </span>
            <span className="text-xs text-gray-400">14,200+ Global Graduates</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">
            Alumni Network, Job Referrals & Endowment Portal
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Connect graduating batches with tech leaders, facilitate internal enterprise job referrals, and pledge capital to campus endowment funds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-2 ${
              activeTab === 'directory' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Alumni Directory
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-2 ${
              activeTab === 'referrals' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Referrals Board
          </button>
          <button
            onClick={() => setActiveTab('endowment')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-2 ${
              activeTab === 'endowment' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            Endowment Campaigns
          </button>
        </div>
      </div>

      {/* Tab 1: Alumni Directory */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search alumni by name, role, or company..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="ALL">All Companies</option>
              <option value="Google">Google</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Amazon">Amazon</option>
              <option value="NVIDIA">NVIDIA</option>
              <option value="Apple">Apple</option>
            </select>

            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="ALL">All Batches</option>
              <option value="2016">Batch of 2016</option>
              <option value="2018">Batch of 2018</option>
              <option value="2020">Batch of 2020</option>
              <option value="2022">Batch of 2022</option>
            </select>
          </div>

          {/* Alumni Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDirectory.map((alumnus) => (
              <div 
                key={alumnus.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:border-blue-500/50 transition space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm border border-blue-200 dark:border-blue-900">
                      {alumnus.name?.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        {alumnus.name}
                      </h4>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-blue-500" />
                        {alumnus.company}
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    '{alumnus.batch}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-gray-700 dark:text-gray-300 font-medium">
                    {alumnus.role}
                  </div>
                  <div className="text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {alumnus.location || 'San Francisco, CA'} • {alumnus.department}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                  {alumnus.willingToMentor ? (
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Open to Mentoring
                    </span>
                  ) : (
                    <span className="text-[11px] text-gray-400">Alumni Member</span>
                  )}

                  <a 
                    href={`https://linkedin.com/search/results/all/?keywords=${encodeURIComponent(alumnus.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline text-xs"
                  >
                    <FaLinkedin className="w-3.5 h-3.5" />
                    Connect
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Job Referrals Board */}
      {activeTab === 'referrals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Active Internal Job Referrals
              </h3>
              <p className="text-xs text-gray-500">
                Alumni posted positions with guaranteed internal referral recommendations.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-md font-semibold">
              {jobs.length} Verified Openings
            </span>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => (
              <div 
                key={job.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-500/40 transition"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {job.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                      {job.company}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      {job.type || 'Full-time'}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400 max-w-2xl">
                    {job.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-gray-500 pt-1">
                    <span>Location: <strong className="text-gray-700 dark:text-gray-300">{job.location}</strong></span>
                    <span>Experience: <strong className="text-gray-700 dark:text-gray-300">{job.experience || '1-3 Years'}</strong></span>
                    <span>Referrer: <strong className="text-blue-600 dark:text-blue-400">{job.postedBy}</strong></span>
                  </div>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => setReferralTarget(job)}
                    className="w-full md:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Request Referral
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Endowment Fundraising Campaigns */}
      {activeTab === 'endowment' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                Institutional Giving & Legacy
              </span>
              <h3 className="text-xl font-bold">
                Campus Capital Endowment & Scholarship Funds
              </h3>
              <p className="text-xs text-blue-100 max-w-xl">
                Alumni contributions fuel next-generation quantum computing labs, need-blind student scholarships, and research incubators.
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-3xl font-extrabold">₹1.84 Cr</div>
              <div className="text-xs text-blue-200">Raised Across 2024 Initiatives</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {endowments.map((campaign) => {
              const progressPct = Math.min(100, Math.round((campaign.raised / campaign.target) * 100));
              return (
                <div 
                  key={campaign.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {campaign.category || 'Infrastructure'}
                    </span>
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">
                      {campaign.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {campaign.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-gray-900 dark:text-white">
                          ₹{(campaign.raised / 100000).toFixed(1)} Lakhs
                        </span>
                        <span className="text-gray-500">
                          Target: ₹{(campaign.target / 100000).toFixed(1)}L ({progressPct}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{campaign.donorsCount} Alumni Donors</span>
                      <button
                        onClick={() => setPledgeTarget(campaign)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-sm transition"
                      >
                        Pledge / Donate
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Referral Request Modal */}
      {referralTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Request Internal Referral
            </h3>
            <p className="text-xs text-gray-500">
              Apply to <strong>{referralTarget.title}</strong> at <strong>{referralTarget.company}</strong> via alumnus <strong>{referralTarget.postedBy}</strong>.
            </p>

            {referralSent ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 rounded-lg text-center space-y-1 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <div className="font-bold text-sm">Referral Packet Sent!</div>
                <div className="text-xs">The alumnus has received your resume and statement.</div>
              </div>
            ) : (
              <form onSubmit={handleSendReferral} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                    Quick Pitch / Why You're a Fit
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={pitchMessage}
                    onChange={(e) => setPitchMessage(e.target.value)}
                    placeholder="Describe your relevant projects, GPA, or internship accomplishments..."
                    className="w-full p-2.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                    Student Resume Document Link
                  </label>
                  <input
                    type="text"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReferralTarget(null)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                  >
                    Submit Referral Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Pledge Modal */}
      {pledgeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Pledge to {pledgeTarget.title}
            </h3>

            {pledgeSuccess ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 rounded-lg text-center space-y-1 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <div className="font-bold text-sm">Thank You For Your Contribution!</div>
                <div className="text-xs">Your endowment pledge has been recorded with official 80G tax exemption receipt.</div>
              </div>
            ) : (
              <form onSubmit={handlePledgeSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                    Donor Name & Batch
                  </label>
                  <input
                    type="text"
                    required
                    value={pledgeDonorName}
                    onChange={(e) => setPledgeDonorName(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                    Pledge Contribution (INR ₹)
                  </label>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    required
                    value={pledgeAmount}
                    onChange={(e) => setPledgeAmount(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setPledgeTarget(null)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                  >
                    Confirm Pledge
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
