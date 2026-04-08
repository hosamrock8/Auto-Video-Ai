'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'ar';

interface TranslationStore {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    my_videos: "My Videos",
    settings: "Settings",
    new_project: "New Project",
    internal_tool: "Internal Tool",
    personal_ai_factory: "Personal AI Factory",
    recent_productions: "Recent Productions",
    projects: "Projects",
    no_productions: "No productions found",
    start_generating: "Start Generating",
    productions_empty: "Your studio is empty. Let's create your first fully AI-generated video.",
    production_wizard: "Production Wizard",
    focus_mode: "Focus Mode Enabled",
    back_to_dashboard: "Back to Dashboard",
    continue: "Continue",
    back: "Back",
    initiate_production: "Initiate Production",
    niche: "Niche",
    voice: "Voice",
    music: "Music",
    style: "Style",
    captions: "Captions",
    effects: "Effects",
    socials: "Socials",
    details: "Details",
    mastermind_loading: "AI Mastermind is crafting your scenario...",
  },
  ar: {
    dashboard: "لوحة التحكم",
    my_videos: "فيديوهاتي",
    settings: "الإعدادات",
    new_project: "مشروع جديد",
    internal_tool: "أداة داخلية",
    personal_ai_factory: "مصنع الذكاء الاصطناعي الخاص",
    recent_productions: "كليباتي الأخيرة",
    projects: "مشاريع",
    no_productions: "لا يوجد إنتاج حالياً",
    start_generating: "ابدأ الجنون",
    productions_empty: "الاستوديو الخاص بك فارغ، هيا بنا ننشئ أول فيديو ذكاء اصطناعي خاص بك.",
    production_wizard: "مساعد الإنتاج",
    focus_mode: "وضع التركيز مفعّل",
    back_to_dashboard: "العودة للوحة القيادة",
    continue: "استمرار",
    back: "رجوع",
    initiate_production: "بدء الإنتاج",
    niche: "المجال",
    voice: "الصوت",
    music: "الموسيقى",
    style: "الأسلوب",
    captions: "الترجمة",
    effects: "المؤثرات",
    socials: "التواصل",
    details: "التفاصيل",
    mastermind_loading: "ذكاء لومينا يقوم بصياغة السيناريو الخاص بك...",
  }
};

export const useTranslationStore = create<TranslationStore>()(
  persist(
    (set, get) => ({
      lang: 'en',
      setLang: (lang) => set({ lang }),
      t: (key) => {
        const { lang } = get();
        return translations[lang][key] || key;
      },
    }),
    {
      name: 'lumina-translation-storage',
    }
  )
);
