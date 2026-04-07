'use client';

import React from 'react';
import { 
  BarChart3, Settings, ShieldCheck, Zap, 
  Layers, Film, Image as ImageIcon, LayoutDashboard, 
  Briefcase, Activity, Database, Globe
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const sidebarGroups = [
  {
    title: "The Workshop",
    items: [
      { name: "Command Center", icon: LayoutDashboard, path: "/" },
      { name: "Project Library", icon: Film, path: "/projects" },
    ]
  },
  {
    title: "Production Engines",
    items: [
      { name: "Image Engine", icon: ImageIcon, path: "/image-engine" },
      { name: "Video Engine", icon: Zap, path: "/video-engine" },
    ]
  },
  {
    title: "Corporate Offices",
    items: [
      { name: "Administrative Office", icon: Briefcase, path: "/admin" },
      { name: "Services Office", icon: Database, path: "/services" },
      { name: "Quality Office", icon: ShieldCheck, path: "/quality" },
    ]
  },
  {
    title: "Operations",
    items: [
      { name: "Factory Settings", icon: Settings, path: "/settings" },
      { name: "Global Logs", icon: Activity, path: "/logs", disabled: true },
    ]
  }
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="w-80 bg-black/40 border-r border-white/[0.03] backdrop-blur-[12px] h-screen sticky top-0 flex flex-col p-8 z-50">
      {/* Brand */}
      <div className="flex items-center gap-4 mb-16 px-2">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div>
           <h1 className="text-xl font-black tracking-tighter uppercase text-white leading-none">Lumina</h1>
           <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-1 block">Factory V2</span>
        </div>
      </div>

      <nav className="flex-1 space-y-12 overflow-y-auto no-scrollbar pr-2">
        {sidebarGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-4">
            <h3 className="text-[9px] font-black text-white/28 uppercase tracking-[0.4em] px-4">{group.title}</h3>
            <div className="space-y-1.5">
              {group.items.map((item, iIdx) => {
                const isActive = pathname === item.path;
                return (
                  <button
                    key={iIdx}
                    onClick={() => !item.disabled && router.push(item.path)}
                    disabled={item.disabled}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-[1.25rem] text-xs font-black uppercase tracking-widest transition-all group relative ${
                      isActive 
                        ? 'bg-white/[0.05] text-white border border-white/5' 
                        : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
                    } ${item.disabled ? 'opacity-20 cursor-not-allowed' : ''}`}
                  >
                    <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-primary' : 'text-white/30 group-hover:text-white/60'}`} />
                    {item.name}
                    
                    {isActive && (
                      <motion.div 
                        layoutId="active-highlight"
                        className="absolute left-0 w-1 h-4 bg-primary rounded-r-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                      />
                    )}

                    {item.name === 'Factory Settings' && (
                       <div className="ml-auto w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[9px] font-black text-amber-500">
                          1
                       </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Usage */}
      <div className="pt-8 mt-4 border-t border-white/[0.03]">
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none">Efficiency</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-tighter">Cluster_98%</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[98%] shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
            </div>
            <p className="text-[9px] font-bold text-white/20 mt-4 flex items-center gap-2 uppercase tracking-wide">
              <Activity className="w-3.5 h-3.5 text-green-500" />
              Node_Alpha_Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
