'use client';

import React, { useState } from 'react';
import { 
  Film, Sparkles, Wand2, Type, 
  ImageIcon, Play, Sliders, CheckCircle,
  ArrowRight, Activity, Zap, RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const videoModes = [
  { 
    id: 'script-to-video', 
    name: 'Script-to-Video', 
    icon: Type, 
    desc: 'Generate complete scenes directly from narrative text.',
    color: 'text-purple-400'
  },
  { 
    id: 'image-to-video', 
    name: 'Image Animate', 
    icon: ImageIcon, 
    desc: 'Transform static images into cinematic 3D motion.',
    color: 'text-blue-400'
  }
];

const styles = [
  { id: 'disney-3d', name: '3D Cartoon', icon: '🎨' },
  { id: 'realistic', name: 'Cinematic', icon: '🎬' },
  { id: 'anime', name: 'Anime v2', icon: '🎌' },
];

export default function VideoEngine() {
  const [activeMode, setActiveMode] = useState('script-to-video');
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 4000));
    setGenerating(false);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-inter p-12 relative overflow-hidden">
      {/* Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="ambient-glow from-blue-500/10 bottom-[-10%] left-[-10%] w-[50%] h-[50%] animate-ambient-glow" />
      </div>

      <header className="mb-16 relative z-10">
        <div className="flex items-center gap-6 mb-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 shadow-lg shadow-blue-500/10">
            <Film className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none block">Video Engine</h1>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Motion_Synthesis_Protocol_V6</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative z-10">
        
        {/* Creation Hub */}
        <div className="lg:col-span-3 space-y-12">
          
          {/* Mode Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videoModes.map(mode => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`p-10 rounded-[2.5rem] border text-left transition-all relative overflow-hidden group active:scale-95 ${
                  activeMode === mode.id 
                    ? 'bg-white/[0.05] border-blue-500 shadow-xl shadow-blue-500/10' 
                    : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className={`p-4 rounded-2xl shadow-lg transition-colors ${activeMode === mode.id ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-white/5 text-white/30'}`}>
                    <mode.icon className="w-6 h-6" />
                  </div>
                  {activeMode === mode.id && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                       <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-black mb-3 uppercase tracking-tighter italic relative z-10">{mode.name}</h3>
                <p className={`text-[10px] leading-relaxed max-w-[200px] font-black uppercase tracking-widest relative z-10 ${activeMode === mode.id ? 'text-blue-100/60' : 'text-white/20'}`}>
                  {mode.desc}
                </p>
                
                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <mode.icon className="w-48 h-48 rotate-12 text-blue-500" />
                </div>
              </button>
            ))}
          </div>

          {/* Prompt / Upload Area (The Stage) */}
          <section className="glass-card p-1 relative group overflow-hidden">
            <div className="bg-black/20 rounded-[2.2rem] p-12 relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <Wand2 className="w-5 h-5 text-blue-500" />
                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">
                  {activeMode === 'script-to-video' ? 'Narrative_Production_Script' : 'Motion_Animate_Parameters'}
                </h4>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={activeMode === 'script-to-video' 
                  ? "Describe the full scene, camera movement, and characters..."
                  : "How should the image transform? (e.g., slow zoom, wind movement)..."
                }
                className="w-full bg-transparent text-3xl font-black min-h-[220px] focus:outline-none placeholder:text-white/5 leading-tight no-scrollbar resize-none selection:bg-blue-500/30"
              />

              <div className="flex flex-wrap gap-4 mt-10">
                {styles.map(s => (
                  <button key={s.id} className="flex items-center gap-3 px-6 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all active:scale-95">
                    <span>{s.icon}</span>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-12 border-t border-white/[0.05]">
            <div className="flex items-center gap-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-2 leading-none">Est_Node_Cost</span>
                <span className="text-xl font-black text-green-500 italic">$0.15_Unit</span>
              </div>
              <div className="h-10 w-px bg-white/5" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-2 leading-none">Latency_Index</span>
                <span className="text-xl font-black text-blue-500 italic">~60s_Sync</span>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || !prompt}
              className={`px-12 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.3em] flex items-center gap-4 transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed group relative overflow-hidden ${
                generating ? 'bg-white/[0.05] text-blue-500' : 'bg-blue-600 text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] border border-white/20'
              }`}
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              {generating ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Start_Synthesis</>}
            </button>
          </div>

        </div>

        {/* Sidebar: Engine Monitor */}
        <div className="space-y-6">
          <div className="glass-card p-1">
            <div className="bg-black/20 rounded-[2.2rem] p-8">
              <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-10 border-b border-white/5 pb-5">Video_Engine_Telemetry</h4>
              
              <div className="space-y-10">
                <div className="flex items-center gap-5">
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/80">Video_Pro_V3_Cluster</div>
                    <div className="text-[9px] font-bold text-white/20 mt-1 uppercase">Automated_Frame_Match: ON</div>
                  </div>
                </div>

                <div className="p-5 bg-white/[0.02] rounded-3xl border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Queue_Position</span>
                    <span className="text-[9px] font-black text-blue-500 uppercase">Priority_Zero</span>
                  </div>
                  <div className="w-full bg-black/40 h-1 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-full shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                  </div>
                </div>

                <div className="bg-white/[0.02] rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-blue-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h5 className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-5 relative z-10">Process_Stream</h5>
                  <div className="space-y-3 relative z-10">
                     {[1, 2, 3].map(i => (
                       <div key={i} className="h-1 bg-white/5 rounded-full relative overflow-hidden">
                          <motion.div 
                            animate={{ x: ['-100%', '100%'] }} 
                            transition={{ duration: 2 + i, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 bg-blue-500/50 w-1/3" 
                          />
                       </div>
                     ))}
                  </div>
                </div>

                <button className="w-full py-5 bg-white text-black rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-xl hover:bg-blue-500 hover:text-white transition-colors">
                  Sync_Neural_Engines
                </button>
              </div>
            </div>
          </div>

          {/* Pro Factory Preview */}
          <div className="glass-panel p-8 text-center relative group overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            <Zap className="w-10 h-10 text-blue-500/40 mx-auto mb-6 group-hover:scale-110 transition-transform" />
            <h4 className="text-[11px] font-black uppercase tracking-widest mb-3">Unified_3D_Path</h4>
            <p className="text-[9px] font-bold text-white/20 leading-relaxed uppercase tracking-wider">This path bypasses intermediate image generation for faster 'Script-to-Shorts' workflows.</p>
          </div>
        </div>      </div>
    </div>
  );
}
