import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('eduverse_a11y_contrast') === 'true';
  });
  const [largeText, setLargeText] = useState(() => {
    return localStorage.getItem('eduverse_a11y_text') === 'true';
  });
  const [reducedMotion, setReducedMotion] = useState(() => {
    return localStorage.getItem('eduverse_a11y_motion') === 'true';
  });
  const [focusIndicators, setFocusIndicators] = useState(() => {
    return localStorage.getItem('eduverse_a11y_focus') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('eduverse_a11y_contrast', highContrast);
    if (highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('eduverse_a11y_text', largeText);
    if (largeText) {
      document.documentElement.classList.add('large-text-mode');
    } else {
      document.documentElement.classList.remove('large-text-mode');
    }
  }, [largeText]);

  useEffect(() => {
    localStorage.setItem('eduverse_a11y_motion', reducedMotion);
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion-mode');
    } else {
      document.documentElement.classList.remove('reduced-motion-mode');
    }
  }, [reducedMotion]);

  useEffect(() => {
    localStorage.setItem('eduverse_a11y_focus', focusIndicators);
    if (focusIndicators) {
      document.documentElement.classList.add('enhanced-focus-mode');
    } else {
      document.documentElement.classList.remove('enhanced-focus-mode');
    }
  }, [focusIndicators]);

  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const toggleLargeText = () => setLargeText(prev => !prev);
  const toggleReducedMotion = () => setReducedMotion(prev => !prev);
  const toggleFocusIndicators = () => setFocusIndicators(prev => !prev);

  return (
    <AccessibilityContext.Provider value={{
      highContrast, toggleHighContrast,
      largeText, toggleLargeText,
      reducedMotion, toggleReducedMotion,
      focusIndicators, toggleFocusIndicators
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
