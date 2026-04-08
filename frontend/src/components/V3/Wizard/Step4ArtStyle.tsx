'use client';

import React from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import VerticalImageCard from './shared/VerticalImageCard';

const STYLES = [
  { id: 'comic', title: 'Comic Book', image: 'https://images.unsplash.com/photo-1588497859490-85d1c17db96d?q=80&w=340&h=510&auto=format&fit=crop' },
  { id: '3d-render', title: '3D Render', image: 'https://images.unsplash.com/photo-1614850523296-62c096690552?q=80&w=340&h=510&auto=format&fit=crop' },
  { id: 'anime', title: 'Classic Anime', image: 'https://images.unsplash.com/photo-1578632738980-432363a0cd5b?q=80&w=340&h=510&auto=format&fit=crop' },
  { id: 'pixel-art', title: 'Pixel Art', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=340&h=510&auto=format&fit=crop' },
];

export default function Step4ArtStyle() {
  const { wizardData, updateWizardData } = useStudioStore();

  return (
    <div className="w-full h-full flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Artistic <span className="text-secondary">Direction</span></h2>
        <p className="text-gray-500 font-medium text-sm italic">Define the visual soul of your story&apos;s universe</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {STYLES.map((style) => (
          <VerticalImageCard
            key={style.id}
            {...style}
            selected={wizardData.artStyle === style.id}
            onClick={() => updateWizardData({ artStyle: style.id })}
          />
        ))}
      </div>
      
      <div className="text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700">All visuals are generated in 4K resolution using custom neural engines.</p>
      </div>
    </div>
  );
}
