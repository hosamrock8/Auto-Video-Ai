'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudioStore } from '@/store/useStudioStore';
import { useTranslationStore } from '@/store/useTranslationStore';
import { Plus, Video, Film, Clock, Eye, Download, MoreVertical, LayoutGrid, Settings as SettingsIcon } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const { allProjects, syncAllProjects } = useStudioStore();
  const { t, lang } = useTranslationStore();

  useEffect(() => {
    syncAllProjects();
    const inv = setInterval(syncAllProjects, 10000);
    return () => clearInterval(inv);
  }, []);

  return (
    <div className={`min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden ${lang === 'ar' ? 'font-outfit' : 'font-inter'}`}>
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[130px] rounded-full" />
      </div>

      <header className="px-12 py-10 flex items-center justify-between border-b border-white/[0.03] z-10 bg-black/40 backdrop-blur-md relative">
         <div className={`flex items-center gap-6 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
               <Video className="w-6 h-6 text-white" />
            </div>
            <div className={lang === 'ar' ? 'text-right' : ''}>
               <h1 className="text-2xl font-black uppercase tracking-tighter">Lumina Studio</h1>
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1">{t('personal_ai_factory')}</p>
            </div>
         </div>
         <div className={`flex items-center gap-6 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
           <button onClick={() => router.push('/settings')} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
             <SettingsIcon className="w-5 h-5 text-gray-400 hover:text-white" />
           </button>
           <button 
             onClick={() => router.push('/create')}
             className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:scale-105 transition-all"
           >
             <Plus className="w-4 h-4" /> {lang === 'en' ? 'Start Production' : 'ابدأ الإنتاج'}
           </button>
         </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto py-16 px-6 relative z-10">
         <div className={`flex items-center justify-between mb-12 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
           <h2 className={`text-3xl font-black uppercase tracking-tighter flex items-center gap-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
             <LayoutGrid className="w-6 h-6 text-gray-500" /> {t('recent_productions')}
           </h2>
           <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest">
             {allProjects.length} {t('projects')}
           </span>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
               {allProjects.map((project, idx) => (
                 <motion.div
                   key={project.id}
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: idx * 0.05 }}
                   className={`bg-[#0f0f12] border border-white/5 rounded-[2rem] p-6 hover:border-blue-500/30 transition-all hover:bg-[#15151a] cursor-pointer group relative overflow-hidden ${lang === 'ar' ? 'text-right' : ''}`}
                 >
                   {/* Thumbnail area mock */}
                   <div className="w-full aspect-video bg-black/50 rounded-xl mb-6 flex items-center justify-center border border-white/5 overflow-hidden relative">
                     {project.thumbnail ? (
                       <img src={project.thumbnail} alt={project.id} className="w-full h-full object-cover opacity-80" />
                     ) : (
                       <Film className="w-8 h-8 text-gray-600" />
                     )}
                     
                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                       <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white hover:scale-110 transition-transform">
                          <Eye className="w-5 h-5" />
                       </button>
                       <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                          <Download className="w-4 h-4" />
                       </button>
                     </div>
                   </div>
                   
                   <div className={`flex items-start justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                     <div className="max-w-[80%]">
                       <h3 className="text-lg font-black tracking-tight mb-2 truncate">
                         {project.script?.title || 'Untitled Production'}
                       </h3>
                       <div className={`flex items-center gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                         <Clock className="w-3 h-3" /> {project.status.replace(/_/g, ' ')}
                       </div>
                     </div>
                     <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors">
                       <MoreVertical className="w-5 h-5" />
                     </button>
                   </div>
                   
                   {/* Progress Indicator for processing projects */}
                   {['scripting', 'generating_assets', 'assembling'].includes(project.status.toLowerCase()) && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                         <div className="h-full bg-blue-500 w-1/2 animate-pulse" />
                      </div>
                   )}
                 </motion.div>
               ))}
            </AnimatePresence>
            
            {allProjects.length === 0 && (
               <div className="col-span-full py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                 <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Video className="w-10 h-10 text-blue-500" />
                 </div>
                 <h3 className="text-2xl font-black mb-2">{t('no_productions')}</h3>
                 <p className="text-gray-500 mb-8 font-medium">{t('productions_empty')}</p>
                 <button 
                   onClick={() => router.push('/create')}
                   className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all"
                 >
                   {t('start_generating')}
                 </button>
               </div>
            )}
         </div>
      </main>
    </div>
  );
}
