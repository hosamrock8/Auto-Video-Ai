'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import api from '@/lib/api';
import { 
  Plus, Play, Settings, Film, Clock, CheckCircle, Activity,
  AlertCircle, ArrowRight, BarChart3, Zap, Globe, 
  ExternalLink, Trash2, MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  title: string;
  status: string;
  has_video?: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState('Idle');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTask, setActiveTask] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await api.get('/api/projects');
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    fetchProjects();
    const interval = setInterval(fetchProjects, 10000);
    return () => clearInterval(interval);
  }, [fetchProjects]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setIsLoading(true);
    setStatus('Initializing Studio...');
    
    try {
      const res = await api.post('/api/generate', { url });
      setActiveTask(res.data.task_id);
      
      const interval = setInterval(async () => {
        try {
          const statusRes = await api.get(`/api/tasks/${res.data.task_id}`);
          const newStatus = statusRes.data.status;
          setStatus(newStatus);
          
          if (newStatus === 'Completed') {
            clearInterval(interval);
            setIsLoading(false);
            fetchProjects();
          } else if (newStatus.startsWith('Error')) {
            clearInterval(interval);
            setIsLoading(false);
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 3000);

    } catch (e) {
      setStatus('Error: Connection Failed');
      setIsLoading(false);
    }
  };

  const productionPhases = [
    { name: 'Research', id: 'Generating Script...', icon: Globe },
    { name: 'Design', id: 'Generating Assets...', icon: Zap },
    { name: 'Assembly', id: 'Assembling Video...', icon: Film },
    { name: 'Finalized', id: 'Completed', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-inter">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-900/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        
        {/* Top Header */}
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Film className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase">Lumina Studio</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/settings')}
              className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-gray-400 hover:text-white"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-2 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-gray-400 tracking-wider">ENGINE LIVE</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content (3/4) */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Total Productions', value: projects.length, icon: BarChart3, color: 'text-purple-400' },
                { label: 'Studio Capacity', value: 'Unlimited', icon: Zap, color: 'text-blue-400' },
                { label: 'Active Renders', value: isLoading ? 1 : 0, icon: Clock, color: 'text-green-400' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-3xl backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <div className="text-3xl font-black">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Production Console */}
            <section className="bg-gradient-to-br from-white/[0.07] to-transparent border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-md shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Play className="w-48 h-48 rotate-12" />
              </div>

              <div className="max-w-2xl relative z-10">
                <h2 className="text-4xl font-black mb-4 leading-tight">Start New <br/>AI Production</h2>
                <p className="text-gray-400 mb-8 text-lg font-medium">Input an article URL or YouTube link to transform it into a cinematic social video instantly.</p>
                
                <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-4 mb-4">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://article-url.com or youtube.com/watch?v=..."
                    className="flex-1 bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-600 shadow-inner"
                  />
                  <button
                    disabled={isLoading}
                    className="bg-white text-black px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50 shadow-xl"
                  >
                    {isLoading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><Plus className="w-5 h-5" /> BUILD</>}
                  </button>
                </form>

                <AnimatePresence>
                  {isLoading && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-12 space-y-8"
                    >
                      <div className="flex justify-between items-center px-2">
                        {productionPhases.map((phase, idx) => {
                          const stepIndex = productionPhases.findIndex(s => s.id === status);
                          const isCompleted = idx < stepIndex || status === 'Completed';
                          const isActive = idx === stepIndex;
                          
                          return (
                            <div key={idx} className="flex flex-col items-center gap-3 relative z-10">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                                isCompleted ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 
                                isActive ? 'bg-purple-600 text-white animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-white/5 text-gray-600'
                              }`}>
                                <phase.icon className="w-5 h-5" />
                              </div>
                              <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? 'text-white' : 'text-gray-600'}`}>
                                {phase.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                        <Activity className="w-4 h-4 text-purple-400 animate-spin" />
                        <span className="text-sm font-medium text-gray-300">{status}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* Project Library */}
            <section>
              <div className="flex items-center justify-between mb-8 px-4">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <Film className="w-5 h-5 text-gray-400" />
                  Studio Library
                </h3>
                <span className="text-xs font-bold text-gray-600 tracking-widest uppercase">{projects.length} PROJECTS</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                  {projects.map((project, idx) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => router.push(`/projects/${project.id}`)}
                      className="bg-[#0f0f12] border border-white/5 rounded-[2rem] p-6 hover:border-purple-500/30 transition-all hover:bg-[#15151a] cursor-pointer group relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-purple-500/10 transition-colors">
                          <Film className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
                        </div>
                        <div className="flex gap-2">
                          {project.has_video && (
                            <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                              READY
                            </span>
                          )}
                          <button className="p-2 hover:bg-white/5 rounded-lg text-gray-600 hover:text-white">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h4 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors line-clamp-1">{project.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                        <span className="flex items-center gap-1.5 uppercase tracking-tighter">
                          <Clock className="w-3 h-3" />
                          {project.id.split('_').pop()}
                        </span>
                        <div className="w-1 h-1 bg-white/10 rounded-full" />
                        <span className="flex items-center gap-1.5 hover:text-purple-400 transition-colors uppercase tracking-tighter">
                          View Details <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {projects.length === 0 && (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                    <div className="p-4 bg-white/5 rounded-full w-fit mx-auto mb-4">
                      <Film className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-500 font-medium">No productions found. Start your first build above.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Sidebar (1/4): Secondary Focus */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-[#0f0f12] border border-white/5 rounded-[2rem] p-8">
              <h4 className="text-xs font-black text-white/40 uppercase tracking-widest mb-6">Studio Shortcuts</h4>
              <div className="space-y-3">
                {[
                  { label: 'Bulk Export', icon: Play, disabled: true },
                  { label: 'Studio Settings', icon: Settings, action: () => router.push('/settings') },
                  { label: 'Production Logs', icon: BarChart3, disabled: true },
                ].map((action, i) => (
                  <button 
                    key={i}
                    onClick={action.action}
                    disabled={action.disabled}
                    className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <action.icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                      <span className="text-sm font-semibold text-gray-400 group-hover:text-white">{action.label}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white" />
                  </button>
                ))}
              </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-white/10 rounded-[2rem] p-8">
              <Zap className="w-6 h-6 text-yellow-400 mb-4" />
              <h4 className="text-lg font-bold mb-2">Pro Studio Tip</h4>
              <p className="text-sm text-gray-300 leading-relaxed font-medium">Use long-form articles to generate educational shorts. The engine extracts the core narrative automatically.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
