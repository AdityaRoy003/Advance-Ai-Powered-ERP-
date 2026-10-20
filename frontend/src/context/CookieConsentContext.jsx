import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { PrivacyAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CookieConsentContext = createContext();

const STORAGE_KEY = 'eduverse_cookie_consent';
const VISITOR_ID_KEY = 'eduverse_visitor_id';
export const CURRENT_POLICY_VERSION = 'v2.4-2026';

const DEFAULT_CATEGORIES = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false
};

// Generates or retrieves a persistent anonymous visitor identifier
const getOrCreateVisitorId = () => {
  let vid = localStorage.getItem(VISITOR_ID_KEY);
  if (!vid) {
    vid = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem(VISITOR_ID_KEY, vid);
  }
  return vid;
};

export const CookieConsentProvider = ({ children }) => {
  const { user } = useAuth();
  const [visitorId] = useState(getOrCreateVisitorId);

  // Initialize consent state from local storage
  const [consent, setConsent] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure essential is always true and policy version is present
        return {
          essential: true,
          functional: Boolean(parsed.functional),
          analytics: Boolean(parsed.analytics),
          marketing: Boolean(parsed.marketing),
          policyVersion: parsed.policyVersion || CURRENT_POLICY_VERSION,
          updatedAt: parsed.updatedAt || new Date().toISOString()
        };
      }
    } catch (e) {
      console.warn('Error reading cookie consent from storage', e);
    }
    return {
      ...DEFAULT_CATEGORIES,
      policyVersion: CURRENT_POLICY_VERSION,
      updatedAt: null
    };
  });

  const [hasDecided, setHasDecided] = useState(() => {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  });

  const [showBanner, setShowBanner] = useState(!hasDecided);
  const [showModal, setShowModal] = useState(false);
  const [showPolicyDrawer, setShowPolicyDrawer] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync with backend on startup or when user logs in
  useEffect(() => {
    const syncConsentWithServer = async () => {
      try {
        const localRecord = localStorage.getItem(STORAGE_KEY);
        // CRITICAL GUARD: If this device/browser has not yet made an explicit choice,
        // strictly keep the banner visible and NEVER auto-allow optional cookies!
        if (!localRecord) {
          setHasDecided(false);
          setShowBanner(true);
          return;
        }

        const serverConsent = await PrivacyAPI.getConsent(visitorId);
        if (serverConsent && serverConsent.hasConsented && serverConsent.categories) {
          const merged = {
            essential: true,
            functional: Boolean(serverConsent.categories.functional),
            analytics: Boolean(serverConsent.categories.analytics),
            marketing: Boolean(serverConsent.categories.marketing),
            policyVersion: serverConsent.policyVersion || CURRENT_POLICY_VERSION,
            updatedAt: serverConsent.timestamp || new Date().toISOString()
          };
          setConsent(merged);
          setHasDecided(true);
          setShowBanner(false);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        }
      } catch (err) {
        // Fallback to local storage state if backend network is unreachable
      }
    };

    syncConsentWithServer();
  }, [user, visitorId]);

  // Broadcast consent change event for any telemetry / embedding listeners
  const notifyConsentChange = useCallback((updatedCategories) => {
    window.dispatchEvent(
      new CustomEvent('eduverse:consent_change', {
        detail: {
          categories: updatedCategories,
          timestamp: new Date().toISOString()
        }
      })
    );
  }, []);

  // Save consent to storage and backend audit log
  const persistConsent = async (action, categories) => {
    setLoading(true);
    const finalCategories = {
      essential: true, // Always locked
      functional: Boolean(categories.functional),
      analytics: Boolean(categories.analytics),
      marketing: Boolean(categories.marketing)
    };

    const consentPayload = {
      visitorId,
      action,
      categories: finalCategories,
      policyVersion: CURRENT_POLICY_VERSION,
      updatedAt: new Date().toISOString()
    };

    // 1. Save in local state & browser storage
    setConsent({ ...finalCategories, policyVersion: CURRENT_POLICY_VERSION, updatedAt: consentPayload.updatedAt });
    setHasDecided(true);
    setShowBanner(false);
    setShowModal(false);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consentPayload));

    // 2. Dispatch event to ensure no optional telemetry runs without consent
    notifyConsentChange(finalCategories);

    // 3. Post to backend audit record
    try {
      await PrivacyAPI.recordConsent({
        visitorId,
        action,
        categories: finalCategories,
        policyVersion: CURRENT_POLICY_VERSION
      });
    } catch (err) {
      console.warn('Backend consent logging notice:', err);
    } finally {
      setLoading(false);
    }
  };

  const acceptAll = async () => {
    await persistConsent('accept_all', {
      functional: true,
      analytics: true,
      marketing: true
    });
    toast.success('All privacy & cookie preferences accepted.');
  };

  const rejectOptional = async () => {
    await persistConsent('reject_optional', {
      functional: false,
      analytics: false,
      marketing: false
    });
    toast('Optional cookies rejected. Only essential security cookies remain enabled.', {
      icon: '🛡️'
    });
  };

  const saveCustomPreferences = async (customCats) => {
    await persistConsent('custom', customCats);
    toast.success('Custom cookie preferences saved successfully.');
  };

  const withdrawConsent = async () => {
    await persistConsent('withdraw', {
      functional: false,
      analytics: false,
      marketing: false
    });
    toast('Consent withdrawn. All optional cookies disabled.', {
      icon: '🔒'
    });
  };

  const openPreferences = () => {
    setShowModal(true);
  };

  const closePreferences = () => {
    setShowModal(false);
  };

  const openPolicyDrawer = () => {
    setShowPolicyDrawer(true);
  };

  const closePolicyDrawer = () => {
    setShowPolicyDrawer(false);
  };

  const dismissBanner = async () => {
    // Closing or dismissing without explicit acceptance defaults to rejecting optional trackers
    await rejectOptional();
  };

  const isAllowed = (category) => {
    if (category === 'essential') return true;
    if (!hasDecided) return false;
    return Boolean(consent[category]);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        hasDecided,
        showBanner,
        showModal,
        showPolicyDrawer,
        loading,
        visitorId,
        policyVersion: CURRENT_POLICY_VERSION,
        acceptAll,
        rejectOptional,
        saveCustomPreferences,
        withdrawConsent,
        dismissBanner,
        openPreferences,
        closePreferences,
        openModal: openPreferences,
        closeModal: closePreferences,
        openPolicyDrawer,
        closePolicyDrawer,
        isAllowed
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};

export default CookieConsentContext;
