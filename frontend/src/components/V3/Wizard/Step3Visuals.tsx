'use client';

import React from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { motion } from 'framer-motion';
import { ImageIcon, FileText, Sparkles, RefreshCw, Eye } from 'lucide-react';

export default function Step3Visuals() {
  const { currentProject, wizardData, generateImages } = useStudioStore();
  const scenes = currentProject?.assets?.scenes || [];
  const scriptScenes = currentProject?.script?.scenes || [];

  const handleRegenerate = async () => {
    await generateImages();
  };

  return (
    <div className="w-full h-full flex flex-col space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-end justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black uppercase tracking-widest text-primary">
             <Sparkles className="w-3 h-3" /> Visual Engine Active
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">Production <span className="text-secondary">Storyboard</span></h2>
          <p className="text-gray-500 text-sm font-medium">Review your AI-rendered scenes. You can regenerate the entire storyboard if needed.</p>
        </div>
        
        <button 
          onClick={handleRegenerate}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all group"
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          Regenerate All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
        {scriptScenes.map((scene, idx) => {
          const asset = scenes.find((s) => s.scene === scene.scene_number);
          
          return (
            <motion.div
              key={scene.scene_number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group glass-card overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500"
            >
              <div className="flex flex-col lg:flex-row h-full min-h-[220px]">
                {/* Image Section */}
                <div className="relative w-full lg:w-1/2 aspect-video lg:aspect-square bg-white/5 overflow-hidden">
                   {asset?.image ? (
                     <>
                       <img 
                         src={asset.image} 
                         alt={`Scene ${scene.scene_number}`} 
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                       />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-primary transition-all">
                             <Eye className="w-5 h-5" />
                          </button>
                       </div>
                     </>
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-700 animate-pulse">
                        <ImageIcon className="w-10 h-10" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Rendering...</span>
                     </div>
                   )}
                   <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[9px] font-black text-white/80 uppercase tracking-widest border border-white/10">
                      Scene {scene.scene_number}
                   </div>
                </div>

                {/* Text Section */}
                <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-primary/60">
                       <FileText className="w-3 h-3" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Narrator Script</span>
                    </div>
                    <p className="text-sm font-medium text-gray-300 leading-relaxed line-clamp-4">
                      {scene.narrator_text}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                       <Sparkles className="w-3 h-3" />
                       <span className="text-[8px] font-black uppercase tracking-widest">AI Vision Prompt</span>
                    </div>
                    <p className="text-[10px] text-gray-500 italic line-clamp-2">
                       {scene.image_prompt}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
