'use client';

import React from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { Sparkles, TrendingUp, ChevronRight, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SUGGESTIONS = [
  "Top 3 untouched places on Earth",
  "A motivational speech for programmers",
  "Spooky urban legends from Japan",
  "How to start a SaaS in 2026",
];

export default function Step1Input() {
  const { wizardData, updateWizardData, setWizardStep } = useStudioStore();

  const handleNext = () => {
    setWizardStep(2);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh] space-y-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">
           <Wand2 className="w-3.5 h-3.5" /> AI Story Generator
        </div>
        <h2 className="text-6xl font-black uppercase tracking-tighter text-white leading-tight">
          What is your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Viral Concept?</span>
        </h2>
        <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto">
          Describe your vision in a few words or paste a URL. Our AI mastermind will handle the script, visuals, and voice.
        </p>
      </motion.div>

      <div className="w-full relative group max-w-4xl">
         <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
         <div className="relative glass-card p-1">
            <textarea
              value={wizardData.hook}
              onChange={(e) => updateWizardData({ hook: e.target.value })}
              placeholder="E.g., A cinematic journey through the ruins of Mars..."
              className="w-full bg-transparent border-none rounded-[2rem] p-12 text-2xl font-bold min-h-[280px] focus:outline-none transition-all placeholder:text-white/10 resize-none text-white leading-relaxed"
            />
            
            <div className="absolute bottom-8 right-8 flex items-center gap-6">
              <div className="text-[10px] font-black text-white/20 uppercase tracking-widest group-focus-within:text-primary/40 transition-colors">
                {wizardData.hook.length} characters
              </div>
              <button
                onClick={handleNext}
                disabled={!wizardData.hook}
                className="btn-gradient px-12 py-5 rounded-2xl flex items-center gap-3 text-white disabled:opacity-30 disabled:grayscale transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(139,92,246,0.3)]"
              >
                <Sparkles className="w-5 h-5" /> 
                <span className="uppercase tracking-[0.2em] text-xs font-black">Generate Story</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
         </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-4xl pt-8 border-t border-white/[0.03]"
      >
         <div className="flex flex-col items-center gap-8">
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-600">
               <TrendingUp className="w-4 h-4 text-secondary" /> Need Inspiration? Try these trending hooks
            </div>
            <div className="flex flex-wrap justify-center gap-3">
               {SUGGESTIONS.map((sug, idx) => (
                 <button
                   key={idx}
                   onClick={() => updateWizardData({ hook: sug })}
                   className="px-6 py-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/40 hover:bg-white/[0.05] text-xs font-bold text-gray-400 hover:text-white transition-all duration-300 uppercase tracking-widest"
                 >
                   {sug}
                 </button>
               ))}
            </div>
         </div>
      </motion.div>
    </div>
  );
}
