'use client';

import React from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { Share2, Play, Music2, ExternalLink, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Step7Socials() {
  const { wizardData, updateWizardData } = useStudioStore();

  return (
    <div className="w-full h-full flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Connect <span className="text-secondary">Publishing</span></h2>
        <p className="text-gray-500 text-sm font-medium">Auto-upload your series directly to your channels. This is optional.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#ff0000]/5 border border-[#ff0000]/10 rounded-[2.5rem] p-10 flex flex-col items-center text-center space-y-6"
        >
            <Play className="w-8 h-8" />
          <div>
            <h3 className="text-lg font-black uppercase tracking-tighter text-white">YouTube Shorts</h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Direct API integration</p>
          </div>
          <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
            Connect Account <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            <Music2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-tighter text-white">TikTok</h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Verified partner access</p>
          </div>
          <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
            Connect Account <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>

      <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-black uppercase tracking-widest text-emerald-400">Enterprise Security</h4>
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">Your credentials are encrypted and never stored in plain text.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <span className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest">Optional Step</span>
           <button 
             onClick={() => updateWizardData({ socialsConnected: true })}
             className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
           >
             Skip for now
           </button>
        </div>
      </div>
    </div>
  );
}
