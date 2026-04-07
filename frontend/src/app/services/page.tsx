'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database, Globe, Search, Filter, 
  ExternalLink, Zap, Image as ImageIcon, 
  Film, DollarSign, Activity, RefreshCw, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Model {
  id: string;
  name: string;
  type: string;
  price: string;
  unit: string;
}

export default function ServicesOffice() {
  const [activeProvider, setActiveProvider] = useState<'fal.ai' | 'kie.ai'>('fal.ai');
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const fetchModels = async (provider: string) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/services/models?provider=${provider}`);
      if (res.ok) {
        setModels(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch models:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels(activeProvider);
  }, [activeProvider]);

  const handleScan = async () => {
    setScanning(true);
    // Simulate deep scanning/importing
    await new Promise(r => setTimeout(r, 2000));
    fetchModels(activeProvider);
    setScanning(false);
  };

  return (
    <div className="min-h-screen text-white font-inter p-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full animate-pulse-glow" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 blur-[150px] rounded-full animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-16">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg shadow-primary/10 group">
              <Database className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-glow uppercase italic">Registry Console</h1>
              <div className="flex items-center gap-3 mt-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Managed Global Service Catalog</p>
              </div>
            </div>
          </div>

          {/* Provider Tabs */}
          <div className="flex gap-4">
            {[
              { id: 'fal.ai', name: 'Fal.ai Protocol', icon: Globe },
              { id: 'kie.ai', name: 'Kie.ai Node', icon: Database }
            ].map((provider) => (
              <button
                key={provider.id}
                onClick={() => setActiveProvider(provider.id as any)}
                className={`flex items-center gap-4 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border ${
                  activeProvider === provider.id 
                    ? 'bg-white text-black border-white shadow-xl shadow-white/10' 
                    : 'bg-white/[0.02] border-white/5 text-gray-500 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                <provider.icon className="w-4 h-4" />
                {provider.name}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Main Catalog */}
          <div className="lg:col-span-3 space-y-10">
            <div className="flex items-center justify-between gap-6">
              <div className="relative flex-1 max-w-lg group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Query Registry for Architectures..."
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-xs font-bold focus:outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all"
                />
              </div>
              
              <button 
                onClick={handleScan}
                disabled={scanning}
                className="flex items-center gap-3 px-8 py-4 bg-white/[0.03] hover:bg-white/[0.08] rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all active:scale-95"
              >
                <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin text-primary' : ''}`} />
                {scanning ? 'Synchronizing Node...' : 'Fetch Registry Metadata'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  [1, 2, 3, 4].map(i => (
                    <div key={i} className="h-52 glass-card animate-pulse" />
                  ))
                ) : (
                  models.map((model, idx) => (
                    <motion.div
                      key={model.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="glass-card p-8 group hover:border-primary/30 transition-all hover:bg-white/[0.03] relative overflow-hidden border border-white/[0.05]"
                    >
                      <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className={`p-4 rounded-2xl ${model.type === 'Video' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'} border border-white/5 shadow-inner`}>
                          {model.type === 'Video' ? <Film className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-1.5">Consumption Rate</span>
                          <div className="flex items-center gap-1.5 text-xl font-black text-green-400">
                            <DollarSign className="w-4 h-4" />
                            {model.price}
                            <span className="text-[10px] text-gray-600 font-bold ml-1">/{model.unit}</span>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors uppercase tracking-tighter text-glow">{model.name}</h3>
                      <div className="flex items-center gap-4 text-[10px] font-black text-gray-500 uppercase tracking-widest relative z-10">
                        <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> Multi-Agent Ready</span>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
                      </div>

                      <button className="mt-8 w-full py-4 bg-white/[0.03] group-hover:bg-primary text-gray-500 group-hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5 group-hover:border-transparent active:scale-95 shadow-xl">
                        Deploy to Protocol
                      </button>
                      
                      {/* Visual Decor */}
                      <div className="absolute -bottom-4 -right-4 p-4 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity pointer-events-none transform rotate-12">
                        <Zap className="w-32 h-32" />
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar: Production Usage */}
          <div className="space-y-8 relative z-10">
            <div className="obsidian-card p-10">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-8 border-b border-white/5 pb-6">Protocol Economics</h4>
              <div className="space-y-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-bold">Standard Rate</span>
                  <span className="font-black text-green-400 uppercase tracking-tight">$0.05 / UT</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-bold">Connected Nodes</span>
                  <span className="font-black text-white">{models.length}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-bold">Cluster Latency</span>
                  <span className="font-black text-primary uppercase tracking-tight">0.4ms avg</span>
                </div>
              </div>
              
              <div className="mt-10 pt-10 border-t border-white/5">
                <button className="w-full py-5 bg-white text-black hover:bg-primary rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all active:scale-95">
                  Synchronize Balances
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/10 rounded-[3rem] p-10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Zap className="w-8 h-8 text-primary mb-6 relative z-10" />
              <h4 className="text-xl font-black mb-3 relative z-10 tracking-tight uppercase">Protocol Tip</h4>
              <p className="text-xs text-gray-400 leading-relaxed font-bold uppercase tracking-wide relative z-10">Use Quantized LLMs for the 'Initial Scripting' to minimize Universal Token consumption.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
