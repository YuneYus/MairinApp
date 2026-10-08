import { AppLanguage, getAppLanguage, setAppLanguage } from "@/storage/languageStorage";
import { TranslationKey, translations } from "@/translations";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type LanguageContextType = {
  language: AppLanguage;
  changeLanguage: (lang: AppLanguage) => Promise<void>;
  t: (key: TranslationKey) => string;
};


const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<AppLanguage>("es");

  useEffect(() => {
    const load = async () => {
      const saved = await getAppLanguage();
      setLanguage(saved);
    };
    load();
  }, []);

  const changeLanguage = async (lang: AppLanguage) => {
    setLanguage(lang);
    await setAppLanguage(lang);
  };

  const t = (key: TranslationKey): string => {
    const dict: Partial<Record<TranslationKey, string>> =
      language === "mis"
        ? translations.mis
        : language === "en"
          ? translations.en
          : translations.es;
    return dict[key] ?? translations.es[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}