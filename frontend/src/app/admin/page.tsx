'use client';

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, BarChart3, Users, DollarSign, 
  CreditCard, PieChart, Activity, Globe, 
  Settings, ArrowUpRight, TrendingUp, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdministrativeOffice() {
  const [projectsCount, setProjectsCount] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8000/api/projects')
      .then(res => res.json())
      .then(data => setProjectsCount(data.length))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] text-white font-inter p-12 relative overflow-hidden">
      {/* Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="ambient-glow from-green-500/10 top-[-10%] left-[-10%] w-[50%] h-[50%] animate-ambient-glow transition-all duration-1000" />
      </div>

      <header className="mb-16 relative z-10">
        <div className="flex items-center gap-6 mb-4">
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 shadow-lg shadow-green-500/10">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none block">Administrative Office</h1>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Global_Production_Accounting_V2</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative z-10">
        
        {/* Core Stats Row */}
        <div className="lg:col-span-3 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Universal_Credits', value: '$124.50', icon: CreditCard, color: 'text-green-500', glow: 'from-green-500/10', desc: 'Available for all engines' },
              { label: 'Factory_Projects', value: projectsCount, icon: PieChart, color: 'text-blue-500', glow: 'from-blue-500/10', desc: 'Active & Completed' },
              { label: 'Network_Uptime', value: '99.9%', icon: Activity, color: 'text-primary', glow: 'from-primary/10', desc: 'Engine availability' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-1 group overflow-hidden active:scale-95 transition-all">
                <div className="bg-black/20 rounded-[2.2rem] p-10 relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-10">
                    <div className={`p-4 rounded-2xl bg-white/[0.03] ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-white/10 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                  <div className="text-4xl font-black mb-2 italic text-glow font-mono tracking-tighter">{stat.value}</div>
                  <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">{stat.label}</div>
                  <div className="mt-auto pt-6 border-t border-white/5">
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-relaxed">System_Log: {stat.desc}</p>
                  </div>
                  
                  {/* Visual Decor */}
                  <div className={`absolute -bottom-10 -right-10 p-8 opacity-0 group-hover:opacity-5 transition-opacity blur-2xl flex items-center justify-center bg-gradient-to-br ${stat.glow} to-transparent w-48 h-48 rounded-full`} />
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             {/* Consumption Chart */}
             <section className="glass-card p-1">
                <div className="bg-black/20 rounded-[2.2rem] p-12">
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                      <BarChart3 className="w-5 h-5 text-green-500" />
                      <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Token_Flow_History</h4>
                    </div>
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest bg-white/[0.03] px-3 py-1 rounded-full">Last_30_Cycles</span>
                  </div>
                  <div className="h-56 flex items-end justify-between gap-3 relative px-4">
                    {/* Mock data bars */}
                    {[40, 70, 45, 90, 65, 30, 80, 55, 95, 60].map((h, i) => (
                      <div key={i} className="flex-1 bg-white/[0.02] rounded-t-2xl relative group h-full">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: i * 0.05, duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
                          className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-green-500/20 to-green-500 rounded-t-2xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all group-hover:to-white" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
             </section>

             {/* Billing History */}
             <section className="glass-card p-1">
                <div className="bg-black/20 rounded-[2.2rem] p-12">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Accounting_Ledger</h4>
                    </div>
                    <button className="text-[9px] font-black text-green-500 hover:text-white transition-colors uppercase tracking-widest underline decoration-2 underline-offset-4">Full_Audit</button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { id: 'INV-3829', date: 'April 05, 2026', amount: '$12.40', status: 'PAID' },
                      { id: 'INV-3828', date: 'April 02, 2026', amount: '$45.00', status: 'PAID' },
                      { id: 'INV-3827', date: 'March 28, 2026', amount: '$8.20', status: 'PAID' }
                    ].map((inv, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-white/[0.03] rounded-3xl border border-transparent hover:border-white/5 transition-all group active:scale-95 cursor-pointer">
                        <div className="flex items-center gap-6">
                           <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                           <div>
                              <div className="text-[12px] font-black uppercase tracking-tight italic group-hover:text-green-500 transition-colors">{inv.id}</div>
                              <div className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1.5">{inv.date}</div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="text-sm font-black italic">{inv.amount}</div>
                           <div className="text-[8px] font-black text-green-500/40 uppercase tracking-widest mt-1">Confirmed</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
             </section>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-8">
           <div className="glass-panel p-10 relative group overflow-hidden">
              <div className="absolute inset-0 bg-green-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                   <div className="p-4 bg-green-500/10 rounded-2xl text-green-500">
                      <Zap className="w-8 h-8 animate-pulse" />
                   </div>
                   <div className="px-3 py-1 bg-green-500/20 rounded-full text-[8px] font-black text-green-500 uppercase tracking-widest border border-green-500/20">Active_Node</div>
                </div>
                <h4 className="text-xl font-black mb-3 uppercase italic tracking-tighter">Universal_Vault</h4>
                <p className="text-[10px] font-bold text-white/20 leading-relaxed uppercase tracking-wider mb-10">Centralized credit infrastructure with automatic engine-native conversion protocols.</p>
                
                <button className="w-full py-5 bg-white text-black rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:bg-green-500 hover:text-white transition-all active:scale-95 relative overflow-hidden group/btn">
                  Inject_Universal_Credits
                </button>
              </div>
           </div>

           <div className="glass-card p-1">
              <div className="bg-black/20 rounded-[2.2rem] p-10">
                <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-10 border-b border-white/5 pb-5">Resource_Dispatch</h4>
                <div className="space-y-4">
                   <button className="w-full flex items-center justify-between p-6 bg-white/[0.03] rounded-3xl hover:bg-green-500/10 transition-all group border border-transparent hover:border-green-500/20 active:scale-95">
                      <span className="text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-widest">Export_Data_Sync</span>
                      <Globe className="w-5 h-5 text-white/10 group-hover:text-green-500 group-hover:rotate-12 transition-all" />
                   </button>
                   <button className="w-full flex items-center justify-between p-6 bg-white/[0.03] rounded-3xl hover:bg-green-500/10 transition-all group border border-transparent hover:border-green-500/20 active:scale-95">
                      <span className="text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-widest">Security_Audit</span>
                      <Settings className="w-5 h-5 text-white/10 group-hover:text-green-500 group-hover:rotate-90 transition-all" />
                   </button>
                </div>
              </div>
           </div>
        </div>      </div>
    </div>
  );
}
