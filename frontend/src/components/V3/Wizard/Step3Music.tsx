'use client';

import React, { useState } from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { Music, AlertCircle } from 'lucide-react';
import AudioRow from './shared/AudioRow';

const TRACKS = [
  { id: 'happy-rhythm', title: 'Happy Rhythm', artist: 'Lumina Studio', duration: '1:45', color: '#10B981' },
  { id: 'deep-bass', title: 'Deep Bass', artist: 'Cyber Beats', duration: '2:10', color: '#8B5CF6' },
  { id: 'lofi-night', title: 'Lofi Night', artist: 'Chilled Vibes', duration: '3:05', color: '#3B82F6' },
  { id: 'epic-narrative', title: 'Epic Narrative', artist: 'Cinematic Orchestrations', duration: '2:40', color: '#F43F5E' },
  { id: 'spooky-ambience', title: 'Spooky Ambience', artist: 'Dark Shadows', duration: '1:55', color: '#6366F1' },
  { id: 'retro-synth', title: 'Retro Synth', artist: 'Neon Waves', duration: '2:30', color: '#F59E0B' },
];

export default function Step3Music() {
  const { wizardData, updateWizardData } = useStudioStore();
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const togglePlay = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (playingTrackId === id) {
      setPlayingTrackId(null);
    } else {
      setPlayingTrackId(id);
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Setting the <span className="text-secondary">Vibe</span></h2>
        <p className="text-gray-500 text-sm font-medium">Choose background music that complements your story. This is optional.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
        <button
          onClick={() => updateWizardData({ bgMusic: 'none' })}
          className={`flex items-center gap-6 p-4 rounded-2xl transition-all border ${
            wizardData.bgMusic === 'none' 
              ? 'bg-primary/10 border-primary/30 shadow-lg' 
              : 'bg-white/[0.02] border-transparent hover:border-white/10 hover:bg-white/[0.04]'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-500">
             <Music className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <h4 className={`text-sm font-black uppercase tracking-widest ${wizardData.bgMusic === 'none' ? 'text-white' : 'text-gray-400'}`}>
              No Background Music
            </h4>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-0.5">
              Clear narration only
            </p>
          </div>
        </button>

        {TRACKS.map((track) => (
          <AudioRow
            key={track.id}
            {...track}
            selected={wizardData.bgMusic === track.id}
            onSelect={() => updateWizardData({ bgMusic: track.id })}
            isPlaying={playingTrackId === track.id}
            onPlay={(e) => togglePlay(e, track.id)}
          />
        ))}
      </div>

      <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-[2rem] flex items-start gap-4">
        <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-[10px] font-bold text-blue-400/80 uppercase tracking-widest leading-relaxed">
          The music volume will be automatically ducked when the narrator speaks to ensure maximum clarity.
        </p>
      </div>
    </div>
  );
}
