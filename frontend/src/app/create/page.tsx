'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudioStore } from '@/store/useStudioStore';
import { ArrowLeft, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, LayoutGrid, Mic2, Music, Palette, Type, Zap, Share2, Rocket, Film } from 'lucide-react';

import dynamic from 'next/dynamic';

import Step1Niche from '@/components/V3/Wizard/Step1Niche';
import Step3Visuals from '@/components/V3/Wizard/Step3Visuals';
import Step4ArtStyle from '@/components/V3/Wizard/Step4ArtStyle';
import Step5Animations from '@/components/V3/Wizard/Step5Animations';
import Step5Captions from '@/components/V3/Wizard/Step5Captions';
import Step6Effects from '@/components/V3/Wizard/Step6Effects';
import Step7Socials from '@/components/V3/Wizard/Step7Socials';
import Step8Details from '@/components/V3/Wizard/Step8Details';
import { useTranslationStore } from '@/store/useTranslationStore';

const Step2Voice = dynamic(() => import('@/components/V3/Wizard/Step2Voice'), { ssr: false });
const Step3Music = dynamic(() => import('@/components/V3/Wizard/Step3Music'), { ssr: false });

const STEPS = [
  { num: 1, label: 'niche', icon: LayoutGrid, color: '#8B5CF6' },
  { num: 2, label: 'voice', icon: Mic2, color: '#10B981' },
  { num: 3, label: 'style', icon: Palette, color: '#F43F5E' },
  { num: 4, label: 'visuals', icon: Sparkles, color: '#3B82F6' },
  { num: 5, label: 'animations', icon: Film, color: '#0EA5E9' },
  { num: 6, label: 'music', icon: Music, color: '#F59E0B' },
  { num: 6, label: 'captions', icon: Type, color: '#8B5CF6' },
  { num: 7, label: 'effects', icon: Zap, color: '#10B981' },
  { num: 8, label: 'socials', icon: Share2, color: '#3B82F6' },
  { num: 9, label: 'details', icon: Rocket, color: '#F43F5E' }
];

