'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, RotateCcw, CheckCircle2, AlertCircle, 
  ImageIcon, Volume2, ShieldCheck, DollarSign
} from 'lucide-react';

interface Asset {
  scene: number;
  audio: string;
  image: string;
}

interface AssetReviewProps {
  assets: Asset[];
  onRegenerate: (sceneNumber: number) => void;
  isPolling: boolean;
}

export default function AssetReview({ assets, onRegenerate, isPolling }: AssetReviewProps) {
  return (
    <div className="space-y-20 max-w-7xl mx-auto pb-40 relative px-6">
      {/* Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="ambient-glow from-teal-500/10 top-[-10%] right-[-10%] w-[50%] h-[50%] animate-ambient-glow" />
      </div>

      <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-20 relative z-10">
        <div>
           <div className="flex items-center gap-4 px-4 py-2 bg-teal-500/10 rounded-full text-teal-500 text-[9px] font-black uppercase tracking-[0.3em] mb-6 border border-teal-500/20 w-fit shadow-[0_0_15px_rgba(20,184,166,0.1)]">
              <ShieldCheck className="w-4 h-4 animate-pulse" /> Quality_Office_Active
           </div>
           <h2 className="text-5xl font-black tracking-tighter uppercase mb-4 italic text-glow">Asset Verification</h2>
           <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] max-w-xl leading-relaxed">System_Review_Protocol: Validate each production node. Trigger targeted re-synthesis for sub-standard output.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
        {assets.map((asset, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-card p-1 group overflow-hidden active:scale-[0.98] transition-all flex flex-col h-full"
          >
            <div className="bg-black/20 rounded-[2.2rem] flex flex-col h-full overflow-hidden">
              {/* Image Preview (The Monitor) */}
              <div className="aspect-video relative overflow-hidden bg-black/60 shadow-inner">
                <img 
                  src={`http://localhost:8000${asset.image}`} 
                  alt={`Scene ${asset.scene}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000 grayscale-[0.2] group-hover:grayscale-0"
                />
                
                {/* Overlays */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent opacity-60" />
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_0%,rgba(20,184,166,0.03)_50%,transparent_100%)] bg-[length:100%_4px] opacity-20" />
                
                <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] italic text-white/40">
                  Node_#{asset.scene}
                </div>
              </div>

              {/* Controls & Metadata */}
              <div className="p-10 space-y-10 flex-1 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">
                    <div className="p-2.5 bg-white/[0.03] rounded-xl text-teal-500">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    Voice_Synthesis_Stream
                  </div>
                  <div className="relative">
                    <audio 
                      controls 
                      src={`http://localhost:8000${asset.audio}`}
                      className="w-full h-10 filter invert opacity-20 hover:opacity-60 transition-all scale-95 origin-left"
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                   <button 
                     onClick={() => onRegenerate(asset.scene)}
                     disabled={isPolling}
                     className="flex items-center gap-4 text-[10px] font-black text-white/20 hover:text-teal-500 transition-all disabled:opacity-10 uppercase tracking-[0.2em] group/regen"
                   >
                     <RotateCcw className={`w-4 h-4 transition-transform group-hover/regen:rotate-180 duration-500 ${isPolling ? 'animate-spin' : ''}`} />
                     Re-Synthesize
                   </button>
                   
                   <div className="flex items-center gap-2 text-white/10 text-[9px] font-black uppercase tracking-widest italic">
                      <DollarSign className="w-4 h-4 text-green-500/40" />
                      $0.013_Sync
                   </div>
                </div>
              </div>
              
              {/* Subtle Back Glow */}
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-teal-500/5 blur-[80px] pointer-events-none rounded-full group-hover:opacity-100 opacity-0 transition-opacity" />
            </div>
          </motion.div>
        ))}

        {/* Loading/Placeholder state for missing assets */}
        {assets.length === 0 && (
          <div className="col-span-full py-40 glass-panel border-dashed border-2 relative group overflow-hidden">
             <div className="absolute inset-0 bg-teal-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
             <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
                <div className="p-8 bg-white/[0.03] rounded-full border border-white/5 animate-pulse">
                   <ImageIcon className="w-16 h-16 text-white/5" />
                </div>
                <div className="text-center">
                   <p className="text-[12px] font-black uppercase tracking-[0.6em] text-white/20">Waiting_For_Production_Cycle</p>
                   <p className="text-[9px] font-bold text-white/5 uppercase mt-4 tracking-[0.3em]">Estimated payload delivery: Node_Async_Queue</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
