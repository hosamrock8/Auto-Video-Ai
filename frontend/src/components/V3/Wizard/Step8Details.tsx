'use client';

import React from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { Type, Clock, Calendar, Rocket, Wand2 } from 'lucide-react';

export default function Step8Details() {
  const { wizardData, updateWizardData } = useStudioStore();

  return (
    <div className="w-full h-full flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Series <span className="text-secondary">Execution</span></h2>
        <p className="text-gray-500 text-sm font-medium">Finalize your production metadata and scheduling preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Series Title</label>
            <div className="relative group">
              <Type className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={wizardData.seriesName}
                onChange={(e) => updateWizardData({ seriesName: e.target.value })}
                placeholder="e.g., Unsolved Space Mysteries Vol. 1"
                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-16 pr-8 py-5 text-lg font-bold focus:outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Target Video Duration</label>
            <div className="relative group">
              <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
              <select
                value={wizardData.videoDuration}
                onChange={(e) => updateWizardData({ videoDuration: e.target.value })}
                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-16 pr-8 py-5 text-lg font-bold focus:outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all appearance-none text-white"
              >
                <option value="30-45" className="bg-[#050505]">30-45 Seconds (Fast Hook)</option>
                <option value="60-70" className="bg-[#050505]">60-70 Seconds (Standard Short)</option>
                <option value="90-120" className="bg-[#050505]">90-120 Seconds (Storytelling)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Daily Publish Time</label>
            <div className="relative group">
              <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
              <input
                type="time"
                value={wizardData.publishTime}
                onChange={(e) => updateWizardData({ publishTime: e.target.value })}
                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-16 pr-8 py-5 text-lg font-bold focus:outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all text-white inverted-scheme"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between">
           <div className="p-8 bg-primary/5 border border-primary/10 rounded-[2.5rem] space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <Rocket className="w-6 h-6" />
                 </div>
                 <h3 className="text-lg font-black uppercase tracking-tighter">Production Overview</h3>
              </div>
              
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Niche</span>
                    <span className="text-white">{wizardData.niche}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Voice</span>
                    <span className="text-white">{wizardData.voice}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Style</span>
                    <span className="text-white">{wizardData.artStyle}</span>
                 </div>
                 <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-primary">
                    <span>Estimated Cost</span>
                    <span>~$1.45 / Video</span>
                 </div>
              </div>

              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest leading-relaxed">
                 By initiating, our AI Mastermind will begin scriptwriting, asset generation, and editing in parallel. You can monitor progress in the dashboard.
              </p>
           </div>
           
           <div className="mt-8 p-6 bg-secondary/10 border border-secondary/20 rounded-3xl flex items-center gap-4">
              <Wand2 className="w-5 h-5 text-secondary animate-pulse" />
              <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Ready for Liftoff</span>
           </div>
        </div>
      </div>
    </div>
  );
}
