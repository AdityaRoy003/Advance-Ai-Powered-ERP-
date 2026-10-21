import React, { createContext, useContext, useState } from 'react';
import ReportIssueModal from '../components/support/ReportIssueModal';
import TermsOfServiceModal from '../components/legal/TermsOfServiceModal';

const SupportModalContext = createContext();

export const SupportModalProvider = ({ children }) => {
  const [showReportIssueModal, setShowReportIssueModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const openReportIssueModal = () => setShowReportIssueModal(true);
  const closeReportIssueModal = () => setShowReportIssueModal(false);

  const openTermsModal = () => setShowTermsModal(true);
  const closeTermsModal = () => setShowTermsModal(false);

  return (
    <SupportModalContext.Provider
      value={{
        showReportIssueModal,
        openReportIssueModal,
        closeReportIssueModal,
        showTermsModal,
        openTermsModal,
        closeTermsModal
      }}
    >
      {children}
      <ReportIssueModal 
        isOpen={showReportIssueModal} 
        onClose={closeReportIssueModal} 
      />
      <TermsOfServiceModal 
        isOpen={showTermsModal} 
        onClose={closeTermsModal} 
      />
    </SupportModalContext.Provider>
  );
};

export const useSupportModals = () => {
  const context = useContext(SupportModalContext);
  if (!context) {
    // Provide safe fallbacks if accessed outside provider
    return {
      openReportIssueModal: () => console.warn('SupportModalProvider not mounted'),
      closeReportIssueModal: () => {},
      openTermsModal: () => console.warn('SupportModalProvider not mounted'),
      closeTermsModal: () => {}
    };
  }
  return context;
};

export default SupportModalContext;
