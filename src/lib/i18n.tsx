'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'te';

const translations = {
  en: {
    heroBadge: 'Next-Generation Legal Intelligence Platform',
    tagline: 'Understand. Compare. Verify. Act.',
    heroDescription: 'Turn complex legal documents into plain-language explanations, risk insights, evidence-backed answers, actionable checklists, and lawyer-ready preparation.',
    upload: 'Upload a Document',
    demo: 'Try Synthetic Demo (v1 vs v2)',
    disclaimer: 'LegalLens provides legal information and document assistance. It does not replace a qualified legal professional.',
    quickAnalysis: 'Quick Document Analysis',
    quickAnalysisDescription: 'Upload any contract or select a pre-loaded synthetic case',
    confidential: 'Confidential Local Processing',
    trustStandard: 'The Trust Standard',
    explainVerifyAct: 'Explain -> Verify -> Act',
    trustDescription: 'Never guess. Every AI claim is strictly traced to the source page, exact clause, and official statutory authorities.',
    multilingual: 'Multilingual Access',
    nativeLanguage: 'Understand Legal Documents in Your Native Language',
    multilingualDescription: 'Full translation and vernacular reasoning support for English, Hindi, and Telugu with precision statutory preservation.',
  },
  hi: {
    heroBadge: 'अगली पीढ़ी का कानूनी बुद्धिमत्ता मंच',
    tagline: 'समझें। तुलना करें। सत्यापित करें। कार्रवाई करें।',
    heroDescription: 'जटिल कानूनी दस्तावेज़ों को सरल भाषा में स्पष्टीकरण, जोखिम संबंधी जानकारी, प्रमाण-आधारित उत्तर, उपयोगी चेकलिस्ट और वकील की तैयारी में बदलें।',
    upload: 'दस्तावेज़ अपलोड करें',
    demo: 'सिंथेटिक डेमो आज़माएँ (v1 बनाम v2)',
    disclaimer: 'LegalLens कानूनी जानकारी और दस्तावेज़ सहायता देता है। यह योग्य कानूनी पेशेवर का विकल्प नहीं है।',
    quickAnalysis: 'त्वरित दस्तावेज़ विश्लेषण',
    quickAnalysisDescription: 'कोई भी अनुबंध अपलोड करें या पहले से लोड किया गया सिंथेटिक मामला चुनें',
    confidential: 'गोपनीय स्थानीय प्रसंस्करण',
    trustStandard: 'विश्वास का मानक',
    explainVerifyAct: 'समझें -> सत्यापित करें -> कार्रवाई करें',
    trustDescription: 'अनुमान न लगाएँ। हर AI दावे का स्रोत पृष्ठ, सटीक खंड और आधिकारिक वैधानिक प्राधिकरणों से मिलान किया जाता है।',
    multilingual: 'बहुभाषी सुविधा',
    nativeLanguage: 'अपनी मातृभाषा में कानूनी दस्तावेज़ समझें',
    multilingualDescription: 'अंग्रेज़ी, हिंदी और तेलुगु के लिए सटीक वैधानिक संरक्षण के साथ पूर्ण अनुवाद और स्थानीय भाषा में तर्क सहायता।',
  },
  te: {
    heroBadge: 'తరువాతి తరం న్యాయ మేధస్సు వేదిక',
    tagline: 'అర్థం చేసుకోండి. పోల్చండి. ధృవీకరించండి. చర్య తీసుకోండి.',
    heroDescription: 'సంక్లిష్టమైన న్యాయ పత్రాలను సరళమైన వివరణలు, ప్రమాద సమాచారాలు, ఆధారాలతో కూడిన సమాధానాలు, ఉపయోగకరమైన చెక్‌లిస్టులు మరియు న్యాయవాది కోసం సిద్ధతగా మార్చండి.',
    upload: 'పత్రాన్ని అప్‌లోడ్ చేయండి',
    demo: 'సింథటిక్ డెమో ప్రయత్నించండి (v1 వర్సెస్ v2)',
    disclaimer: 'LegalLens న్యాయ సమాచారం మరియు పత్ర సహాయాన్ని అందిస్తుంది. ఇది అర్హత కలిగిన న్యాయ నిపుణుడికి ప్రత్యామ్నాయం కాదు.',
    quickAnalysis: 'త్వరిత పత్ర విశ్లేషణ',
    quickAnalysisDescription: 'ఏదైనా ఒప్పందాన్ని అప్‌లోడ్ చేయండి లేదా ముందుగా లోడ్ చేసిన సింథటిక్ కేసును ఎంచుకోండి',
    confidential: 'గోప్యమైన స్థానిక ప్రాసెసింగ్',
    trustStandard: 'విశ్వసనీయత ప్రమాణం',
    explainVerifyAct: 'వివరించండి -> ధృవీకరించండి -> చర్య తీసుకోండి',
    trustDescription: 'ఊహించవద్దు. ప్రతి AI వాదనను మూల పేజీ, ఖచ్చితమైన క్లాజ్ మరియు అధికారిక చట్టపరమైన ఆధారాలతో పరిశీలిస్తాము.',
    multilingual: 'బహుభాషా ప్రాప్యత',
    nativeLanguage: 'మీ మాతృభాషలో న్యాయ పత్రాలను అర్థం చేసుకోండి',
    multilingualDescription: 'ఆంగ్లం, హిందీ మరియు తెలుగు కోసం ఖచ్చితమైన చట్టపరమైన సంరక్షణతో పూర్తి అనువాదం మరియు స్థానిక భాషా తర్క సహాయం.',
  },
} as const;

type TranslationKey = keyof typeof translations.en;

const I18nContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
} | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  useEffect(() => {
    const stored = window.localStorage.getItem('legallens-language');
    if (stored === 'en' || stored === 'hi' || stored === 'te') setLanguage(stored);
  }, []);
  useEffect(() => {
    window.localStorage.setItem('legallens-language', language);
  }, [language]);
  const t = (key: TranslationKey) => translations[language][key];

  return <I18nContext.Provider value={{ language, setLanguage, t }}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }
  return context;
}