'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, Copy, Check, Share2, 
  ChevronRight, Video, FileVideo, 
  Layers, Tag, Type
} from 'lucide-react';

interface SEO {
  titles: string[];
  description: string;
  tags: string[];
}

interface FinalExportProps {
  videoUrl: string;
  thumbnailUrl: string;
  seo: SEO;
}

export default function FinalExport({ videoUrl, thumbnailUrl, seo }: FinalExportProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto pb-40 space-y-20 relative px-6">
      {/* Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="ambient-glow from-green-500/10 top-[-10%] left-[-10%] w-[50%] h-[50%] animate-ambient-glow" />
      </div>
      
      {/* Success Header */}
      <div className="text-center space-y-6 mb-24 relative z-10">
         <motion.div 
           initial={{ scale: 0.5, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="w-28 h-28 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-green-500/20 shadow-[0_0_50px_rgba(34,197,94,0.2)]"
         >
            <Check className="w-12 h-12 text-green-500" />
         </motion.div>
         <h2 className="text-6xl font-black tracking-tighter uppercase leading-none italic text-glow">Production Complete</h2>
         <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.5em] mt-4">System_Status: Factory_Output_Delivered_V1.0</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
        
        {/* Visual Delivery */}
        <div className="space-y-10">
           <section className="glass-card p-1 group overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
              <div className="bg-black/40 rounded-[2.2rem] p-4 relative overflow-hidden">
                <video 
                  controls 
                  src={`http://localhost:8000${videoUrl}`} 
                  className="w-full rounded-[1.8rem] bg-black shadow-2xl relative z-10"
                />
                {/* Visual Decor */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent pointer-events-none" />
              </div>
           </section>

           <div className="grid grid-cols-2 gap-6">
              <a 
                href={`http://localhost:8000${videoUrl}`} 
                download 
                className="flex items-center justify-center gap-4 py-6 bg-white text-black rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-green-500 hover:text-white transition-all active:scale-95 shadow-xl relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-black opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                <Download className="w-5 h-5 group-hover/btn:translate-y-1 transition-transform" /> Export_Master_File
              </a>
              <a 
                href={`http://localhost:8000${thumbnailUrl}`} 
                download 
                className="flex items-center justify-center gap-4 py-6 bg-white/[0.03] border border-white/5 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] hover:border-white/20 transition-all active:scale-95 text-white/40 hover:text-white"
              >
                <FileVideo className="w-5 h-5" /> Save_Cover_Frame
              </a>
           </div>
        </div>

        {/* SEO Metadata Station */}
        <section className="glass-card p-1">
           <div className="bg-black/20 rounded-[2.2rem] p-12 space-y-12">
              <div className="flex items-center gap-5 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] border-b border-white/5 pb-6">
                 <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                    <Video className="w-5 h-5" />
                 </div>
                 YouTube_Publishing_Kit
              </div>

              {/* Titles */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-3">
                       <Type className="w-4 h-4 text-green-500" /> Curated_Titles
                    </span>
                 </div>
                 <div className="space-y-4">
                   {seo.titles.map((title, i) => (
                     <div key={i} className="flex items-center gap-6 bg-white/[0.02] border border-white/5 p-6 rounded-2xl group hover:bg-white/[0.05] hover:border-green-500/20 transition-all relative">
                        <span className="text-white/10 font-black text-[11px] w-6 italic">#{i+1}</span>
                        <p className="flex-1 text-sm font-black text-white leading-relaxed" dir="rtl">{title}</p>
                        <button 
                          onClick={() => copyToClipboard(title, `title-${i}`)}
                          className="p-3 bg-white/[0.05] rounded-xl text-white/20 hover:text-green-500 hover:bg-green-500/10 transition-all"
                        >
                           {copiedField === `title-${i}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                     </div>
                   ))}
                 </div>
              </div>

              {/* Description */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-3">
                       <Layers className="w-4 h-4 text-green-500" /> Global_Description
                    </span>
                    <button 
                      onClick={() => copyToClipboard(seo.description, 'desc')}
                      className="text-[9px] font-black text-green-500 uppercase hover:text-white transition-colors flex items-center gap-3 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20"
                    >
                       {copiedField === 'desc' ? 'COPIED_TO_CACHE' : 'INJECT_DESCRIPTION'}
                    </button>
                 </div>
                 <div className="bg-black/40 border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <textarea 
                      readOnly
                      value={seo.description}
                      dir="rtl"
                      className="w-full bg-transparent border-none text-[12px] text-white/40 font-bold min-h-[160px] resize-none focus:outline-none leading-relaxed no-scrollbar"
                    />
                 </div>
              </div>

              {/* Tags */}
              <div className="space-y-6">
                 <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-3">
                    <Tag className="w-4 h-4 text-green-500" /> Algorithmic_Tags
                 </div>
                 <div className="flex flex-wrap gap-3">
                    {seo.tags.map((tag, i) => (
                      <span key={i} className="px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl text-[9px] font-black text-white/30 uppercase tracking-widest hover:text-green-500 transition-colors">
                        {tag}
                      </span>
                    ))}
                 </div>
                 <button 
                    onClick={() => copyToClipboard(seo.tags.join(', '), 'tags')}
                    className="w-full py-5 bg-white/[0.03] border border-white/5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-500 transition-all mt-6 active:scale-95"
                 >
                    {copiedField === 'tags' ? 'SYNC_COMPLETE' : 'COPY_ALL_METADATA'}
                 </button>
              </div>

           </div>
        </section>      </div>
    </div>
  );
}
