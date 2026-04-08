'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface VerticalImageCardProps {
  id: string;
  title: string;
  image: string;
  selected: boolean;
  onClick: () => void;
}

export default function VerticalImageCard({
  title,
  image,
  selected,
  onClick
}: VerticalImageCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full aspect-[2/3] rounded-[2rem] overflow-hidden border-2 transition-all duration-500 group ${
        selected ? 'border-primary shadow-[0_0_40px_rgba(139,92,246,0.3)]' : 'border-white/5 hover:border-white/20'
      }`}
    >
      <img 
        src={image} 
        alt={title} 
        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
          selected ? 'opacity-100' : 'opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60'
        }`}
      />
      
      <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/60 to-transparent">
        <h3 className={`text-sm font-black uppercase tracking-widest text-center ${selected ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
          {title}
        </h3>
      </div>
      
      {selected && (
        <div className="absolute top-4 right-4 text-primary animate-in zoom-in-50 duration-300">
           <CheckCircle2 className="w-8 h-8 fill-black" />
        </div>
      )}
    </motion.button>
  );
}
