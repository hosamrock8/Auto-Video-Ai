'use client';

import React, { useState, useEffect } from 'react';
import { 
  Save, Key, Sliders, Shield, 
  Activity, ArrowLeft, Cpu, Image as ImageIcon, 
  Video, Mic, Music, Volume2, CheckCircle2, AlertCircle,
  RefreshCw, Zap, Lock, Eye, EyeOff, Info, HelpCircle,
  Plus, Trash2, Globe, Search, LayoutGrid, X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/store/useSettingsStore';

const SIDEBAR_ITEMS = [
  { id: 'llm', label: 'LLM', icon: Cpu },
  { id: 'image', label: 'Image Generation', icon: ImageIcon },
  { id: 'video', label: 'Video Generation', icon: Video },
  { id: 'audio', label: 'Text-to-Speech', icon: Mic },
  { id: 'stt', label: 'Speech Recognition', icon: Volume2 },
  { id: 'pdf', label: 'PDF Parsing', icon: Key }, // Dummy icon for PDF
  { id: 'search', label: 'Web Search', icon: Search },
  { id: 'system', label: 'System', icon: Sliders },
];

const MOCK_MODELS: Record<string, any[]> = {
  llm: [
    { id: 'gemini-3.1-pro', label: 'Gemini 3.1 Pro Preview', features: ['keys', 'grid', 'mic', 'folder'] },
    { id: 'gemini-3-flash', label: 'Gemini 3 Flash Preview', features: ['keys', 'grid', 'mic', 'folder'] },
    { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', features: ['keys', 'grid', 'mic', 'folder'] },
    { id: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite', features: ['keys', 'grid', 'mic', 'folder'] },
  ],
  image: [
    { id: 'flux-1-schnell', label: 'Flux.1 Schnell', features: ['grid', 'image'] },
    { id: 'flux-1-pro', label: 'Flux.1 Pro', features: ['grid', 'image'] },
  ],
};

const FEATURE_ICONS: Record<string, any> = {
  keys: Key,
  grid: LayoutGrid,
  mic: Mic,
  folder: LayoutGrid,
  image: ImageIcon,
};

export default function GeminiSettings() {
  const router = useRouter();
  const settingsStore = useSettingsStore();
  const [activeTab, setActiveTab] = useState('llm');
  const [showKey, setShowKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    settingsStore.fetchSettings();
  }, []);

  const handleSave = async () => {
    const allSettings = {
      llm: settingsStore.llm,
      image: settingsStore.image,
      video: settingsStore.video,
      audio: settingsStore.audio,
      music: settingsStore.music,
      sfx: settingsStore.sfx,
      global: settingsStore.global,
    };
    
    try {
      await settingsStore.updateSettings(allSettings);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      setSaveStatus('error');
    }
  };

  const handleTest = async () => {
    setTestResult({ status: 'testing' });
    const result = await settingsStore.testConnection(activeTab);
    setTestResult(result);
  };

  const currentConfig = (settingsStore as any)[activeTab] || { provider: 'openai', api_key: '', model_id: '' };

  return (
    <div className="min-h-screen text-white font-inter flex items-center justify-center p-8 relative overflow-hidden">
      {/* Immersive Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-7xl h-[88vh] glass-card flex overflow-hidden relative z-10"
      >
        {/* Sidebar */}
        <aside className="w-80 border-r border-white/[0.05] bg-black/40 flex flex-col py-10">
          <div className="px-10 mb-12 flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                <Cube className="w-5 h-5 text-white" />
             </div>
             <div>
                <span className="font-black tracking-tighter text-xl uppercase italic leading-none block">Lumina</span>
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1 block">Protocol V2</span>
             </div>
          </div>

          <nav className="flex-1 space-y-1 px-6 overflow-y-auto no-scrollbar">
            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] mb-4 ml-4">Engine Clusters</p>
            {SIDEBAR_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.25rem] text-xs font-black uppercase tracking-widest transition-all group ${
                  activeTab === item.id 
                    ? 'bg-white/[0.05] text-white border border-white/10 cyber-glow-cyan' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
                }`}
              >
                <item.icon className={`w-4 h-4 transition-colors ${activeTab === item.id ? 'text-primary' : 'text-gray-700 group-hover:text-gray-500'}`} />
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="px-6 mt-8 pt-8 border-t border-white/5">
             <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                <div className="flex items-center gap-x-2 mb-2">
                   <Activity className="w-3 h-3 text-green-500" />
                   <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">System Load</span>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                   <div className="bg-primary h-full w-1/3 shadow-[0_0_10px_rgba(0,242,255,0.5)]" />
                </div>
             </div>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 flex flex-col bg-black/20">
          <header className="flex items-center justify-between px-12 py-10 border-b border-white/[0.03]">
             <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center relative group">
                   <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                   {React.createElement(SIDEBAR_ITEMS.find(i => i.id === activeTab)?.icon || Cpu, { className: "w-7 h-7 text-white relative z-10" })}
                </div>
                <div>
                   <h2 className="text-3xl font-black tracking-tighter text-glow">
                     {SIDEBAR_ITEMS.find(i => i.id === activeTab)?.label}
                   </h2>
                   <div className="flex items-center gap-3 mt-1.5">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] leading-none">
                        Active Node: {activeTab.toUpperCase()}_CLUSTER_ALPHA
                      </p>
                   </div>
                </div>
             </div>
             
             <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] transition-opacity ${saveStatus === 'idle' ? 'opacity-0' : 'opacity-100'}`}>
                   {saveStatus === 'success' ? (
                     <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Settings Synchronized</span>
                     </>
                   ) : (
                     <>
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Protocol Sync Error</span>
                     </>
                   )}
                </div>
                <button 
                  onClick={() => router.push('/')}
                  className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all active:scale-95 group"
                >
                   <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-white" />
                </button>
             </div>
          </header>

          <div className="flex-1 overflow-y-auto px-12 pb-12 pt-10 space-y-12 no-scrollbar">
             {/* Configuration Grid */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* API Key Section */}
                <div className="space-y-5">
                   <div className="flex items-center justify-between px-1">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Credential Key</label>
                      <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Encrypted</span>
                   </div>
                   <div className="flex gap-4">
                      <div className="flex-1 relative group">
                         <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <Lock className="w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
                         </div>
                         <input
                           type={showKey ? 'text' : 'password'}
                           value={currentConfig.api_key}
                           onChange={(e) => settingsStore.updateCategory(activeTab, { api_key: e.target.value })}
                           className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl pl-14 pr-14 py-5 text-sm font-mono text-white focus:outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all"
                           placeholder="PROX_ALPHA_••••••••"
                         />
                         <button 
                           onClick={() => setShowKey(!showKey)}
                           className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                         >
                            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                         </button>
                      </div>
                      <button 
                       onClick={handleTest}
                       disabled={testResult?.status === 'testing'}
                       className="px-8 py-5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 group/btn active:scale-95 transition-all shadow-xl"
                      >
                        {testResult?.status === 'testing' ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                        ) : (
                          <Zap className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                        )}
                        Ping Node
                      </button>
                   </div>
                   {testResult && testResult.status !== 'testing' && (
                     <motion.div 
                       initial={{ opacity: 0, y: -10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className={`p-4 rounded-xl border flex items-center gap-3 ${testResult.status === 'success' ? 'bg-green-500/5 border-green-500/20 text-green-400' : 'bg-red-500/5 border-red-500/20 text-red-400'}`}
                     >
                       {testResult.status === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                       <span className="text-[11px] font-bold tracking-wide">{testResult.message || (testResult.status === 'success' ? 'Connection Established' : 'Access Denied')}</span>
                     </motion.div>
                   )}
                </div>

                {/* Base URL Section */}
                <div className="space-y-5">
                   <div className="flex items-center justify-between px-1">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Gateway Endpoint</label>
                      <Globe className="w-3.5 h-3.5 text-gray-600" />
                   </div>
                   <input
                     type="text"
                     value={currentConfig.custom_endpoint || ''}
                     onChange={(e) => settingsStore.updateCategory(activeTab, { custom_endpoint: e.target.value })}
                     className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl px-8 py-5 text-sm font-mono text-white focus:outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all"
                     placeholder="https://api.v2.lumina.ai/v1"
                   />
                </div>
             </div>

             {/* Models Registry */}
             <div className="space-y-8">
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.03]">
                   <div>
                      <h3 className="text-xl font-black uppercase tracking-tighter text-white">Model Registry</h3>
                      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">Available architectures for this cluster</p>
                   </div>
                   <div className="flex gap-4">
                      <button className="flex items-center gap-3 px-6 py-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                         <RefreshCw className="w-3.5 h-3.5" /> Re-Scan
                      </button>
                      <button className="flex items-center gap-3 px-6 py-3 bg-primary text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20">
                         <Plus className="w-3.5 h-3.5" /> Deploy Node
                      </button>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {(MOCK_MODELS[activeTab] || MOCK_MODELS.llm).map((model, idx) => (
                     <motion.div 
                      key={model.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-6 bg-white/[0.015] border border-white/[0.05] rounded-[2rem] hover:bg-white/[0.04] hover:border-white/10 transition-all group relative overflow-hidden"
                     >
                        <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                           <LayoutGrid className="w-20 h-20" />
                        </div>

                        <div className="flex flex-col gap-3 relative z-10">
                           <div className="flex items-center gap-3">
                              <span className="text-base font-black text-white tracking-tight uppercase">{model.label}</span>
                              <div className="px-2 py-0.5 bg-primary/10 rounded-md text-[8px] font-black text-primary uppercase border border-primary/20">Active</div>
                           </div>
                           <div className="flex gap-4">
                              {model.features.map((f: string, i: number) => {
                                const Icon = FEATURE_ICONS[f] || LayoutGrid;
                                return (
                                  <div key={i} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500">
                                     <Icon className="w-3 h-3 text-secondary" />
                                     <span>{i === 1 ? 'Quantized' : i === 2 ? 'Flash' : 'Standard'}</span>
                                  </div>
                                );
                              })}
                           </div>
                        </div>
                        <div className="flex items-center gap-2 relative z-10">
                           <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-500 hover:text-white transition-all border border-transparent hover:border-white/10">
                              <Sliders className="w-4 h-4" />
                           </button>
                           <button className="p-3 bg-white/5 hover:bg-red-500/10 rounded-xl text-gray-500 hover:text-red-500 transition-all border border-transparent hover:border-red-500/10">
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </motion.div>
                   ))}
                </div>
             </div>
          </div>

          {/* Persistent Footer */}
          <footer className="px-12 py-10 border-t border-white/[0.03] flex justify-between items-center bg-black/40 relative z-20">
             <div className="flex items-center gap-8 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                   Local Link Active
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                   V2_PROX_CONNECTED
                </div>
             </div>

             <div className="flex gap-4">
                <button 
                 onClick={() => router.push('/')}
                 className="px-10 py-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all active:scale-95"
                >
                   Discard
                </button>
                <button 
                 onClick={handleSave}
                 disabled={settingsStore.loading}
                 className="flex items-center gap-4 px-12 py-5 bg-white text-black rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-primary/20 hover:bg-primary transition-all active:scale-95 disabled:opacity-50"
                >
                   {settingsStore.loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                   Commit Changes
                </button>
             </div>
          </footer>
        </main>
      </motion.div>
    </div>
  );
}

// Missing Lucide Icon 'Cube' in some environments, ensuring it works
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
