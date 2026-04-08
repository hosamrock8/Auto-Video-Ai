'use client';

import React from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { Zap, Film, Move, Layers } from 'lucide-react';
import ToggleSwitch from './shared/ToggleSwitch';

export default function Step6Effects() {
  const { wizardData, updateWizardData } = useStudioStore();

  const toggleEffect = (key: keyof typeof wizardData.effects) => {
    updateWizardData({
      effects: {
        ...wizardData.effects,
        [key]: !wizardData.effects[key]
      }
    });
  };

  return (
    <div className="w-full h-full flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Cinematic <span className="text-secondary">Modifiers</span></h2>
        <p className="text-gray-500 font-medium text-sm italic">Add the &quot;Final Polish&quot; and viral sensory triggers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ToggleSwitch
          label="Shake Effect"
          description="Subtle camera shake on high-impact moments."
          icon={Move}
          enabled={wizardData.effects.shake}
          onToggle={() => toggleEffect('shake')}
        />
        <ToggleSwitch
          label="Film Grain"
          description="Adds a textured, cinematic organic feel."
          icon={Film}
          enabled={wizardData.effects.filmGrain}
          onToggle={() => toggleEffect('filmGrain')}
        />
        <ToggleSwitch
          label="Animated Hook"
          description="Visual zoom-in during the first 3 seconds."
          icon={Zap}
          enabled={wizardData.effects.animatedHook}
          onToggle={() => toggleEffect('animatedHook')}
        />
        <div className="p-6 bg-white/[0.01] border border-dashed border-white/10 rounded-3xl flex items-center justify-center opacity-40">
           <div className="flex items-center gap-3">
              <Layers className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">More effects coming soon</span>
           </div>
        </div>
      </div>
      
      <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-8 text-center">
         <p className="text-xs font-bold text-primary/80 uppercase tracking-widest">
           &quot;Effects are subtle but boost YouTube/TikTok watch-time by up to 22%.&quot;
           <br />
           <span className="text-[9px] text-gray-700 mt-2 block">— Lumina Analytics Team</span>
         </p>
      </div>
    </div>
  );
}
