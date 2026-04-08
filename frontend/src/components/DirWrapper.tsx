'use client';

import { useTranslationStore } from "@/store/useTranslationStore";
import { useEffect } from "react";

export default function DirWrapper({ children }: { children: React.ReactNode }) {
  const { lang } = useTranslationStore();
  const isRtl = lang === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  return (
    <div className={`flex min-h-screen ${isRtl ? 'font-outfit' : 'font-inter'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {children}
    </div>
  );
}
