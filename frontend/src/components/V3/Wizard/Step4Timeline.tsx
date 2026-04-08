'use client';

import React, { useState, useEffect } from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { CheckCircle2, Loader2, Play, Download, RefreshCcw, ChevronLeft, Film, Rocket, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Step4Timeline() {
  const router = useRouter();
  const { setWizardStep, wizardData } = useStudioStore();
  const [pipelinePhase, setPipelinePhase] = useState(0);

  const steps = [
    "Orchestrating Narrative Engine...",
    "Sculpting Neural Voices...",
    "Synthesizing Cinematic Visuals...",
    "Rendering Advanced Typography...",
    "Final Composition & Exporting..."
  ];

  useEffect(() => {
    if (pipelinePhase < steps.length) {
      const timer = setTimeout(() => {
        setPipelinePhase(p => p + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [pipelinePhase, steps.length]);

  const isComplete = pipelinePhase >= steps.length;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col pt-4 pb-40">
      <div className="flex flex-col items-center justify-center space-y-8">
        
        {/* Progress Console */}
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div 
              key="pipeline"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full max-w-2xl bg-white/[0.02] border border-white/[0.05] rounded-[3rem] p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                 <motion.div 
                   className="h-full bg-primary shadow-[0_0_20px_rgba(139,92,246,0.5)]"
                   initial={{ width: "0%" }}
                   animate={{ width: `${(pipelinePhase / steps.length) * 100}%` }}
                 />
              </div>

              <div className="space-y-8">
                {steps.map((stepText, idx) => {
                  const status = idx < pipelinePhase ? 'done' : idx === pipelinePhase ? 'active' : 'pending';
                  
                  return (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-6"
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        status === 'done' ? 'bg-secondary/10 text-secondary' :
                        status === 'active' ? 'bg-primary/20 text-primary border border-primary/30 animate-pulse' :
                        'bg-white/5 text-gray-700 border border-white/5'
                      }`}>
                        {status === 'done' ? <CheckCircle2 className="w-6 h-6" /> : 
                         status === 'active' ? <Loader2 className="w-6 h-6 animate-spin" /> : 
                         <div className="w-2 h-2 rounded-full bg-current" />}
                      </div>
                      
                      <div className="flex flex-col">
                        <span className={`text-sm font-black uppercase tracking-widest ${
                          status === 'active' ? 'text-white' : 
                          status === 'done' ? 'text-gray-500' : 
                          'text-gray-700'
                        }`}>
                          {stepText}
                        </span>
                        {status === 'active' && (
                          <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mt-1">AI Agents Working...</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="complete"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full"
            >
              {/* Video Preview */}
              <div className="flex justify-center">
                 <div className="aspect-[9/16] w-full max-w-[340px] bg-black rounded-[3rem] overflow-hidden relative shadow-[0_0_80px_rgba(139,92,246,0.15)] border-4 border-white/10 group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0F172A] to-[#1E293B]" />
                    
                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all cursor-pointer">
                       <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.5)] group-hover:scale-110 transition-transform">
                          <Play className="w-10 h-10 ml-1.5" />
                       </div>
                    </div>

                    <div className="absolute bottom-12 left-0 right-0 p-8 text-center">
                       <div className="bg-primary/95 text-white px-4 py-2 font-black text-2xl uppercase tracking-tighter rounded-xl shadow-2xl inline-block -rotate-2">
                          {wizardData.hook.split(' ')[0] || "LETS GO"}
                       </div>
                    </div>
                 </div>
              </div>

              {/* Success Info & CTA */}
              <div className="space-y-10">
                 <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-secondary">
                       <Rocket className="w-3.5 h-3.5" /> Production Ready
                    </div>
                    <h2 className="text-5xl font-black uppercase tracking-tighter text-white leading-tight">
                       Your Masterpiece is <span className="text-secondary">Born.</span>
                    </h2>
                    <p className="text-gray-500 text-lg font-medium">
                       Every scene orchestrated, every voice refined. Your faceless video is optimized for maximum retention and viral impact.
                    </p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <button className="flex flex-col items-center justify-center gap-4 p-8 bg-white/[0.03] border border-white/5 rounded-[2rem] hover:bg-white/[0.05] hover:border-primary/40 transition-all group">
                       <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Download className="w-5 h-5" />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Export 4K</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-4 p-8 bg-white/[0.03] border border-white/5 rounded-[2rem] hover:bg-white/[0.05] hover:border-secondary/40 transition-all group">
                       <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                          <Share2 className="w-5 h-5" />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Share Link</span>
                    </button>
                 </div>

                 <button 
                   onClick={() => router.push('/')}
                   className="w-full btn-gradient py-6 rounded-2xl text-white flex items-center justify-center gap-3 shadow-[0_0_50px_rgba(139,92,246,0.3)] hover:scale-[1.02] transition-all"
                 >
                    <span className="uppercase tracking-[0.2em] text-sm font-black italic">Return to Dashboard</span>
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Footer (Only if not complete) */}
      {!isComplete && (
        <div className="fixed bottom-12 left-12 right-12 flex justify-start items-center pointer-events-none z-50">
           <button
             onClick={() => setWizardStep(3)}
             className="pointer-events-auto group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl transition-all border border-white/5 backdrop-blur-xl"
           >
             <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
             Modify Visuals
           </button>
        </div>
      )}
    </div>
  );
}
