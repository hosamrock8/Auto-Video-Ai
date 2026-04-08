'use client';

import React from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { motion } from 'framer-motion';
import { Film, FileText, Activity, RefreshCw, Eye, Play } from 'lucide-react';
import { useTranslationStore } from '@/store/useTranslationStore';

export default function Step5Animations() {
  const { currentProject, generateVideos } = useStudioStore();
  const { lang, t } = useTranslationStore();
  const scenes = currentProject?.assets?.scenes || [];
  const scriptScenes = currentProject?.script?.scenes || [];

  const handleRegenerate = async () => {
    await generateVideos();
  };

  return (
    <div className={`w-full h-full flex flex-col space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
      <div className={`flex items-end justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 rounded-full text-[9px] font-black uppercase tracking-widest text-[#0EA5E9]">
             <Film className="w-3 h-3" /> {lang === 'en' ? 'Video Engine Active' : 'محرك الفيديو نشط'}
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">
             {lang === 'en' ? 'Cinematic ' : 'التحريك '}
             <span className="text-[#0EA5E9]">{lang === 'en' ? 'Animations' : 'السينمائي'}</span>
          </h2>
          <p className="text-gray-500 text-sm font-medium">
             {lang === 'en' ? 'Review your AI-animated scenes. Each image has been brought to life.' : 'قم بمراجعة المشاهد المتحركة. تم إحياء كل صورة بنجاح.'}
          </p>
        </div>
        
        <button 
          onClick={handleRegenerate}
          className={`flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-[#0EA5E9]/10 border border-white/10 hover:border-[#0EA5E9]/30 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all group ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
        >
          <RefreshCw className={`w-4 h-4 group-hover:rotate-180 transition-transform duration-500 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          {lang === 'en' ? 'Re-Animate All' : 'إعادة تحريك الجميع'}
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
              className="group glass-card overflow-hidden border border-white/5 hover:border-[#0EA5E9]/30 transition-all duration-500"
            >
              <div className={`flex flex-col lg:flex-row h-full min-h-[220px] ${lang === 'ar' ? 'lg:flex-row-reverse' : ''}`}>
                {/* Video Section */}
                <div className="relative w-full lg:w-1/2 aspect-video lg:aspect-square bg-white/5 overflow-hidden">
                   {asset?.video ? (
                     <>
                       <video 
                         src={asset.video} 
                         autoPlay
                         loop
                         muted
                         playsInline
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                       />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-[#0EA5E9] transition-all">
                             <Play className="w-5 h-5 ml-1" />
                          </button>
                       </div>
                     </>
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-700 animate-pulse bg-black/20">
                        <Activity className="w-10 h-10 text-[#0EA5E9]/50" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#0EA5E9]/50">
                           {lang === 'en' ? 'Synthesizing...' : 'جاري التحريك...'}
                        </span>
                     </div>
                   )}
                   <div className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[9px] font-black text-white/80 uppercase tracking-widest border border-white/10 z-10`}>
                      {lang === 'en' ? 'Scene' : 'المشهد'} {scene.scene_number}
                   </div>
                </div>

                {/* Text Section */}
                <div className={`flex-1 p-6 flex flex-col justify-between space-y-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                  <div className="space-y-3">
                    <div className={`flex items-center gap-2 text-[#0EA5E9]/60 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                       <FileText className="w-3 h-3" />
                       <span className="text-[9px] font-black uppercase tracking-widest">
                         {lang === 'en' ? 'Narrator Script' : 'نص الراوي'}
                       </span>
                    </div>
                    <p className="text-sm font-medium text-gray-300 leading-relaxed line-clamp-4">
                      {scene.narrator_text}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <div className={`flex items-center gap-2 text-gray-600 mb-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                       <Activity className="w-3 h-3" />
                       <span className="text-[8px] font-black uppercase tracking-widest">
                         {lang === 'en' ? 'Motion Protocol' : 'بروتوكول الحركة'}
                       </span>
                    </div>
                    <p className="text-[10px] text-gray-400 italic line-clamp-2 bg-white/5 p-2 rounded-lg font-mono">
                       {scene.video_animation_prompt || scene.motion_direction || "slow cinematic pan"}
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
