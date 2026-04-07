'use client';

import React, { useState } from 'react';
import { X, Save, Key, Sliders, Play, CheckCircle, Cpu, ImageIcon, Video, Mic, Music, Volume2, Settings as SettingsIcon, Zap } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsSidebar({ isOpen, onClose }: SettingsSidebarProps) {
  const settingsStore = useSettingsStore();
  const [activeTab, setActiveTab] = useState('llm');

  const CATEGORIES = [
    { id: 'llm', icon: Cpu, label: 'AI' },
    { id: 'image', icon: ImageIcon, label: 'IMG' },
    { id: 'video', icon: Video, label: 'VID' },
    { id: 'audio', icon: Mic, label: 'VOX' },
    { id: 'global', icon: SettingsIcon, label: 'SYS' },
  ];

  if (!isOpen) return null;

  const currentConfig = (settingsStore as any)[activeTab];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-md transition-all">
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="w-full max-w-sm bg-[#0A0A0B] border-l border-white/10 h-full shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden"
      >
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <h2 className="text-lg font-black text-white tracking-tighter uppercase italic">Quick Setup</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors group">
            <X className="w-5 h-5 text-gray-500 group-hover:text-white" />
          </button>
        </div>

        {/* Mini Tab Navigation */}
        <div className="flex border-b border-white/5 bg-black/20">
           {CATEGORIES.map(cat => (
             <button 
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex-1 flex flex-col items-center py-3 gap-1 transition-all relative ${
                activeTab === cat.id ? 'text-purple-400' : 'text-gray-600 hover:text-gray-400'
              }`}
             >
                <cat.icon className="w-4 h-4" />
                <span className="text-[9px] font-black tracking-widest uppercase">{cat.label}</span>
                {activeTab === cat.id && (
                  <motion.div layoutId="sidebar-active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
                )}
             </button>
           ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">
                  {activeTab} <span className="text-gray-700">Config</span>
                </h3>
                <p className="text-[10px] text-gray-600 font-medium">Quick adjustments for active pipeline.</p>
              </div>

              {activeTab === 'global' ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Format</label>
                    <select 
                      value={settingsStore.global?.aspect_ratio}
                      onChange={(e) => settingsStore.updateCategory('global', { aspect_ratio: e.target.value as any })}
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50"
                    >
                      <option value="9:16">Portrait (9:16)</option>
                      <option value="16:9">Landscape (16:9)</option>
                      <option value="1:1">Square (1:1)</option>
                    </select>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Provider</label>
                    <input
                      type="text"
                      readOnly
                      value={currentConfig?.provider}
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-gray-400 capitalize cursor-default"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">API Key</label>
                    <div className="relative group/key">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-700 group-focus-within/key:text-purple-500" />
                      <input
                        type="password"
                        value={currentConfig?.api_key || ''}
                        onChange={(e) => settingsStore.updateCategory(activeTab, { api_key: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50 placeholder:text-gray-800"
                        placeholder="••••••••••••"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Model ID</label>
                    <input
                      type="text"
                      value={currentConfig?.model_id || ''}
                      onChange={(e) => settingsStore.updateCategory(activeTab, { model_id: e.target.value })}
                      className="w-full bg-[#121214] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-gray-400 focus:outline-none focus:border-purple-500/50 font-mono"
                    />
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-black/20 gap-3 flex flex-col">
          <button
            onClick={async () => {
              const allSettings = {
                llm: settingsStore.llm,
                image: settingsStore.image,
                video: settingsStore.video,
                audio: settingsStore.audio,
                music: settingsStore.music,
                sfx: settingsStore.sfx,
                global: settingsStore.global,
              };
              await settingsStore.updateSettings(allSettings);
            }}
            disabled={settingsStore.loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50"
          >
            {settingsStore.loading ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Deploy Configuration
              </>
            )}
          </button>
          <button 
            onClick={() => {
              onClose();
              window.location.href = '/settings';
            }}
            className="w-full py-3.5 bg-white/5 border border-white/5 text-gray-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all"
          >
            Open Command Center
          </button>
        </div>
      </motion.div>
    </div>
  );
}
