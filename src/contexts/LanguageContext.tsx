import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ta';

interface LanguageContextProps {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

// Basic translations mapped
const translations = {
  en: {
    dashboard: "Dashboard",
    wasteSummary: "Waste Summary",
    totalWaste: "Total Waste Generated",
    rewardPoints: "Reward Points",
    nextPickup: "Next Pickup",
    recentLogs: "Recent Logs",
    binStatus: "Bin Status",
    aiChat: "AI Chat Assistant",
    typeYourMessage: "Type your message...",
    send: "Send",
    householdId: "Household ID"
  },
  ta: {
    dashboard: "முகப்பு",
    wasteSummary: "கழிவு சுருக்கம்",
    totalWaste: "மொத்த கழிவு",
    rewardPoints: "சலுகை புள்ளிகள்",
    nextPickup: "அடுத்த சேகரிப்பு",
    recentLogs: "சமீபத்திய தேர்வுகள்",
    binStatus: "தொட்டி நிலை",
    aiChat: "செயற்கை நுண்ணறிவு உதவியாளர்",
    typeYourMessage: "உங்கள் செய்தியை தட்டச்சு செய்க...",
    send: "அனுப்பு",
    householdId: "வீட்டு அடையாள எண்"
  }
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => setLanguage(prev => (prev === 'en' ? 'ta' : 'en'));

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
