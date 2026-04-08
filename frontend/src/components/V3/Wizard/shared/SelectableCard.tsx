'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface SelectableCardProps {
  id: string;
  title: string;
  description?: string;
  icon?: React.ElementType;
  selected: boolean;
  onClick: () => void;
  badge?: string;
}

export default function SelectableCard({
  title,
  description,
  icon: Icon,
  selected,
  onClick,
  badge
}: SelectableCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full text-left p-6 rounded-3xl border transition-all duration-300 group ${
        selected 
          ? 'bg-primary/10 border-primary shadow-[0_0_30px_rgba(139,92,246,0.15)]' 
          : 'bg-white/[0.02] border-white/5 hover:border-white/20'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
              selected ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 group-hover:text-white'
            }`}>
              <Icon className="w-6 h-6" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-black uppercase tracking-tight ${selected ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                {title}
              </h3>
              {badge && (
                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-gray-500">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs font-medium text-gray-500 mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
        
        {selected && (
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
        )}
      </div>
    </motion.button>
  );
}
