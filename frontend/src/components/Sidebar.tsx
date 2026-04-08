'use client';

import React from 'react';
import { 
  Settings, FilePlay, LayoutDashboard, Plus, CreditCard, Video
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTranslationStore } from '@/store/useTranslationStore';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { lang, setLang, t } = useTranslationStore();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const sidebarItems = [
    { name: t('dashboard'), icon: LayoutDashboard, path: "/" },
    { name: t('my_videos'), icon: FilePlay, path: "/projects" },
    { name: t('settings'), icon: Settings, path: "/settings" },
  ];

  if (pathname === '/create') {
    return null;
  }

  return (
    <aside className={`w-72 bg-[#0F172A] border-r border-[#1E293B] h-screen sticky top-0 flex flex-col p-6 z-50 ${lang === 'ar' ? 'font-outfit' : 'font-inter'}`}>
      {/* Brand */}
      <div className="flex items-center justify-between mb-10 px-2">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#10B981] rounded-xl flex items-center justify-center shadow-lg shadow-[#8B5CF6]/30">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase text-white leading-none">Faceless</h1>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1 block">Studio</span>
          </div>
        </div>
        
        {/* Lang Toggle */}
        <button 
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase text-gray-400 hover:text-white transition-all shadow-xl"
        >
          {lang === 'en' ? 'AR' : 'EN'}
        </button>
      </div>

      {/* New Project CTA */}
      <button 
        onClick={() => router.push('/create')}
        className="w-full flex items-center justify-center gap-3 py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl mb-10 font-bold uppercase tracking-widest text-[11px] shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all active:scale-95"
      >
        <Plus className="w-4 h-4" /> {t('new_project')}
      </button>

      <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
        {sidebarItems.map((item, idx) => {
          const isActive = pathname === item.path || (item.path === '/' && pathname === '/create');
          return (
            <button
              key={idx}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all group relative ${
                isActive 
                  ? 'bg-[#1E293B] text-white border border-[#1E293B]' 
                  : 'text-gray-400 hover:text-white hover:bg-[#1E293B]/50 border border-transparent'
              } ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}
            >
              <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#8B5CF6]' : 'text-gray-500 group-hover:text-gray-300'}`} />
              {item.name}
              
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className={`absolute w-1 h-6 bg-[#8B5CF6] rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)] ${lang === 'ar' ? 'right-0 rounded-l-full' : 'left-0 rounded-r-full'}`} 
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile Mock (Cleaned) */}
      <div className="pt-6 mt-4 border-t border-[#1E293B]">
        <div className={`flex items-center gap-3 px-2 ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
           <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[10px] font-black uppercase text-gray-500">
             V2
           </div>
           <div>
             <p className="text-[10px] font-black uppercase tracking-widest text-white">{t('internal_tool')}</p>
             <p className="text-[8px] text-gray-500 uppercase font-bold mt-0.5">Build 2026.04</p>
           </div>
        </div>
      </div>

    </aside>
  );
}

