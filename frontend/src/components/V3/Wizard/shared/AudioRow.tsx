'use client';

import React from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioRowProps {
  id: string;
  title: string;
  artist: string;
  duration: string;
  color: string;
  selected: boolean;
  onSelect: () => void;
  isPlaying: boolean;
  onPlay: (e: React.MouseEvent) => void;
}

export default function AudioRow({
  title,
  artist,
  duration,
  color,
  selected,
  onSelect,
  isPlaying,
  onPlay
}: AudioRowProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-6 p-4 rounded-2xl transition-all ${
        selected 
          ? 'bg-primary/10 border border-primary/30 shadow-lg' 
          : 'bg-white/[0.02] border border-transparent hover:border-white/10 hover:bg-white/[0.04]'
      }`}
    >
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 text-white"
        style={{ backgroundColor: color }}
        onClick={onPlay}
      >
        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
      </div>
      
      <div className="flex-1 text-left">
        <h4 className={`text-sm font-black uppercase tracking-widest ${selected ? 'text-white' : 'text-gray-400'}`}>
          {title}
        </h4>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-0.5">
          {artist}
        </p>
      </div>
      
      <div className="text-[10px] font-black text-gray-600 tabular-nums">
        {duration}
      </div>
    </button>
  );
}
