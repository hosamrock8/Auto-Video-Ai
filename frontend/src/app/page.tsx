'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Globe, Sparkles, 
  History, 
  Loader2, Paperclip, Smile, 
  ChevronDown, Mic, Send, LayoutGrid, Volume2, Search,
  Settings as SettingsIcon,
  User,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

function Cube(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}
import { useStudioStore } from '@/store/useStudioStore';
import ScriptReview from '@/components/V2/ScriptReview';
import AssetReview from '@/components/V2/AssetReview';
import FinalExport from '@/components/V2/FinalExport';
import WorkflowBar from '@/components/V2/WorkflowBar';

interface Project {
  id: string;
  status: string;
  input: string | null;
  script: {
    title: string;
    scenes: Array<{
      scene_number: number;
      narrator_text: string;
      image_prompt: string;
      motion_direction: string;
    }>;
  } | null;
  assets: {
    scenes: Array<{
      scene: number;
      audio: string;
      image: string;
    }>;
  } | null;
  costs: {
    total: number;
    details: Array<any>;
  };
  output_video?: string;
  thumbnail?: string;
  seo?: {
    titles: string[];
    description: string;
    tags: string[];
  };
  error_log: string | null;
}

export default function V2CommandCenter() {
  const router = useRouter();
  const { 
    currentProject, 
    allProjects,
    loading, 
    isPolling,
    initProject, 
    fetchProject,
    generateScript, 
    generateAssets,
    regenerateScene,
    finalizeProduction,
    updateScriptLocally 
  } = useStudioStore();

  const [source, setSource] = useState('');
  const [showRecents, setShowRecents] = useState(false);

  const handleStart = async () => {
    if (!source) return;
    const id = await initProject();
    await generateScript(id, source);
  };

  const handleWorkflowAction = async () => {
    if (!currentProject) return;
    
    if (currentProject.status === 'draft' || currentProject.status === 'error') {
      await handleStart();
    } else if (currentProject.status === 'awaiting_script_approval') {
      await generateAssets(currentProject.id);
    } else if (currentProject.status === 'awaiting_asset_approval') {
      await finalizeProduction(currentProject.id);
    }
  };

  return (
    <div className="min-h-screen text-white font-inter flex flex-col items-center relative overflow-hidden bg-[#030303]">
      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="ambient-glow from-primary/10 top-[-10%] left-[-10%] w-[60%] h-[60%] animate-ambient-glow" />
        <div className="ambient-glow from-secondary/10 bottom-[-10%] right-[-10%] w-[60%] h-[60%] animate-ambient-glow" style={{ animationDelay: '-4s' }} />
      </div>

      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-12 py-10 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Cube className="w-5 h-5 text-white" />
            </div>
            <div>
               <span className="font-black text-xl tracking-tighter uppercase italic leading-none block">Lumina</span>
               <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mt-1 block">Protocol</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
            <button className="hover:text-white transition-colors relative group">
               Factory
               <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform" />
            </button>
            <button className="hover:text-white transition-colors" onClick={() => router.push('/services')}>Registry</button>
            <button className="hover:text-white transition-colors">Archive</button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.push('/settings')}
            className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all active:scale-95 group"
          >
            <SettingsIcon className="w-5 h-5 text-white/40 group-hover:text-white" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
            <User className="w-6 h-6 text-white/40" />
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full flex flex-col items-center justify-center p-6 relative z-10 pt-40">
        <AnimatePresence mode="wait">
          {(!currentProject || currentProject.status === 'draft') ? (
            /* Input Phase: THE STAGE */
            <motion.div 
               key="input"
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95 }}
               transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
               className="w-full max-w-5xl flex flex-col items-center"
            >
               {/* Stage Lighting Decor */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-primary/5 blur-[160px] opacity-50 rounded-full pointer-events-none" />

               {/* Cinematic Branding */}
               <div className="flex flex-col items-center mb-20 text-center relative">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative mb-12"
                  >
                    <div className="absolute inset-0 bg-primary/30 blur-[100px] rounded-full animate-pulse-glow" />
                    <div className="relative w-28 h-28 bg-white/[0.02] backdrop-blur-xl rounded-[3rem] flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Cube className="w-14 h-14 text-white relative z-10" />
                    </div>
                  </motion.div>
                  <h1 className="text-7xl font-black tracking-tighter text-white mb-6 text-glow leading-none">THE ENGINE ROOM</h1>
                  <div className="flex items-center gap-4">
                     <div className="h-px w-8 bg-white/10" />
                     <p className="text-white/30 font-black tracking-[0.5em] uppercase text-[10px]">
                        Production Protocol LMN_ST_V2
                     </p>
                     <div className="h-px w-8 bg-white/10" />
                  </div>
               </div>

               {/* Main Production Card (Glassmorphism 2.0) */}
               <div className="w-full glass-card p-4 relative group">
                  <div className="bg-black/20 rounded-[2.2rem] overflow-hidden">
                    {/* Card Header: Control Strip */}
                    <div className="flex items-center justify-between px-12 py-10 border-b border-white/[0.03] bg-white/[0.01]">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-50" />
                            <Zap className="w-7 h-7 text-primary relative z-10" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] leading-none mb-2">Primary Node</p>
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Cluster_Alpha_V2</h2>
                          </div>
                       </div>

                       <div className="flex items-center gap-8">
                          <div className="flex items-center gap-6 pr-8 border-r border-white/5">
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Agent_Pool</p>
                            <div className="flex -space-x-3">
                               {[1,2,3,4].map(i => (
                                 <div key={i} className="w-11 h-11 rounded-2xl border-2 border-[#030303] bg-white/[0.03] flex items-center justify-center backdrop-blur-md hover:-translate-y-1 transition-transform cursor-pointer">
                                   <Sparkles className={`w-5 h-5 ${i === 1 ? 'text-primary' : i === 2 ? 'text-secondary' : 'text-white/20'}`} />
                                 </div>
                               ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Operational</span>
                          </div>
                       </div>
                    </div>

                    {/* Input Area: Cinematic Stage */}
                    <div className="relative px-12 py-16 group/input">
                       <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                       <textarea 
                         value={source}
                         onChange={(e) => setSource(e.target.value)}
                         placeholder="Describe your creative vision...&#10;&quot;Synthesize a 3D cinematic teaser for Project X&quot;"
                         className="w-full bg-transparent text-4xl font-black min-h-[220px] focus:outline-none placeholder:text-white/5 leading-[1.2] no-scrollbar resize-none selection:bg-primary/30 transition-all duration-700 overflow-hidden"
                       />
                    </div>

                    {/* Footer Toolbar: Tool Cluster */}
                    <div className="flex items-center justify-between px-10 py-8 bg-black/40 border-t border-white/[0.03]">
                       <div className="flex items-center gap-3">
                          <button className="p-4 text-white/20 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 active:scale-95">
                             <LayoutGrid className="w-5 h-5" />
                          </button>
                          <button className="p-4 text-white/20 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 active:scale-95">
                             <Search className="w-5 h-5" />
                          </button>
                          <div className="mx-4 w-px h-10 bg-white/5" />
                          <button className="flex items-center gap-4 px-6 py-3 bg-white/[0.03] hover:bg-white/[0.08] rounded-2xl transition-all border border-white/5 active:scale-95">
                             <Globe className="w-4 h-4 text-primary" />
                             <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Language_EN</span>
                          </button>
                       </div>
                       
                       <div className="flex items-center gap-8">
                          <button className="p-4 text-white/10 hover:text-primary transition-all active:scale-90">
                            <Mic className="w-7 h-7" />
                          </button>
                          <button
                             onClick={handleStart}
                             disabled={loading || !source}
                             className={`group relative flex items-center gap-5 px-12 py-5 rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 overflow-hidden ${
                                loading || !source
                                ? 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5'
                                : 'btn-gradient border border-white/20'
                             }`}
                          >
                             <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                             {loading ? (
                                <div className="flex items-center gap-4">
                                   <Loader2 className="w-5 h-5 animate-spin" />
                                   <span>Cluster_Sync...</span>
                                </div>
                             ) : (
                                <div className="flex items-center gap-4">
                                   <span>Initiate Protocol</span>
                                   <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </div>
                             )}
                          </button>
                       </div>
                    </div>
                  </div>
               </div>

               {/* Modern Recents Dropdown */}
               <div className="relative mt-20 group">
                  <motion.button 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    onClick={() => setShowRecents(!showRecents)}
                    className="flex items-center gap-5 text-white/30 hover:text-white transition-all text-[11px] font-black uppercase tracking-[0.4em] group relative py-5 px-10 bg-white/[0.02] rounded-full border border-white/5 active:scale-95"
                  >
                    <History className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    Archive_Access
                    <div className="w-7 h-7 rounded-xl bg-white/5 flex items-center justify-center text-[10px] text-primary">{allProjects.length}</div>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${showRecents ? 'rotate-180' : ''}`} />
                  </motion.button>

                  <AnimatePresence>
                    {showRecents && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full mb-6 left-1/2 -translate-x-1/2 w-96 glass-card p-4 z-50 origin-bottom shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
                      >
                         <div className="max-h-72 overflow-y-auto no-scrollbar space-y-2">
                            {allProjects.length === 0 ? (
                               <div className="py-12 text-center text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">No_Project_Data</div>
                            ) : (
                               allProjects.map((p: any) => (
                                 <button
                                   key={p.id}
                                   onClick={() => {
                                      fetchProject(p.id);
                                      setShowRecents(false);
                                   }}
                                   className="w-full flex items-center gap-5 p-5 hover:bg-white/[0.04] rounded-3xl transition-all group/item border border-transparent hover:border-white/5"
                                 >
                                    <div className={`w-2.5 h-2.5 rounded-full ${p.status === 'completed' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-primary shadow-[0_0_10px_rgba(168,85,247,0.6)]'}`} />
                                    <div className="flex-1 text-left">
                                       <p className="text-[10px] font-black text-white uppercase tracking-tight truncate max-w-[160px]">{p.input || 'Running Protocol...'}</p>
                                       <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.3em] mt-1.5">{p.id}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-white/10 group-hover/item:text-white group-hover/item:translate-x-1 transition-all" />
                                 </button>
                               ))
                            )}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </motion.div>
          ) : ['scripting', 'generating_assets', 'assembling'].includes(currentProject.status) ? (
            /* Processing State: IMMERSIVE */
            <motion.div 
               key="processing"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="flex flex-col items-center justify-center space-y-16"
            >
               <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-[120px] animate-pulse rounded-full" />
                  <div className={`w-56 h-56 border-2 rounded-full animate-spin shadow-[0_0_80px_rgba(168,85,247,0.2)] relative transition-all duration-1000 ${
                    currentProject.status === 'generating_assets' ? 'border-primary/10 border-t-amber-500' : 
                    currentProject.status === 'assembling' ? 'border-primary/10 border-t-blue-500' :
                    'border-primary/10 border-t-primary'
                  }`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Cube className={`w-16 h-16 animate-pulse transition-all duration-1000 ${
                      currentProject.status === 'generating_assets' ? 'text-amber-500' : 
                      currentProject.status === 'assembling' ? 'text-blue-500' :
                      'text-primary'
                    }`} />
                  </div>
               </div>
               <div className="text-center space-y-6">
                  <h3 className="text-5xl font-black uppercase tracking-tighter text-glow italic">
                    {currentProject.status.replace(/_/g, ' ')}_In_Progress
                  </h3>
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <p className="text-white/30 font-black uppercase tracking-[0.4em] text-[10px]">Active_Node_Syncing_With_Cloud</p>
                  </div>
               </div>
            </motion.div>
          ) : (currentProject.status === 'awaiting_script_approval' && currentProject.script) ? (
            /* Stage 1: Script Review (Modified for Glass theme) */
            <motion.div 
               key="review-script"
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -30 }}
               className="w-full px-12"
            >
               <ScriptReview 
                 scenes={currentProject.script.scenes} 
                 onUpdate={(newScenes) => updateScriptLocally({ ...currentProject.script, scenes: newScenes })} 
               />
            </motion.div>
          ) : (currentProject.status === 'awaiting_asset_approval' && currentProject.assets) ? (
            /* Stage 2: Asset Review (Modified for Glass theme) */
            <motion.div 
               key="review-assets"
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -30 }}
               className="w-full px-12"
            >
               <AssetReview 
                 assets={currentProject.assets.scenes || []} 
                 onRegenerate={(n) => regenerateScene(currentProject.id, n)}
                 isPolling={isPolling}
               />
            </motion.div>
          ) : (currentProject.status === 'completed' && currentProject.output_video) ? (
            /* Stage 3: Completion (Modified for Glass theme) */
            <motion.div
               key="completed"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="w-full px-12"
            >
               <FinalExport 
                 videoUrl={currentProject.output_video}
                 thumbnailUrl={currentProject.thumbnail || ''}
                 seo={currentProject.seo || { titles: [], description: '', tags: [] }}
               />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* Persistent Bottom Bar (WorkflowBar) */}
      {currentProject && currentProject.status !== 'completed' && (
        <WorkflowBar 
          status={currentProject.status}
          totalCost={currentProject.costs.total}
          onAction={handleWorkflowAction}
          loading={loading}
        />
      )}
    </div>
  );
}
