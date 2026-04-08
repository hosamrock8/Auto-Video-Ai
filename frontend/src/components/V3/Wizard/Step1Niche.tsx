'use client';

import React, { useState } from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { Ghost, History, Landmark, Rocket, TextCursorInput, Sparkles } from 'lucide-react';
import SelectableCard from './shared/SelectableCard';
import { motion, AnimatePresence } from 'framer-motion';

const PRESETS = [
  { id: 'scary-stories', title: 'Scary Stories', desc: 'Urban legends and spooky narrations', icon: Ghost, badge: 'Popular' },
  { id: 'history', title: 'History', desc: 'Deep dives into historical events', icon: History, badge: 'Educational' },
  { id: 'philosophy', title: 'Philosophy', desc: 'Stoicism and life reflections', icon: Landmark, badge: 'Viral' },
  { id: 'space', title: 'Space Mysteries', desc: 'Cosmic phenomena and explorations', icon: Rocket, badge: 'Premium' },
];

import { useTranslationStore } from '@/store/useTranslationStore';

export default function Step1Niche() {
  const { wizardData, updateWizardData } = useStudioStore();
  const { t, lang } = useTranslationStore();
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>(wizardData.niche === 'custom' ? 'custom' : 'presets');

  return (
    <div className={`w-full h-full flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ${lang === 'ar' ? 'text-right' : ''}`}>
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter">
          {lang === 'en' ? 'Choose Your' : 'اختر'} <span className="text-secondary">{t('niche')}</span>
        </h2>
        <p className="text-gray-500 text-sm font-medium">
          {lang === 'en' ? 'Select an optimized preset or build a custom concept.' : 'اختر قالباً جاهزاً أو قم بإنشاء فكرة مخصصة.'}
        </p>
      </div>

      <div className="flex justify-center">
        <div className="bg-white/5 p-1.5 rounded-2xl flex gap-1 border border-white/5">
          <button 
            onClick={() => setActiveTab('presets')}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'presets' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            {lang === 'en' ? 'Presets' : 'قوالب جاهزة'}
          </button>
          <button 
            onClick={() => setActiveTab('custom')}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'custom' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            {lang === 'en' ? 'Custom' : 'مخصص'}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'presets' ? (
          <motion.div 
            key="presets"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {PRESETS.map((p) => (
              <SelectableCard
                key={p.id}
                {...p}
                selected={wizardData.niche === p.id}
                onClick={() => updateWizardData({ niche: p.id })}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="custom"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <label className={`text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 block ${lang === 'ar' ? 'text-right' : ''}`}>
                {lang === 'en' ? 'Series Focus' : 'تركيز السلسلة'}
              </label>
              <div className="relative group">
                <TextCursorInput className={`absolute top-6 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors ${lang === 'ar' ? 'right-6' : 'left-6'}`} />
                <textarea
                  value={wizardData.customFocus}
                  onChange={(e) => updateWizardData({ niche: 'custom', customFocus: e.target.value })}
                  placeholder={lang === 'en' ? "E.g., Tales of ancient Egyptian architecture..." : "مثال: قصص من العمارة المصرية القديمة..."}
                  className={`w-full bg-white/[0.02] border border-white/5 rounded-[2rem] py-6 text-lg font-bold min-h-[120px] focus:outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all ${lang === 'ar' ? 'pr-16 pl-8 text-right' : 'pl-16 pr-8'}`}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className={`text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 block ${lang === 'ar' ? 'text-right' : ''}`}>
                {lang === 'en' ? 'Example Script / Hook' : 'مثال سيناريو / افتتاحية'}
              </label>
              <div className="relative group">
                <Sparkles className={`absolute top-6 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors ${lang === 'ar' ? 'right-6' : 'left-6'}`} />
                <textarea
                  value={wizardData.customScript}
                  onChange={(e) => updateWizardData({ niche: 'custom', customScript: e.target.value })}
                  placeholder={lang === 'en' ? "Paste an example script or hook that shows the vibe you want..." : "أضف مثالاً للسيناريو أو الافتتاحية التي ترغب بها..."}
                  className={`w-full bg-white/[0.02] border border-white/5 rounded-[2rem] py-6 text-lg font-bold min-h-[160px] focus:outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all ${lang === 'ar' ? 'pr-16 pl-8 text-right' : 'pl-16 pr-8'}`}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

