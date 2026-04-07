'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Type, ImageIcon, Wand2, Trash2, 
  Plus, GripVertical, CheckCircle2, AlertCircle
} from 'lucide-react';

interface Scene {
  scene_number: number;
  narrator_text: string;
  image_prompt: string;
  motion_direction: string;
}

interface ScriptReviewProps {
  scenes: Scene[];
  onUpdate: (scenes: Scene[]) => void;
}

export default function ScriptReview({ scenes, onUpdate }: ScriptReviewProps) {
  const updateScene = (idx: number, updates: Partial<Scene>) => {
    const newScenes = [...scenes];
    newScenes[idx] = { ...newScenes[idx], ...updates };
    onUpdate(newScenes);
  };

  const removeScene = (idx: number) => {
    const newScenes = scenes.filter((_, i) => i !== idx)
      .map((s, i) => ({ ...s, scene_number: i + 1 }));
    onUpdate(newScenes);
  };

  const addScene = () => {
    const newScene: Scene = {
      scene_number: scenes.length + 1,
      narrator_text: "",
      image_prompt: "",
      motion_direction: "slow cinematic zoom"
    };
    onUpdate([...scenes, newScene]);
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-40 relative px-6">
      {/* Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="ambient-glow from-purple-500/10 top-[-10%] left-[-10%] w-[50%] h-[50%] animate-ambient-glow" />
      </div>

      <div className="flex items-center justify-between mb-16 relative z-10">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase mb-4 italic text-glow">Script Blueprint</h2>
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Scene_Architecture_Governance_Node</p>
        </div>
        <button 
          onClick={addScene}
          className="flex items-center gap-4 px-8 py-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-2xl text-[10px] font-black transition-all active:scale-95 uppercase tracking-widest text-white/40 hover:text-white"
        >
          <Plus className="w-5 h-5 text-purple-500" /> ADD_NEW_SCENE
        </button>
      </div>

      <div className="space-y-12 relative z-10">
        <AnimatePresence mode="popLayout">
          {scenes.map((scene, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card p-1 group relative overflow-hidden"
            >
              <div className="bg-black/20 rounded-[2.2rem] p-12 transition-all group-hover:bg-black/40">
                <div className="absolute left-[-20px] top-12 w-14 h-14 rounded-full bg-black border border-white/10 flex items-center justify-center text-[12px] font-black text-white/30 group-hover:text-purple-500 group-hover:border-purple-500 transition-all shadow-2xl z-20 italic">
                  #{scene.scene_number}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Voice/Narrator */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                      <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-500">
                        <Type className="w-4 h-4" />
                      </div>
                      Narrator_Stream_Arabic
                    </div>
                    <div className="relative group/field">
                      <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover/field:opacity-100 transition-opacity pointer-events-none rounded-3xl" />
                      <textarea
                        value={scene.narrator_text}
                        onChange={(e) => updateScene(idx, { narrator_text: e.target.value })}
                        className="w-full bg-black/40 border border-white/5 rounded-3xl p-8 text-xl font-black min-h-[160px] focus:outline-none focus:border-purple-500/30 transition-all placeholder:text-white/5 leading-relaxed selection:bg-purple-500/30 no-scrollbar"
                        dir="rtl"
                        placeholder="أدخل النص هنا..."
                      />
                    </div>
                  </div>

                  {/* Visual Prompt */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                      <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      Production_Motion_Prompt
                    </div>
                    <div className="space-y-6">
                      <div className="relative group/field">
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/field:opacity-100 transition-opacity pointer-events-none rounded-3xl" />
                        <textarea
                          value={scene.image_prompt}
                          onChange={(e) => updateScene(idx, { image_prompt: e.target.value })}
                          className="w-full bg-black/40 border border-white/5 rounded-3xl p-8 text-[12px] font-bold min-h-[100px] focus:outline-none focus:border-blue-500/30 transition-all placeholder:text-white/5 leading-relaxed selection:bg-blue-500/30 no-scrollbar"
                          placeholder="Describe the cinematic visual style and environment parameters..."
                        />
                      </div>
                      <div className="flex items-center gap-6 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group/input hover:bg-black/40 transition-all">
                         <Wand2 className="w-5 h-5 text-white/10 group-hover/input:text-blue-500 transition-colors" />
                         <input 
                           value={scene.motion_direction}
                           onChange={(e) => updateScene(idx, { motion_direction: e.target.value })}
                           className="flex-1 bg-transparent border-none text-[10px] font-black uppercase text-blue-500 tracking-[0.2em] focus:outline-none placeholder:text-white/5"
                           placeholder="MOTION_DIRECTION_PARAMETER"
                         />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-8 right-8 flex items-center gap-2">
                   <button 
                     onClick={() => removeScene(idx)}
                     className="opacity-0 group-hover:opacity-100 p-4 hover:bg-red-500/10 text-white/10 hover:text-red-500 rounded-2xl transition-all active:scale-95 border border-transparent hover:border-red-500/20"
                   >
                     <Trash2 className="w-5 h-5" />
                   </button>
                </div>
                
                {/* Subtle Back Glow */}
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-purple-500/5 blur-[100px] pointer-events-none rounded-full group-hover:opacity-100 opacity-0 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
