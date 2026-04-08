'use client';

import React from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const CAPTION_STYLES = [
  { 
    id: 'bold-stroke', 
    title: 'Bold Stroke', 
    preview: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=400&h=225&auto=format&fit=crop',
    desc: 'High-contrast text with heavy shadows.'
  },
  { 
    id: 'karaoke', 
    title: 'Karaoke Pop', 
    preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&h=225&auto=format&fit=crop',
    desc: 'Bouncing words synchronized with audio.'
  },
  { 
    id: 'sleek', 
    title: 'Sleek Minimal', 
    preview: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400&h=225&auto=format&fit=crop',
    desc: 'Thin typography for a professional look.'
  },
];

export default function Step5Captions() {
  const { wizardData, updateWizardData } = useStudioStore();

  return (
    <div className="w-full h-full flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Caption <span className="text-secondary">Dynamics</span></h2>
        <p className="text-gray-500 text-sm font-medium">Choose how your text overlays will appear on screen.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CAPTION_STYLES.map((style) => (
          <motion.button
            key={style.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => updateWizardData({ captionStyle: style.id })}
            className={`flex flex-col rounded-[2.5rem] overflow-hidden border-2 transition-all duration-300 ${
              wizardData.captionStyle === style.id ? 'border-primary bg-primary/5' : 'border-white/5 hover:border-white/10'
            }`}
          >
            <div className="relative aspect-video">
              <img src={style.preview} alt={style.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                 <span className="text-2xl font-black text-white uppercase tracking-tighter drop-shadow-2xl">SAMPLE TEXT</span>
              </div>
              {wizardData.captionStyle === style.id && (
                <div className="absolute top-4 right-4 text-primary">
                  <CheckCircle2 className="w-6 h-6 fill-black" />
                </div>
              )}
            </div>
            <div className="p-6 text-left">
              <h3 className={`text-sm font-black uppercase tracking-widest ${wizardData.captionStyle === style.id ? 'text-white' : 'text-gray-500'}`}>
                {style.title}
              </h3>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">
                {style.desc}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
