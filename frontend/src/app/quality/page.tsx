'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, CheckSquare, XSquare, 
  Search, Filter, Play, Image as ImageIcon, 
  RotateCw, CheckCircle, BarChart3, AlertTriangle, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AssetReview {
  id: string;
  project_id: string;
  type: 'Image' | 'Video' | 'Audio';
  status: 'Awaiting' | 'Approved' | 'Rejected';
  preview_url: string;
}

export default function QualityOffice() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/projects');
        if (res.ok) setProjects(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleApprove = async (projectId: string) => {
    try {
      await fetch(`http://localhost:8000/api/quality/approve/${projectId}`, { method: 'POST' });
      // Refresh list
      const res = await fetch('http://localhost:8000/api/projects');
      if (res.ok) setProjects(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-inter p-12 relative overflow-hidden">
      {/* Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="ambient-glow from-teal-500/10 top-[-10%] right-[-10%] w-[50%] h-[50%] animate-ambient-glow" />
      </div>

      <header className="mb-16 relative z-10">
        <div className="flex items-center gap-6 mb-4">
          <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl text-teal-400 shadow-lg shadow-teal-500/10">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none block">Quality Office</h1>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Asset_Validation_&_Governance_Node</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative z-10">
        
        {/* Review Station */}
        <div className="lg:col-span-3 space-y-12">
          
          <div className="flex items-center justify-between mb-12">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10" />
              <input 
                type="text" 
                placeholder="Search factory orders..."
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-sm focus:outline-none focus:border-teal-500/30 transition-all font-black uppercase tracking-widest placeholder:text-white/5"
              />
            </div>
            
            <div className="flex gap-4">
              <button className="flex items-center gap-4 px-6 py-4 bg-white/[0.03] rounded-2xl text-[10px] font-black text-white/30 hover:text-white border border-white/5 transition-all uppercase tracking-widest">
                <Filter className="w-4 h-4 text-teal-500" />
                Awaiting_Review (3)
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <AnimatePresence>
              {projects.filter(p => !p.offices?.quality?.approved).map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-1 group overflow-hidden active:scale-[0.99] transition-all"
                >
                  <div className="bg-black/20 rounded-[2.2rem] p-10 flex flex-col md:flex-row gap-10 items-center">
                    <div className="w-full md:w-80 aspect-video bg-black/40 rounded-3xl border border-white/5 flex items-center justify-center group/preview cursor-pointer overflow-hidden relative shadow-inner">
                      {project.has_video ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity z-10">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      ) : (
                        <ImageIcon className="w-12 h-12 text-white/5 group-hover/preview:text-teal-500 transition-colors" />
                      )}
                      <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.5em] absolute bottom-6">Preview_Monitor</span>
                      
                      {/* Scanline Effect */}
                      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_0%,rgba(20,184,166,0.05)_50%,transparent_100%)] bg-[length:100%_4px] opacity-20" />
                    </div>

                    <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-4">
                         <span className="px-4 py-1.5 bg-teal-500/10 text-teal-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.1)]">
                            {project.offices?.quality?.status || 'Awaiting_Validation'}
                         </span>
                         <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">{project.id}</span>
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter italic text-glow">{project.title || 'Processing_Production_Cores...'}</h3>
                      
                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                         {['Visual_Consistency', 'Industrial_Lighting', 'Style_Standard', 'Audio_Sync_Purity'].map(tag => (
                           <div key={tag} className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.02] rounded-xl border border-white/5 text-[8px] font-black text-white/20 uppercase tracking-widest group-hover:bg-white/[0.04] transition-all">
                              <CheckCircle className="w-3.5 h-3.5 text-white/10 group-hover:text-teal-500 transition-colors" />
                              {tag}
                           </div>
                         ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 w-full md:w-auto mt-6 md:mt-0">
                      <button 
                        onClick={() => handleApprove(project.id)}
                        className="px-10 py-5 bg-teal-500 text-black rounded-3xl font-black text-[11px] shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_50px_rgba(20,184,166,0.5)] transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest"
                      >
                        <ShieldCheck className="w-5 h-5" /> Accredit_Asset
                      </button>
                      <button className="px-10 py-5 bg-white/[0.03] hover:bg-red-500/10 text-white/20 hover:text-red-400 rounded-3xl font-black text-[11px] transition-all flex items-center justify-center gap-3 border border-white/5 uppercase tracking-widest">
                        <RotateCw className="w-5 h-5" /> Recycle_Production
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {!loading && projects.filter(p => !p.offices?.quality?.approved).length === 0 && (
              <div className="py-32 text-center glass-panel border-dashed border-2 relative group overflow-hidden">
                <div className="absolute inset-0 bg-teal-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <ShieldCheck className="w-16 h-16 text-white/5 mx-auto mb-6 group-hover:scale-110 group-hover:text-teal-500 transition-all" />
                <p className="text-white/20 font-black uppercase tracking-[0.6em] text-[12px]">Global_Asset_Pipeline_Is_Secure</p>
                <p className="text-[9px] font-bold text-white/5 uppercase mt-4 tracking-[0.3em]">Standing by for incoming production nodes...</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Quality Analytics */}
        <div className="space-y-8">
          <div className="glass-card p-1">
            <div className="bg-black/20 rounded-[2.2rem] p-10">
              <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-12 border-b border-white/5 pb-5">Style_Governance</h4>
              
              <div className="space-y-10">
                <div className="p-8 bg-teal-500/5 rounded-3xl border border-teal-500/10 text-center relative group overflow-hidden">
                   <div className="absolute inset-0 bg-teal-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="text-[10px] font-black text-teal-500 uppercase mb-3 tracking-[0.3em] relative z-10">Current_Yield</div>
                   <div className="text-5xl font-black italic text-glow relative z-10">94.2%</div>
                </div>

                <div className="space-y-4">
                   <h5 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">Verification_Protocols</h5>
                   <button className="w-full flex items-center justify-between p-6 bg-white/[0.03] rounded-3xl hover:bg-teal-500/10 transition-all group border border-transparent hover:border-teal-500/20 active:scale-95">
                      <span className="text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-widest">Industrial_Standard</span>
                      <BarChart3 className="w-5 h-5 text-teal-500 group-hover:rotate-12 transition-all" />
                   </button>
                   <button className="w-full flex items-center justify-between p-6 bg-white/[0.03] rounded-3xl hover:bg-teal-500/10 transition-all group border border-transparent hover:border-teal-500/20 active:scale-95">
                      <span className="text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-widest">Metadata_Purity</span>
                      <CheckCircle className="w-5 h-5 text-white/10 group-hover:text-teal-500 transition-all" />
                   </button>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Alert */}
          <div className="glass-panel p-10 border-amber-500/20 relative group overflow-hidden">
            <div className="absolute inset-0 bg-amber-500/5 blur-3xl opacity-100" />
            <AlertTriangle className="w-10 h-10 text-amber-500/40 mb-6 group-hover:scale-110 transition-transform" />
            <h4 className="text-[11px] font-black uppercase tracking-widest mb-3">Policy_Advisory</h4>
            <p className="text-[9px] font-bold text-white/30 leading-relaxed uppercase tracking-wider mb-8">Character consistency is falling below threshold for 3 active nodes. Consider increasing reference weights.</p>
            <button className="flex items-center gap-3 text-[9px] font-black text-amber-500 uppercase tracking-widest hover:text-white transition-all pt-4 border-t border-amber-500/10 w-full group/fix">
              Fix_In_Production <ArrowRight className="w-3.5 h-3.5 group-hover/fix:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>      </div>
    </div>
  );
}
