'use client';

import React from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { ChevronLeft, ChevronRight, Play, User, Edit3, Type } from 'lucide-react';
import { motion } from 'framer-motion';

const VOICES = [
  { id: 'gemini-tts', name: 'Adam (Narrator)', type: 'Deep & Professional', provider: 'Gemini' },
  { id: 'eleven-turbo', name: 'Sarah (Storyteller)', type: 'Warm & Engaging', provider: 'ElevenLabs' },
  { id: 'minimax-speech', name: 'Marcus (Hype)', type: 'Energetic & Fast', provider: 'Minimax' },
];

export default function Step2Script() {
  const { wizardData, updateWizardData, setWizardStep } = useStudioStore();

  const dummyScript = [
    "Imagine a place so dark and cold...",
    "Yet it contains infinite possibilities.",
    "Welcome to the vast unknown of deep space."
  ];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col pt-8 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Col: Script Blocks */}
        <div className="lg:col-span-7 space-y-8">
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <h3 className="text-2xl font-black uppercase tracking-tighter">Script Mastermind</h3>
                 <p className="text-gray-500 font-medium text-sm italic">AI generated these scenes based on your concept</p>
              </div>
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 transition-all border border-white/5">
                 Regenerate Script
              </button>
           </div>

           <div className="space-y-4">
             {dummyScript.map((chunk, idx) => (
               <motion.div 
                 key={idx} 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: idx * 0.1 }}
                 className="glass-panel p-8 relative group overflow-hidden hover:border-primary/30 transition-all cursor-text"
               >
                 <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary/20 group-hover:bg-primary/50 transition-colors" />
                 <div className="absolute top-4 left-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Scene {idx + 1}</div>
                 <p className="text-white/90 text-xl font-medium leading-relaxed pt-4">{chunk}</p>
                 <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-3">
                    <button className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                       <Edit3 className="w-4 h-4" />
                    </button>
                 </div>
               </motion.div>
             ))}
           </div>
        </div>

        {/* Right Col: Voice Personas */}
        <div className="lg:col-span-5 space-y-8">
           <div className="space-y-1">
              <h3 className="text-2xl font-black uppercase tracking-tighter">Narrator Archive</h3>
              <p className="text-gray-500 font-medium text-sm italic">Select the voice of your story</p>
           </div>

           <div className="space-y-3">
             {VOICES.map((voice, idx) => (
               <motion.div
                 key={voice.id}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.2 + idx * 0.1 }}
                 onClick={() => updateWizardData({ voicePersona: voice.id })}
                 className={`group relative p-6 rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                   wizardData.voicePersona === voice.id
                     ? 'bg-primary/10 border-primary/50 ring-1 ring-primary/20 shadow-[0_0_40px_rgba(139,92,246,0.1)]'
                     : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                 }`}
               >
                 <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-5">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                         wizardData.voicePersona === voice.id ? 'bg-primary/20' : 'bg-white/5'
                       }`}>
                          <User className={`w-6 h-6 ${wizardData.voicePersona === voice.id ? 'text-primary' : 'text-gray-500'}`} />
                       </div>
                       <div className="flex flex-col">
                          <span className="font-black text-white text-lg tracking-tight uppercase">{voice.name}</span>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{voice.type}</span>
                             <span className="w-1 h-1 rounded-full bg-gray-800" />
                             <span className="text-[9px] text-primary/60 font-black uppercase tracking-widest">{voice.provider}</span>
                          </div>
                       </div>
                    </div>
                    <button 
                      onClick={(e) => e.stopPropagation()} 
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        wizardData.voicePersona === voice.id ? 'bg-primary text-white scale-110 shadow-lg' : 'bg-white/5 text-gray-500 hover:bg-white/10'
                      }`}
                    >
                      <Play className="w-4 h-4 ml-0.5" />
                    </button>
                 </div>
                 
                 {wizardData.voicePersona === voice.id && (
                    <motion.div 
                      layoutId="voice-indicator"
                      className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" 
                    />
                 )}
               </motion.div>
             ))}
           </div>

           <div className="glass-panel p-8 border-dashed border-white/10 flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                 <Type className="w-5 h-5 text-gray-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-center">
                Custom Voice cloning <br/> coming soon to Pro
              </p>
           </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-12 left-12 right-12 flex justify-between items-center pointer-events-none z-50">
         <button
           onClick={() => setWizardStep(1)}
           className="pointer-events-auto group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl transition-all border border-white/5 backdrop-blur-xl"
         >
           <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
           Prev Step
         </button>
         
         <div className="flex items-center gap-4">
            <button
              onClick={() => setWizardStep(3)}
              className="pointer-events-auto btn-gradient px-12 py-4 text-white rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(139,92,246,0.3)]"
            >
              <span className="uppercase tracking-[0.2em] text-[11px] font-black">Visual Engine</span>
              <ChevronRight className="w-4 h-4" />
            </button>
         </div>
      </div>
    </div>
  );
}
