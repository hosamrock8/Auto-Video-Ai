'use client';

import React from 'react';

interface ToggleSwitchProps {
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: () => void;
  icon?: React.ElementType;
}

export default function ToggleSwitch({
  label,
  description,
  enabled,
  onToggle,
  icon: Icon
}: ToggleSwitchProps) {
  return (
    <div className="w-full flex items-start justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl transition-all hover:bg-white/[0.04] hover:border-white/10">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${enabled ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-600'}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <h4 className={`text-sm font-black uppercase tracking-widest ${enabled ? 'text-white' : 'text-gray-500'}`}>
            {label}
          </h4>
          {description && (
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
      
      <button
        onClick={onToggle}
        className={`relative w-14 h-8 rounded-full transition-all flex items-center px-1 ${
          enabled ? 'bg-primary shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'bg-white/10'
        }`}
      >
        <div className={`w-6 h-6 rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}
