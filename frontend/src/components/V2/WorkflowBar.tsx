'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Play, CheckCircle2, AlertCircle, 
  RefreshCcw, DollarSign, Loader2
} from 'lucide-react';

interface WorkflowBarProps {
  status: string;
  totalCost: number;
  onAction: () => void;
  loading: boolean;
}

export default function WorkflowBar({ status, totalCost, onAction, loading }: WorkflowBarProps) {
  const getActionLabel = () => {
    switch (status) {
      case 'draft': return 'GENERATE SCRIPT';
      case 'scripting': return 'WRITING SCRIPT...';
      case 'awaiting_script_approval': return 'APPROVE & GENERATE ASSETS';
      case 'generating_assets': return 'GENERATING ASSETS...';
      case 'awaiting_asset_approval': return 'FINAL ASSEMBLY';
      case 'assembling': return 'ASSEMBLING...';
      case 'completed': return 'PRODUCTION COMPLETE';
      case 'error': return 'RETRY STAGE';
      default: return 'START PRODUCTION';
    }
  };

  const isEnabled = !loading && !['scripting', 'generating_assets', 'assembling', 'completed'].includes(status);

  return (
    <div className="fixed bottom-0 inset-x-0 glass-panel border-t border-white/5 z-[100] p-8 shadow-[0_-40px_100px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom duration-700">
       <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          
          {/* Status & Project Info */}
          <div className="flex items-center gap-10">
             <div className="flex items-center gap-5">
               <div className="relative">
                 <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse rounded-full" />
                 <div className={`w-3 h-3 rounded-full ${loading ? 'bg-primary' : 'bg-secondary'} animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.6)] relative z-10`} />
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-1.5 leading-none">Production_Protocol_Status</span>
                  <span className="text-sm font-black uppercase text-white tracking-widest italic">{status.replace(/_/g, ' ')}</span>
               </div>
             </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-8 w-full md:w-auto">
             <button
               onClick={onAction}
               disabled={!isEnabled}
               className={`flex-1 md:flex-none flex items-center justify-center gap-4 px-12 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all active:scale-95 border group relative overflow-hidden ${
                 isEnabled 
                   ? 'bg-primary text-white border-white/20 shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)]' 
                   : 'bg-white/5 text-white/10 border-white/5 cursor-not-allowed grayscale'
               }`}
             >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <Zap className={`w-5 h-5 transition-transform group-hover:rotate-12 ${isEnabled ? 'text-white' : 'text-white/10'}`} />
                )}
                {getActionLabel()}
             </button>
          </div>
       </div>
    </div>
  );
}
