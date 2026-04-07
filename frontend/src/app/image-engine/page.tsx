'use client';

import React, { useState } from 'react';
import { 
  ImageIcon, Wand2, Sparkles, Sliders, 
  Layout, Type, CheckCircle, ArrowRight,
  Monitor, Smartphone, Square, RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const stylePresets = [
  { id: '3d-cartoon', name: '3D Cartoon', icon: '🎨', desc: 'Disney/Pixar Style Graphics' },
  { id: 'cinematic', name: 'Cinematic', icon: '🎬', desc: 'High Dynamic Lighting & Realism' },
  { id: 'anime', name: 'Anime', icon: '🎌', desc: 'Modern Studio Ghibli Aesthetic' },
  { id: 'cyberpunk', name: 'Cyberpunk', icon: '🌃', desc: 'Neon Lights & Tech Details' },
];

const categories = [
  { id: 'chars', name: 'Characters', icon: '👤' },
  { id: 'env', name: 'Backgrounds', icon: '🏞️' },
  { id: 'props', name: 'Objects', icon: '💎' },
];

export default function ImageEngine() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('3d-cartoon');
  const [generating, setGenerating] = useState(false);
  const [ratio, setRatio] = useState('9:16');

  const handleGenerate = async () => {
    setGenerating(true);
    // Simulate generation
    await new Promise(r => setTimeout(r, 3000));
    setGenerating(false);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-inter p-12 relative overflow-hidden">
      {/* Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="ambient-glow from-amber-500/10 top-[-10%] right-[-10%] w-[50%] h-[50%] animate-ambient-glow" />
      </div>

      <header className="mb-16 relative z-10">
        <div className="flex items-center gap-6 mb-4">
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-500 shadow-lg shadow-amber-500/10">
            <Wand2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none block">Image Engine</h1>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Industrial_Visual_Asset_Synthesizer_V4</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative z-10">
        
        {/* Creation Core */}
        <div className="lg:col-span-3 space-y-12">
          
          {/* Prompt Entry (The Stage) */}
          <section className="glass-card p-1 relative group overflow-hidden">
            <div className="bg-black/20 rounded-[2.2rem] p-10 relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <Type className="w-4 h-4 text-amber-500" />
                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Instructional_Data_Input</h3>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your 3D character or scenery in detail..."
                className="w-full bg-transparent text-3xl font-black min-h-[160px] focus:outline-none placeholder:text-white/5 leading-tight no-scrollbar resize-none selection:bg-amber-500/30"
              />
              
              <div className="flex flex-wrap gap-3 mt-10">
                {categories.map(cat => (
                  <button key={cat.id} className="px-5 py-2.5 bg-white/[0.03] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/[0.08] transition-all text-white/40 hover:text-white active:scale-95">
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
              <Sparkles className="w-48 h-48 rotate-12 text-amber-500" />
            </div>
          </section>

          {/* Style Presets */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-white/5" />
              <div className="flex items-center gap-3">
                <Sliders className="w-4 h-4 text-amber-500" />
                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Aesthetic_Core_Presets</h3>
              </div>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stylePresets.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-8 rounded-[2rem] text-left transition-all border group relative overflow-hidden active:scale-95 ${
                    selectedStyle === style.id 
                      ? 'bg-white/[0.05] border-amber-500 shadow-xl shadow-amber-500/10' 
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className={`text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all ${selectedStyle === style.id ? 'grayscale-0' : ''}`}>{style.icon}</div>
                  <h4 className="font-black text-xs mb-2 uppercase tracking-widest">{style.name}</h4>
                  <p className={`text-[9px] font-bold leading-relaxed tracking-wide ${selectedStyle === style.id ? 'text-amber-500/60' : 'text-white/20'}`}>
                    {style.desc}
                  </p>
                  {selectedStyle === style.id && (
                    <motion.div layoutId="check" className="absolute top-6 right-6">
                      <CheckCircle className="w-5 h-5 text-amber-500" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Ratio & Generation */}
          <div className="flex items-center justify-between pt-12 border-t border-white/[0.05]">
            <div className="flex items-center gap-3">
              {[
                { id: '9:16', name: 'Portrait', icon: Smartphone },
                { id: '16:9', name: 'Cinema', icon: Monitor },
                { id: '1:1', name: 'Square', icon: Square },
              ].map(opt => (
                <button 
                  key={opt.id}
                  onClick={() => setRatio(opt.id)}
                  className={`px-5 py-3 rounded-2xl transition-all border flex items-center gap-3 text-[10px] font-black uppercase tracking-widest active:scale-95 ${
                    ratio === opt.id ? 'bg-white text-black border-white' : 'bg-white/[0.03] border-white/5 text-white/30 hover:text-white'
                  }`}
                >
                  <opt.icon className="w-4 h-4" />
                  {opt.name}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || !prompt}
              className={`px-12 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.3em] flex items-center gap-4 transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed group relative overflow-hidden ${
                generating ? 'bg-white/[0.05] text-amber-500' : 'bg-amber-500 text-black shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)]'
              }`}
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              {generating ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Realize_Assets</>}
            </button>
          </div>

        </div>

        {/* Sidebar: Engine Monitor */}
        <div className="space-y-6">
          <div className="glass-card p-1">
            <div className="bg-black/20 rounded-[2.2rem] p-8">
              <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-10 border-b border-white/5 pb-5">Engine_Logic_Feed</h4>
              
              <div className="space-y-10">
                <div className="flex items-center gap-5">
                  <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/80">Flux_Node_Loaded</div>
                    <div className="text-[9px] font-bold text-white/20 mt-1 uppercase">Auto_Enhance_Status: Active</div>
                  </div>
                </div>
                
                <div className="p-5 bg-white/[0.02] rounded-3xl border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Compute_Load</span>
                    <span className="text-[9px] font-black text-amber-500 uppercase">Idle_0%</span>
                  </div>
                  <div className="w-full bg-black/40 h-1 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[2%] shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-5 bg-white/[0.03] rounded-2xl hover:bg-white/[0.08] transition-all group border border-transparent hover:border-white/10 active:scale-95">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-white">Recent_Cores</span>
                    <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                  <button className="w-full flex items-center justify-between p-5 bg-white/[0.03] rounded-2xl hover:bg-white/[0.08] transition-all group border border-transparent hover:border-white/10 active:scale-95">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-white">Relay_To_Quality</span>
                    <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Factory Preview */}
          <div className="glass-panel p-8 text-center relative group overflow-hidden">
            <div className="absolute inset-0 bg-amber-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <ImageIcon className="w-10 h-10 text-amber-500/40 mx-auto mb-6 group-hover:scale-110 transition-transform" />
            <h4 className="text-[11px] font-black uppercase tracking-widest mb-3">Visual_Consistency_Module</h4>
            <p className="text-[9px] font-bold text-white/20 leading-relaxed uppercase tracking-wider">Enabled characters weights to maintain visual identity across all generated frames.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