export default function CreateWizard() {
  const router = useRouter();
  const { wizardStep, setWizardStep, wizardData, isGenerating, isGeneratingImages, isGeneratingVideos, generateScript, generateImages, generateVideos } = useStudioStore();
  const { t, lang } = useTranslationStore();

  useEffect(() => {
    if (wizardStep === 0) setWizardStep(1);
  }, []);

  const handleBack = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    } else {
      router.push('/');
    }
  };

  const handleNext = async () => {
    if (wizardStep === 1) {
      await generateScript();
      setWizardStep(2);
    } else if (wizardStep === 3) {
      // Awakening the Visual Engine
      await generateImages();
      setWizardStep(4);
    } else if (wizardStep === 4) {
      // Awakening the Video Engine
      await generateVideos();
      setWizardStep(5);
    } else if (wizardStep < STEPS.length) {
      setWizardStep(wizardStep + 1);
    } else {
      console.log('Initiating Production with:', wizardData);
      router.push('/');
    }
  };

  return (
    <div className={`min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden ${lang === 'ar' ? 'font-outfit' : 'font-inter'}`}>
      {/* Cinematic Loading Overlay */}
      <AnimatePresence>
        { (isGenerating || isGeneratingImages || isGeneratingVideos) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-12 text-center"
          >
             <div className="relative w-32 h-32 mb-10">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-t-4 border-primary rounded-full shadow-[0_0_30px_rgba(139,92,246,0.5)]" 
                />
                <motion.div 
                   animate={{ scale: [1, 1.2, 1] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="absolute inset-0 flex items-center justify-center"
                >
                   {isGeneratingVideos ? <Film className="w-10 h-10 text-primary" /> : <Sparkles className="w-10 h-10 text-primary" />}
                </motion.div>
             </div>
             <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4 animate-pulse">
                {isGeneratingVideos ? (lang === 'en' ? 'Video Engine Animating...' : 'محرك الفيديو يقوم بالتحريك...') :
                 isGeneratingImages ? (lang === 'en' ? 'Awakening Visual Engine...' : 'إيقاظ محرك البصريات...') : t('mastermind_loading')}
             </h2>
             <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em]">
                {isGeneratingVideos ? (lang === 'en' ? 'Bringing images to life...' : 'إحياء الصور...') :
                 isGeneratingImages ? (lang === 'en' ? 'Rendering Storyboard Scenes...' : 'رسم مشاهد لوحة القصة...') : (lang === 'en' ? 'Orchestrating AI Engines...' : 'تنسيق محركات الذكاء الاصطناعي...')}
             </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-primary/10 blur-[150px] rounded-full animate-ambient-glow" />
         <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-secondary/10 blur-[150px] rounded-full animate-ambient-glow" style={{ animationDelay: '-4s' }} />
      </div>

      {/* Focus Mode Header */}
      <header className="px-12 py-6 flex items-center justify-between z-20 bg-black/40 backdrop-blur-xl border-b border-white/[0.03]">
         <div className={`flex items-center gap-8 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
            <button 
              onClick={() => router.push('/')} 
              className="group flex items-center gap-3 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold uppercase tracking-widest text-[10px] rounded-2xl transition-all border border-white/5 hover:border-white/10 shadow-xl"
            >
               <ArrowLeft className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`} /> 
               {t('back_to_dashboard')}
            </button>
            <div className="h-8 w-px bg-white/10" />
            <div className={`flex flex-col ${lang === 'ar' ? 'text-right' : ''}`}>
               <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/90">{t('production_wizard')}</h2>
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{t('focus_mode')}</p>
            </div>
         </div>

         {/* Enhanced Step Progress */}
         <div className={`flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
            {STEPS.map((s, idx) => {
               const active = wizardStep === s.num;
               const completed = wizardStep > s.num;
               return (
                 <React.Fragment key={s.num}>
                    <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => completed && setWizardStep(s.num)}>
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                         completed ? 'bg-secondary/10 border border-secondary/30 text-secondary' :
                         active    ? 'bg-primary/20 border-2 border-primary/50 text-white shadow-[0_0_30px_rgba(139,92,246,0.25)] scale-110' :
                                     'bg-white/5 border border-white/10 text-gray-600'
                       }`}>
                          {completed ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className={`w-4 h-4 ${active ? 'text-primary' : ''}`} />}
                       </div>
                    </div>
                    {idx < STEPS.length - 1 && (
                       <div className={`w-6 h-[2px] rounded-full transition-all duration-700 ${completed ? 'bg-secondary/40' : 'bg-white/5'}`} />
                    )}
                 </React.Fragment>
               );
            })}
         </div>

         <div className="w-[200px] flex justify-end">
            <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-gray-500">
               {lang === 'en' ? 'Step' : 'خطوة'} {wizardStep} <span className="text-gray-700 mx-1">/</span> {STEPS.length}
            </div>
         </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-12 pt-12 pb-32 relative z-10 flex flex-col">
         <AnimatePresence mode="wait">
            <motion.div
              key={wizardStep}
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -20 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="w-full flex-1"
            >
               {wizardStep === 1 && <Step1Niche />}
               {wizardStep === 2 && <Step2Voice />}
               {wizardStep === 3 && <Step4ArtStyle />}
               {wizardStep === 4 && <Step3Visuals />}
               {wizardStep === 5 && <Step5Animations />}
               {wizardStep === 6 && <Step3Music />}
               {wizardStep === 7 && <Step5Captions />}
               {wizardStep === 8 && <Step6Effects />}
               {wizardStep === 9 && <Step7Socials />}
               {wizardStep === 10 && <Step8Details />}
            </motion.div>
         </AnimatePresence>
      </main>

      {/* Bottom Navigation Bar */}
      <footer className="fixed bottom-0 left-0 right-0 p-8 z-30 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
         <div className={`max-w-6xl mx-auto flex justify-between items-center pointer-events-auto ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
            <button
               onClick={handleBack}
               className={`group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-black uppercase tracking-widest text-[11px] rounded-2xl transition-all border border-white/5 backdrop-blur-xl ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
            >
               <ChevronLeft className={`w-5 h-5 transition-transform ${lang === 'ar' ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`} />
               {wizardStep === 1 ? (lang === 'en' ? 'Cancel Production' : 'إلغاء الإنتاج') : t('back')}
            </button>

            <button
               onClick={handleNext}
               className={`btn-gradient group flex items-center gap-4 px-12 py-5 rounded-[2rem] shadow-[0_0_50px_rgba(139,92,246,0.3)] hover:scale-105 transition-all text-white active:scale-95 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
            >
               <span className="text-sm font-black uppercase tracking-[0.2em]">
                  {wizardStep === 9 ? t('initiate_production') : t('continue')}
               </span>
               {wizardStep === 9 ? <Rocket className="w-5 h-5 animate-bounce" /> : <ChevronRight className={`w-5 h-5 transition-transform ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />}
            </button>
         </div>
      </footer>

      {/* Subtle Bottom Ambient Reflector */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent absolute bottom-0 blur-sm" />
    </div>
  );
}

