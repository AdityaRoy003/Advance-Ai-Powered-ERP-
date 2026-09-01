import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'ta', label: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'te', label: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'bn', label: 'বাংলা (Bengali)', flag: '🇮🇳' }
];

export const TRANSLATIONS = {
  en: {
    welcome: 'Welcome to EduVerse AI ERP',
    dashboard: 'Dashboard',
    attendance: 'Attendance',
    exams: 'Exams & Grades',
    finance: 'Finance & Fees',
    smartMess: 'Smart Mess & Cafeteria',
    iotCampus: 'Smart Campus IoT',
    sustainability: 'Sustainability & Carbon',
    facilities: 'Facilities & Maintenance',
    inventory: 'Inventory & Procurement',
    workflows: 'Autonomous Workflows',
    integrations: 'Integrations & Plugins',
    devPortal: 'Developer Portal',
    executiveHub: 'Executive Command Center',
    itAssistant: 'IT Assistant & MLOps',
    privacyCenter: 'Privacy & Data Protection',
    community: 'Campus Social Community',
    gamification: 'Student Achievements & XP',
    searchPlaceholder: 'Search anything... students, fees, courses, books',
    statusOnline: 'Online',
    saveChanges: 'Save Changes'
  },
  hi: {
    welcome: 'एडूवर्स एआई ईआरपी में आपका स्वागत है',
    dashboard: 'डैशबोर्ड',
    attendance: 'उपस्थिति',
    exams: 'परीक्षा और ग्रेड',
    finance: 'वित्त और शुल्क',
    smartMess: 'स्मार्ट मेस और कैफेटेरिया',
    iotCampus: 'स्मार्ट कैंपस आईओटी',
    sustainability: 'सस्टेनेबिलिटी और कार्बन',
    facilities: 'सुविधाएं और रखरखाव',
    inventory: 'इन्वेंटरी और खरीद',
    workflows: 'स्वचालित कार्यप्रवाह',
    integrations: 'प्लगइन्स और एकीकरण',
    devPortal: 'डेवलपर पोर्टल',
    executiveHub: 'कार्यकारी कमांड सेंटर',
    itAssistant: 'आईटी सहायक और एमएलऑप्स',
    privacyCenter: 'गोपनीयता और डेटा सुरक्षा',
    community: 'कैंपस सामाजिक नेटवर्क',
    gamification: 'छात्र उपलब्धियां और एक्सपी',
    searchPlaceholder: 'कुछ भी खोजें... छात्र, शुल्क, पाठ्यक्रम, किताबें',
    statusOnline: 'सक्रिय',
    saveChanges: 'परिवर्तन सहेजें'
  },
  ta: {
    welcome: 'எடுவர்ஸ் AI ERP க்கு வரவேற்கிறோம்',
    dashboard: 'முகப்புப்பலகை',
    attendance: 'வருகைப்பதிவு',
    exams: 'தேர்வுகள் மற்றும் மதிப்பெண்கள்',
    finance: 'நிதி மற்றும் கட்டணம்',
    smartMess: 'ஸ்மார்ட் உணவுக்கூடம்',
    iotCampus: 'ஸ்மார்ட் வளாக IoT',
    sustainability: 'நிலைத்தன்மை மற்றும் கார்பன்',
    facilities: 'வசதிகள் மற்றும் பராமரிப்பு',
    inventory: 'சரக்கு மேலாண்மை',
    workflows: 'தானியங்கி பணிப்பாய்வு',
    integrations: 'இணைப்புகள்',
    devPortal: 'டெவலப்பர் தளம்',
    executiveHub: 'நிர்வாக மையம்',
    itAssistant: 'IT உதவியாளர்',
    privacyCenter: 'தனியுரிமை மையம்',
    community: 'வளாக சமூகம்',
    gamification: 'மாணவர் சாதனைகள்',
    searchPlaceholder: 'தேடுக... மாணவர்கள், கட்டணம், புத்தகங்கள்',
    statusOnline: 'செயலில்',
    saveChanges: 'சேமிக்க'
  },
  te: {
    welcome: 'ఎడువర్స్ AI ERP కి స్వాగతం',
    dashboard: 'డాష్‌బోర్డ్',
    attendance: 'హాజరు',
    exams: 'పరీక్షలు & గ్రేడులు',
    finance: 'ఆర్థిక మరియు ఫీజులు',
    smartMess: 'స్మార్ట్ మెస్ & కేఫెటేరియా',
    iotCampus: 'స్మార్ట్ క్యాంపస్ IoT',
    sustainability: 'సుస్థిరత & కార్బన్',
    facilities: 'సౌకర్యాలు & నిర్వహణ',
    inventory: 'ఇన్వెంటరీ & కొనుగోలు',
    workflows: 'వర్క్‌ఫ్లో ఆటోమేషన్',
    integrations: 'ప్లగిన్లు',
    devPortal: 'డెవలపర్ పోర్టల్',
    executiveHub: 'ఎగ్జిక్యూటివ్ కమాండ్ సెంటర్',
    itAssistant: 'IT అసిస్టెంట్',
    privacyCenter: 'గోప్యతా కేంద్రం',
    community: 'క్యాంపస్ సంఘం',
    gamification: 'విద్యార్థి విజయాలు',
    searchPlaceholder: 'శోధించండి... విద్యార్థులు, ఫీజులు',
    statusOnline: 'ఆన్‌లైన్',
    saveChanges: 'సేవ్ చేయండి'
  },
  mr: {
    welcome: 'एडूव्हर्स AI ERP मध्ये आपले स्वागत आहे',
    dashboard: 'डॅशबोर्ड',
    attendance: 'उपस्थिती',
    exams: 'परीक्षा आणि श्रेणी',
    finance: 'वित्त आणि शुल्क',
    smartMess: 'स्मार्ट मेस आणि कॅफेटेरिया',
    iotCampus: 'स्मार्ट कॅम्पस IoT',
    sustainability: 'सस्टेनेबिलिटी आणि कार्बन',
    facilities: 'सुविधा आणि देखभाल',
    inventory: 'इन्व्हेंटरी आणि खरेदी',
    workflows: 'ऑटोमेशन वर्कफ्लो',
    integrations: 'एकत्रीकरण प्लगइन्स',
    devPortal: 'डेव्हलपर पोर्टल',
    executiveHub: 'कार्यकारी कमांड सेंटर',
    itAssistant: 'आयटी असिस्टंट',
    privacyCenter: 'गोपनीयता केंद्र',
    community: 'कॅम्पस समुदाय',
    gamification: 'विद्यार्थी यश',
    searchPlaceholder: 'शोधा... विद्यार्थी, फी, पुस्तके',
    statusOnline: 'सक्रिय',
    saveChanges: 'बदल जतन करा'
  },
  bn: {
    welcome: 'এডুভার্স এআই ইআরপিতে স্বাগতম',
    dashboard: 'ড্যাশবোর্ড',
    attendance: 'উপস্থিতি',
    exams: 'পরীক্ষা ও গ্রেড',
    finance: 'অর্থ ও ফি',
    smartMess: 'স্মার্ট মেস ও ক্যাফেটেরিয়া',
    iotCampus: 'স্মার্ট ক্যাম্পাস আইওটি',
    sustainability: 'স্থায়িত্ব ও কার্বন',
    facilities: 'সুবিধা ও রক্ষণাবেক্ষণ',
    inventory: 'ইনভেন্টরি ও ক্রয়',
    workflows: 'স্বয়ংক্রিয় কর্মপ্রবাহ',
    integrations: 'প্লাগইন ও ইন্টিগ্রেশন',
    devPortal: 'ডেভেলপার পোর্টাল',
    executiveHub: 'এক্সিকিউটিভ কমান্ড সেন্টার',
    itAssistant: 'আইটি সহকারী ও এমএলঅপস',
    privacyCenter: 'গোপনীয়তা কেন্দ্র',
    community: 'ক্যাম্পাস সোশ্যাল কমিউনিটি',
    gamification: 'শিক্ষার্থী অর্জন ও এক্সপি',
    searchPlaceholder: 'অনুসন্ধান করুন... ছাত্র, ফি, কোর্স',
    statusOnline: 'সক্রিয়',
    saveChanges: 'সংরক্ষণ করুন'
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('eduverse_lang') || 'en';
  });

  const changeLanguage = (langCode) => {
    setCurrentLang(langCode);
    localStorage.setItem('eduverse_lang', langCode);
  };

  const t = (key) => {
    const langObj = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    return langObj[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLang, changeLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
