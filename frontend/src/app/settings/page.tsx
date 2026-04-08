'use client';

import React, { useState, useEffect } from 'react';
import {
  Save, Key, Sliders, Shield,
  Activity, ArrowLeft, Cpu, Image as ImageIcon,
  Video, Mic, Music, Volume2, CheckCircle2, AlertCircle,
  RefreshCw, Zap, Lock, Eye, EyeOff,
  Globe, LayoutGrid, BarChart3, Rocket, ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/store/useSettingsStore';

// ── Cube icon ────────────────────────────────────────────────────────────────
function Cube(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

// ── Sidebar tabs ─────────────────────────────────────────────────────────────
const TABS = [
  { id: 'llm',     label: 'LLM & Mastermind',  icon: Cpu       },
  { id: 'image',   label: 'Image Engine',       icon: ImageIcon },
  { id: 'video',   label: 'Video Engine',       icon: Video     },
  { id: 'audio',   label: 'Voice & TTS',        icon: Mic       },
  { id: 'music',   label: 'Music & SFX',        icon: Music     },
  { id: 'global',  label: 'Global Settings',    icon: Sliders   },
  { id: 'telemetry', label: 'Cost Monitor',     icon: BarChart3 },
];

// ── Provider registry ────────────────────────────────────────────────────────
interface ProviderInfo { id: string; label: string; badge: string; color: string; url: string; desc: string }
const PROVIDERS: Record<string, ProviderInfo[]> = {
  llm: [
    { id: 'openrouter', label: 'OpenRouter',      badge: '300+ LLMs', color: 'text-emerald-400', url: 'https://openrouter.ai',          desc: 'Unified gateway — GPT, Claude, Gemini, DeepSeek, Llama...' },
    { id: 'google',     label: 'Google Gemini',    badge: 'FREE',      color: 'text-blue-400',    url: 'https://aistudio.google.com/app/apikey', desc: 'Direct Google API — Gemini 2.0 Flash free tier' },
    { id: 'openai',     label: 'OpenAI',           badge: 'DIRECT',    color: 'text-green-400',   url: 'https://platform.openai.com/api-keys',   desc: 'Direct OpenAI API' },
    { id: 'kie.ai',     label: 'Kie.ai Chat',      badge: 'MARKET',    color: 'text-orange-400',  url: 'https://kie.ai/market',          desc: 'GPT 5.4, Claude 4.6, Gemini 3.1 Pro via Kie' },
  ],
  image: [
    { id: 'fal.ai',  label: 'Fal.ai',       badge: 'FAST',   color: 'text-violet-400',  url: 'https://fal.ai/dashboard',   desc: 'Serverless — Flux 2, Nano Banana, Seedream, Recraft' },
    { id: 'kie.ai',  label: 'Kie.ai',        badge: 'MARKET', color: 'text-orange-400',  url: 'https://kie.ai/market',      desc: 'Imagen 4, GPT Image, Ideogram V3, Grok Imagine' },
  ],
  video: [
    { id: 'fal.ai',  label: 'Fal.ai',       badge: 'FAST',   color: 'text-violet-400',  url: 'https://fal.ai/dashboard',   desc: 'Veo 3.1, Kling 3.0, Seedance 2.0, Sora 2 via Fal' },
    { id: 'kie.ai',  label: 'Kie.ai',        badge: 'MARKET', color: 'text-orange-400',  url: 'https://kie.ai/market',      desc: 'Kling, Sora 2, Runway Aleph, Hailuo, Wan via Kie' },
  ],
  audio: [
    { id: 'kie.ai',     label: 'Kie.ai (ElevenLabs)', badge: 'MARKET', color: 'text-orange-400', url: 'https://kie.ai/market', desc: 'ElevenLabs TTS v2, Turbo 2.5, Dialogue v3' },
    { id: 'fal.ai',     label: 'Fal.ai TTS',          badge: 'FAST',   color: 'text-violet-400', url: 'https://fal.ai/dashboard', desc: 'Gemini TTS, Chatterbox, MiniMax Speech' },
    { id: 'elevenlabs', label: 'ElevenLabs Direct',    badge: 'DIRECT', color: 'text-yellow-400', url: 'https://elevenlabs.io',    desc: 'Direct API — full voice library' },
  ],
  music: [
    { id: 'kie.ai',  label: 'Kie.ai (Suno)',  badge: 'MARKET', color: 'text-orange-400', url: 'https://kie.ai/market', desc: 'Suno Music, Sound Effects, Lyrics Generation' },
    { id: 'fal.ai',  label: 'Fal.ai Audio',   badge: 'FAST',   color: 'text-violet-400', url: 'https://fal.ai/dashboard', desc: 'Beatoven Music, SFX Generation' },
  ],
};

// ── Model catalogs (real data from docs research) ────────────────────────────
interface ModelInfo { id: string; label: string; note: string; tag?: string }
const MODELS: Record<string, Record<string, ModelInfo[]>> = {
  llm: {
    openrouter: [
      { id: 'anthropic/claude-sonnet-4',        label: 'Claude Sonnet 4',       note: 'Best overall',             tag: 'Anthropic' },
      { id: 'anthropic/claude-opus-4',          label: 'Claude Opus 4',         note: 'Most capable',             tag: 'Anthropic' },
      { id: 'openai/gpt-4o',                    label: 'GPT-4o',               note: 'Fast + smart',             tag: 'OpenAI' },
      { id: 'openai/gpt-4o-mini',               label: 'GPT-4o Mini',          note: 'Cost-efficient',           tag: 'OpenAI' },
      { id: 'google/gemini-2.5-flash',          label: 'Gemini 2.5 Flash',     note: 'Fastest thinking',         tag: 'Google' },
      { id: 'google/gemini-2.5-pro',            label: 'Gemini 2.5 Pro',       note: 'Best reasoning',           tag: 'Google' },
      { id: 'deepseek/deepseek-r1',             label: 'DeepSeek R1',          note: 'Open-source king',         tag: 'DeepSeek' },
      { id: 'meta-llama/llama-4-maverick',      label: 'Llama 4 Maverick',     note: 'Meta flagship',            tag: 'Meta' },
    ],
    google: [
      { id: 'gemini-2.0-flash',     label: 'Gemini 2.0 Flash',     note: 'Fastest, Free tier',  tag: 'Free' },
      { id: 'gemini-1.5-flash',     label: 'Gemini 1.5 Flash',     note: 'Balanced',            tag: 'Free' },
      { id: 'gemini-1.5-pro',       label: 'Gemini 1.5 Pro',       note: 'Best quality',        tag: 'Paid' },
    ],
    openai: [
      { id: 'gpt-4o-mini',  label: 'GPT-4o Mini',  note: 'Cost-efficient',  tag: '$0.15/1M' },
      { id: 'gpt-4o',       label: 'GPT-4o',       note: 'Best quality',    tag: '$2.50/1M' },
    ],
    'kie.ai': [
      { id: 'gpt-5.4',              label: 'GPT 5.4 (Response)',    note: 'Latest OpenAI via Kie',    tag: 'OpenAI' },
      { id: 'gpt-5.2',              label: 'GPT 5.2',              note: 'Previous gen via Kie',     tag: 'OpenAI' },
      { id: 'claude-opus-4.6',      label: 'Claude Opus 4.6',      note: 'Most capable via Kie',     tag: 'Anthropic' },
      { id: 'claude-sonnet-4.6',    label: 'Claude Sonnet 4.6',    note: 'Balanced via Kie',         tag: 'Anthropic' },
      { id: 'gemini-3.1-pro',       label: 'Gemini 3.1 Pro',       note: 'Google latest via Kie',    tag: 'Google' },
      { id: 'gemini-3-flash',       label: 'Gemini 3 Flash',       note: 'Fast via Kie',             tag: 'Google' },
      { id: 'gpt-codex',            label: 'GPT Codex',            note: 'Coding specialist',        tag: 'OpenAI' },
    ],
  },
  image: {
    'fal.ai': [
      { id: 'fal-ai/nano-banana-2',               label: 'Nano Banana 2',          note: 'Google SOTA — Fast',           tag: 'Text→Image' },
      { id: 'fal-ai/nano-banana-pro',              label: 'Nano Banana Pro',        note: 'Google SOTA — Best quality',   tag: 'Text→Image' },
      { id: 'fal-ai/flux/schnell',                 label: 'Flux.1 Schnell',         note: '12B params — 1-4 steps',       tag: 'Text→Image' },
      { id: 'fal-ai/flux/dev',                     label: 'Flux.1 Dev',             note: '12B params — HQ',              tag: 'Text→Image' },
      { id: 'fal-ai/flux-2-pro',                   label: 'Flux 2 Pro',             note: 'BFL latest — Photorealism',    tag: 'Text→Image' },
      { id: 'fal-ai/recraft/v4/pro/text-to-image', label: 'Recraft V4 Pro',         note: 'Designer-grade',               tag: 'Text→Image' },
      { id: 'fal-ai/bytedance/seedream/v5/lite',   label: 'Seedream 5.0 Lite',      note: 'ByteDance latest',             tag: 'Text→Image' },
      { id: 'fal-ai/gpt-image-1.5/edit',           label: 'GPT Image 1.5',          note: 'OpenAI image gen',             tag: 'Edit' },
      { id: 'fal-ai/qwen-image',                   label: 'Qwen Image',             note: 'Text rendering expert',        tag: 'Text→Image' },
      { id: 'fal-ai/topaz/upscale/image',          label: 'Topaz Upscale',          note: 'AI image enhancer',            tag: 'Upscale' },
    ],
    'kie.ai': [
      { id: 'seedream-5-lite',       label: 'Seedream 5.0 Lite',    note: 'ByteDance latest',          tag: 'Text→Image' },
      { id: 'imagen4-ultra',         label: 'Imagen 4 Ultra',       note: 'Google best quality',       tag: 'Text→Image' },
      { id: 'imagen4-fast',          label: 'Imagen 4 Fast',        note: 'Google fast',               tag: 'Text→Image' },
      { id: 'nano-banana-pro',       label: 'Nano Banana Pro',      note: 'Google generation + edit',  tag: 'Text→Image' },
      { id: 'flux2-pro-text',        label: 'Flux 2 Pro',           note: 'BFL Pro via Kie',           tag: 'Text→Image' },
      { id: 'gpt-image-1.5',         label: 'GPT Image 1.5',        note: 'OpenAI via Kie',            tag: 'Text→Image' },
      { id: 'ideogram-v3',           label: 'Ideogram V3',          note: 'Typography expert',         tag: 'Text→Image' },
      { id: 'grok-imagine',          label: 'Grok Imagine',         note: 'xAI image gen',             tag: 'Text→Image' },
      { id: 'qwen2-text',            label: 'Qwen 2 Image',         note: 'Alibaba image gen',         tag: 'Text→Image' },
      { id: 'wan-2.7-image-pro',     label: 'Wan 2.7 Pro',          note: 'Alibaba latest',            tag: 'Text→Image' },
    ],
  },
  video: {
    'fal.ai': [
      { id: 'fal-ai/veo3.1',                              label: 'Veo 3.1',                note: 'Google — sound on!',           tag: 'Text→Video' },
      { id: 'fal-ai/veo3.1/image-to-video',               label: 'Veo 3.1 Image→Video',    note: 'Google DeepMind',              tag: 'Img→Video' },
      { id: 'fal-ai/kling-video/v3/pro/image-to-video',   label: 'Kling 3.0 Pro',          note: 'Cinematic + audio',            tag: 'Img→Video' },
      { id: 'bytedance/seedance-2.0/image-to-video',      label: 'Seedance 2.0',           note: 'ByteDance SOTA',               tag: 'Img→Video' },
      { id: 'fal-ai/sora-2/image-to-video',               label: 'Sora 2',                 note: 'OpenAI video',                 tag: 'Img→Video' },
      { id: 'fal-ai/sora-2/image-to-video/pro',           label: 'Sora 2 Pro',             note: 'OpenAI premium',               tag: 'Img→Video' },
      { id: 'fal-ai/pixverse/v6/image-to-video',          label: 'PixVerse V6',            note: 'Lifelike physics',             tag: 'Img→Video' },
      { id: 'fal-ai/wan/v2.7/image-to-video',             label: 'Wan 2.7',                note: 'Enhanced motion',              tag: 'Img→Video' },
      { id: 'fal-ai/veo3.1/lite',                         label: 'Veo 3.1 Lite',           note: 'Budget-friendly',              tag: 'Text→Video' },
    ],
    'kie.ai': [
      { id: 'kling-3.0',              label: 'Kling 3.0',              note: 'Kuaishou latest',              tag: 'Text→Video' },
      { id: 'kling-2.6-i2v',          label: 'Kling 2.6 Img→Video',    note: 'Cinematic + audio',            tag: 'Img→Video' },
      { id: 'sora-2-pro-t2v',         label: 'Sora 2 Pro',             note: 'OpenAI premium via Kie',       tag: 'Text→Video' },
      { id: 'sora-2-pro-i2v',         label: 'Sora 2 Pro Img→Video',   note: 'OpenAI premium via Kie',       tag: 'Img→Video' },
      { id: 'seedance-2.0',           label: 'Seedance 2.0',           note: 'ByteDance SOTA via Kie',       tag: 'Img→Video' },
      { id: 'seedance-2.0-fast',      label: 'Seedance 2.0 Fast',      note: 'ByteDance fast via Kie',       tag: 'Img→Video' },
      { id: 'hailuo-2.3-pro',         label: 'Hailuo 2.3 Pro',         note: 'MiniMax via Kie',              tag: 'Img→Video' },
      { id: 'wan-2.7-i2v',            label: 'Wan 2.7 Img→Video',      note: 'Alibaba via Kie',              tag: 'Img→Video' },
      { id: 'veo-3.1',                label: 'Veo 3.1',                note: 'Google via Kie',               tag: 'Text→Video' },
      { id: 'runway-aleph',           label: 'Runway Aleph',           note: 'Runway latest via Kie',        tag: 'Img→Video' },
      { id: 'grok-imagine-t2v',       label: 'Grok Imagine Video',     note: 'xAI video via Kie',            tag: 'Text→Video' },
    ],
  },
  audio: {
    'kie.ai': [
      { id: 'elevenlabs/text-to-speech-multilingual-v2', label: 'ElevenLabs Multilingual v2', note: 'Arabic + 29 langs',  tag: 'TTS' },
      { id: 'elevenlabs/text-to-speech-turbo-2-5',      label: 'ElevenLabs Turbo 2.5',       note: 'Fastest TTS',        tag: 'TTS' },
      { id: 'elevenlabs/text-to-dialogue-v3',            label: 'ElevenLabs Dialogue v3',     note: 'Multi-speaker',      tag: 'Dialogue' },
      { id: 'elevenlabs/sound-effect-v2',                label: 'ElevenLabs SFX v2',          note: 'Sound effects',      tag: 'SFX' },
      { id: 'elevenlabs/speech-to-text',                 label: 'ElevenLabs STT',             note: 'Speech→Text',        tag: 'STT' },
    ],
    'fal.ai': [
      { id: 'fal-ai/gemini-tts',              label: 'Gemini TTS',           note: 'Google TTS via Fal',      tag: 'TTS' },
      { id: 'fal-ai/chatterbox/text-to-speech', label: 'Chatterbox',         note: 'Resemble AI TTS',         tag: 'TTS' },
      { id: 'fal-ai/minimax/speech-02-hd',     label: 'MiniMax Speech HD',   note: 'Advanced TTS',            tag: 'TTS' },
      { id: 'fal-ai/dia-tts/voice-clone',      label: 'Dia TTS Clone',       note: 'Voice cloning',           tag: 'Clone' },
      { id: 'fal-ai/inworld-tts',              label: 'Inworld TTS 1.5',     note: 'New TTS model',           tag: 'TTS' },
    ],
    elevenlabs: [
      { id: 'eleven_multilingual_v2', label: 'Multilingual v2',       note: 'Arabic ready',        tag: 'TTS' },
      { id: 'eleven_turbo_v2_5',      label: 'Turbo v2.5',            note: 'Fastest',             tag: 'TTS' },
    ],
  },
  music: {
    'kie.ai': [
      { id: 'suno/generate-music',       label: 'Suno — Generate Music',    note: 'Full song generation',      tag: 'Music' },
      { id: 'suno/extend-music',         label: 'Suno — Extend Music',      note: 'Extend existing songs',     tag: 'Music' },
      { id: 'suno/generate-lyrics',      label: 'Suno — Generate Lyrics',   note: 'AI lyrics writer',          tag: 'Lyrics' },
      { id: 'suno/generate-sounds',      label: 'Suno — Sound Effects',     note: 'Custom SFX',               tag: 'SFX' },
      { id: 'suno/cover-suno',           label: 'Suno — Music Cover',       note: 'Cover generation',         tag: 'Cover' },
      { id: 'suno/separate-vocals',      label: 'Suno — Vocal Removal',     note: 'Isolate vocals',           tag: 'Tool' },
    ],
    'fal.ai': [
      { id: 'beatoven/music-generation',          label: 'Beatoven Music',          note: 'Royalty-free instrumental',    tag: 'Music' },
      { id: 'beatoven/sound-effect-generation',   label: 'Beatoven SFX',            note: 'Professional SFX',            tag: 'SFX' },
      { id: 'mirelo-ai/sfx-v1/video-to-audio',   label: 'Mirelo Video→Audio',      note: 'Synced SFX for video',        tag: 'SFX' },
    ],
  },
};

// ── Main component ────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const router        = useRouter();
  const store         = useSettingsStore();
  const [isMounted, setIsMounted] = useState(false);
  const [tab, setTab] = useState('llm');
  const [showKey, setShowKey]       = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testResult, setTestResult] = useState<{ status: string; message?: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    store.fetchSettings();
    return () => clearTimeout(timer);
  }, [store]);

  if (!isMounted) return null;

  const cfg        = (store as unknown as Record<string, unknown>)[tab] as Record<string, unknown> ?? {};
  const providers  = PROVIDERS[tab] ?? [];
  const allModels  = MODELS[tab]    ?? {};
  const modelList  = allModels[cfg.provider as string] ?? [];

  const setField = (field: string, value: string | number | boolean) =>
    store.updateCategory(tab, { [field]: value });

  const handleSave = async () => {
    const payload = {
      llm: store.llm, image: store.image, video: store.video,
      audio: store.audio, music: store.music, sfx: store.sfx,
      global: store.global, publishing: store.publishing,
      telemetry: store.telemetry,
      activeWorkspace: store.activeWorkspace,
      workspaces: store.workspaces,
    };
    try {
      await store.updateSettings(payload);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch { setSaveStatus('error'); }
  };

  const handleTest = async () => {
    setTestResult({ status: 'testing' });
    const r = await store.testConnection(tab);
    setTestResult(r);
    setTimeout(() => setTestResult(null), 5000);
  };

  // ── Global settings panel ─────────────────────────────────────────────────
  const renderGlobal = () => {
    const g = store.global;
    return (
      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Output Format</label>
            <div className="flex gap-3">
              {(['9:16', '16:9', '1:1'] as const).map(r => (
                <button key={r} onClick={() => store.updateCategory('global', { aspect_ratio: r })}
                  className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${
                    g.aspect_ratio === r
                      ? 'bg-primary/10 border-primary/40 text-primary'
                      : 'bg-white/[0.02] border-white/5 text-gray-500 hover:border-white/20'
                  }`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Output Language</label>
            <div className="flex gap-3">
              {(['arabic', 'english'] as const).map(l => (
                <button key={l} onClick={() => store.updateCategory('global', { language: l })}
                  className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${
                    g.language === l
                      ? 'bg-secondary/10 border-secondary/40 text-secondary'
                      : 'bg-white/[0.02] border-white/5 text-gray-500 hover:border-white/20'
                  }`}>
                  {l === 'arabic' ? '🇸🇦 Arabic' : '🇺🇸 English'}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Brand Persona Prompt</label>
          <textarea
            value={g.brand_persona ?? ''}
            onChange={e => store.updateCategory('global', { brand_persona: e.target.value })}
            rows={4}
            placeholder="e.g. Fast-paced Gen-Z Arabic tone targeting Gulf region, casual and energetic style..."
            className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-primary/40 resize-none"
          />
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            This persona guides the LLM voice and language style across all scripts.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Max Cost per Run ($)</label>
            <input type="number" step="0.5" min="0"
              value={g.max_cost_limit ?? 5}
              onChange={e => store.updateCategory('global', { max_cost_limit: parseFloat(e.target.value) })}
              className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl px-6 py-5 text-sm font-mono text-white focus:outline-none focus:border-primary/40"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Options</label>
            <div className="flex flex-col gap-3 pt-1">
              {[
                { key: 'fallback_enabled', label: 'Enable Fallback (show prompts if API fails)' },
                { key: 'budget_alert',     label: 'Alert on budget limit reached'               },
              ].map(({ key, label }) => (
                <div key={key} role="button" tabIndex={0}
                  onClick={() => store.updateCategory('global', { [key]: !(g as unknown as Record<string, unknown>)[key] })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      store.updateCategory('global', { [key]: !(g as unknown as Record<string, unknown>)[key] });
                    }
                  }}
                  className="flex items-center gap-3 text-xs font-bold text-gray-400 hover:text-white transition-colors text-left cursor-pointer group">
                  <div className={`w-10 h-6 rounded-full border transition-all flex items-center px-1 ${
                    (g as unknown as Record<string, unknown>)[key] ? 'bg-primary/20 border-primary/40' : 'bg-white/5 border-white/10'
                  }`}>
                    <div className={`w-4 h-4 rounded-full transition-all ${(g as unknown as Record<string, unknown>)[key] ? 'bg-primary translate-x-4' : 'bg-gray-600'}`} />
                  </div>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── Telemetry panel ───────────────────────────────────────────────────────
  const renderTelemetry = () => {
    const t = store.telemetry;
    const stats = t?.usage_stats ?? {};
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Spent',  value: `$${(t?.monthly_cost ?? 0).toFixed(4)}`, color: 'text-emerald-400' },
            { label: 'LLM Calls',    value: stats.llm   ?? 0,                        color: 'text-blue-400' },
            { label: 'Images Gen',   value: stats.image ?? 0,                         color: 'text-violet-400' },
            { label: 'Audio Gen',    value: stats.audio ?? 0,                         color: 'text-amber-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3">{label}</p>
              <p className={`text-3xl font-black ${color}`}>{value}</p>
            </div>
          ))}
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Cost breakdown is logged per-project inside each project vault.</p>
          <button onClick={() => store.updateSettings({ ...store, telemetry: { monthly_cost: 0, usage_stats: { llm: 0, image: 0, video: 0, audio: 0 } } })}
            className="px-8 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl text-xs font-black text-red-400 uppercase tracking-widest transition-all">
            Reset Monthly Counter
          </button>
        </div>
      </div>
    );
  };

  // ── Engine panel (LLM / Image / Video / Audio / Music) ────────────────────
  const renderEngine = () => (
    <div className="space-y-10">
      {/* 1. Provider selector */}
      {providers.length > 0 && (
        <div className="space-y-4">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Service Provider</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {providers.map(p => (
              <div key={p.id} role="button" tabIndex={0}
                onClick={() => {
                  setField('provider', p.id);
                  const first = (MODELS[tab]?.[p.id] ?? [])[0];
                  if (first) setField('model_id', first.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setField('provider', p.id);
                    const first = (MODELS[tab]?.[p.id] ?? [])[0];
                    if (first) setField('model_id', first.id);
                  }
                }}
                className={`flex flex-col gap-2 p-5 rounded-[1.5rem] text-left border transition-all cursor-pointer group active:scale-[0.98] ${
                  cfg.provider === p.id
                    ? 'bg-primary/5 border-primary/30'
                    : 'bg-white/[0.015] border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10'
                }`}>
                <div className="flex items-center gap-3">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-black border ${
                    p.badge === 'FREE'     ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' :
                    p.badge === '300+ LLMs' ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' :
                    p.badge === 'MARKET'   ? 'text-orange-400 border-orange-400/30 bg-orange-400/10' :
                    p.badge === 'FAST'     ? 'text-violet-400 border-violet-400/30 bg-violet-400/10' :
                                              'text-gray-500 border-white/10 bg-white/5'
                  }`}>{p.badge}</span>
                  <span className="text-sm font-black uppercase tracking-tight">{p.label}</span>
                  {cfg.provider === p.id && (
                    <span className="ml-auto px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-lg text-[8px] font-black text-primary uppercase">Active</span>
                  )}
                </div>
                <p className="text-[10px] font-bold text-gray-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. API Key */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">API Key</label>
          {providers.find(p => p.id === cfg.provider) && (
            <a href={providers.find(p => p.id === cfg.provider)!.url} target="_blank" rel="noreferrer"
              className="text-[10px] font-black text-primary hover:text-primary/80 uppercase tracking-widest flex items-center gap-1">
              Get Key <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
        <div className="flex gap-3">
          <div className="flex-1 relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
            <input
              id={`api-key-${tab}`}
              type={showKey ? 'text' : 'password'}
              value={(cfg.api_key as string) ?? ''}
              onChange={e => setField('api_key', e.target.value)}
              placeholder={
                cfg.provider === 'google' ? 'AIza••••••••••••••••••••••••••••' :
                cfg.provider === 'openrouter' ? 'sk-or-v1-••••••••••••••••••••' :
                cfg.provider === 'kie.ai' ? 'kie_••••••••••••••••••••••••••••' :
                'sk-••••••••••••••••••••••••••••'
              }
              className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl pl-14 pr-14 py-5 text-sm font-mono text-white focus:outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all"
            />
            <button onClick={() => setShowKey(s => !s)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button onClick={handleTest}
            disabled={!cfg.api_key}
            className="px-8 py-5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <Zap className="w-4 h-4 text-primary" /> Test
          </button>
        </div>
        <AnimatePresence>
          {testResult && (
            <motion.div
              key={`test-result-${tab}`}
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl border text-xs font-black uppercase tracking-widest ${
                testResult.status === 'testing'  ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'  :
                testResult.status === 'success'  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                                   'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
              {testResult.status === 'testing' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> :
               testResult.status === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                                                 <AlertCircle className="w-3.5 h-3.5" />}
              {testResult.status === 'testing' ? 'Testing connection...' : testResult.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Custom endpoint (openai-compatible only) */}
      {(cfg.provider === 'openai' || cfg.provider === 'openrouter') && (
        <div className="space-y-4">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
            API Base URL
            {cfg.provider === 'openrouter' && <span className="text-emerald-500 ml-2 normal-case font-bold">auto-set to openrouter.ai</span>}
          </label>
          <div className="relative">
            <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input type="text"
              value={cfg.provider === 'openrouter' ? 'https://openrouter.ai/api/v1' : ((cfg.custom_endpoint as string) ?? '')}
              onChange={e => setField('custom_endpoint', e.target.value)}
              readOnly={cfg.provider === 'openrouter'}
              placeholder="https://api.openai.com/v1"
              className={`w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl pl-14 pr-6 py-5 text-sm font-mono text-white focus:outline-none focus:border-primary/40 transition-all ${cfg.provider === 'openrouter' ? 'opacity-60' : ''}`}
            />
          </div>
        </div>
      )}

      {/* 4. Model selector */}
      {modelList.length > 0 && (
        <div className="space-y-4">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
            Model <span className="text-gray-600 normal-case font-bold">({modelList.length} available)</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
            {modelList.map((m: ModelInfo) => (
              <div key={m.id} role="button" tabIndex={0}
                onClick={() => setField('model_id', m.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setField('model_id', m.id);
                  }
                }}
                className={`flex items-center justify-between p-5 rounded-[1.5rem] border transition-all text-left cursor-pointer active:scale-[0.98] ${
                  cfg.model_id === m.id
                    ? 'bg-primary/5 border-primary/30'
                    : 'bg-white/[0.015] border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10'
                }`}>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {m.tag && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-black text-gray-500 uppercase shrink-0">{m.tag}</span>
                    )}
                    <p className="text-sm font-black text-white tracking-tight truncate">{m.label}</p>
                  </div>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{m.note}</p>
                </div>
                {cfg.model_id === m.id && (
                  <span className="px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-lg text-[8px] font-black text-primary uppercase shrink-0 ml-2">Active</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen text-white font-inter flex items-center justify-center p-8 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/8 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/8 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-7xl h-[90vh] glass-card flex overflow-hidden relative z-10">

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside className="w-72 border-r border-white/[0.05] bg-black/40 flex flex-col py-10 shrink-0">
          <div className="px-10 mb-12 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <Cube className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="font-black tracking-tighter text-xl uppercase italic leading-none block">Lumina</span>
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1 block">Engine Room</span>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-6 overflow-y-auto no-scrollbar">
            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] mb-4 ml-4">Configuration</p>
            {TABS.map(item => (
              <button key={item.id} onClick={() => { setTab(item.id); setTestResult(null); setShowKey(false); }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-xs font-black uppercase tracking-widest transition-all group ${
                  tab === item.id
                    ? 'bg-white/[0.07] text-white border border-white/10'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
                }`}>
                <item.icon className={`w-4 h-4 ${tab === item.id ? 'text-primary' : 'text-gray-700 group-hover:text-gray-500'}`} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="px-6 mt-6 pt-6 border-t border-white/5">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Backend Online</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-gray-700" />
                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
                  ${(store.telemetry?.monthly_cost ?? 0).toFixed(4)} spent
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Content panel ───────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col bg-black/20 min-w-0">
          <header className="flex items-center justify-between px-10 py-8 border-b border-white/[0.03] shrink-0">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center">
                {React.createElement(TABS.find(i => i.id === tab)?.icon || Cpu, { className: 'w-6 h-6 text-primary' })}
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tighter">{TABS.find(i => i.id === tab)?.label}</h2>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mt-1">
                  {tab === 'global' ? 'Global production defaults' :
                   tab === 'telemetry' ? 'Usage & cost tracking' :
                   `Provider: ${((cfg.provider as string) ?? '—').toUpperCase()} › Model: ${(cfg.model_id as string) ?? '—'}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <AnimatePresence>
                {saveStatus !== 'idle' && (
                  <motion.div
                    key={`save-status-${saveStatus}`}
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                      saveStatus === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                    {saveStatus === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    {saveStatus === 'success' ? 'Saved!' : 'Save Error'}
                  </motion.div>
                )}
              </AnimatePresence>
              <button onClick={() => router.push('/')}
                className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all">
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-10 py-10 no-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                {tab === 'global'    ? renderGlobal()    :
                 tab === 'telemetry' ? renderTelemetry() :
                 renderEngine()}
              </motion.div>
            </AnimatePresence>
          </div>

          <footer className="px-10 py-7 border-t border-white/[0.03] flex justify-between items-center bg-black/40 shrink-0">
            <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">
              {store.hasUnsavedChanges
                ? <span className="text-amber-500 animate-pulse">● Unsaved changes</span>
                : <span>● All changes saved</span>}
            </div>
            <div className="flex gap-4">
              <button onClick={() => store.fetchSettings()}
                className="px-8 py-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all">
                Discard
              </button>
              <button onClick={handleSave} disabled={store.loading}
                id="save-settings-btn"
                className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-primary to-amber-600 text-black rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 disabled:opacity-50">
                {store.loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Settings
              </button>
            </div>
          </footer>
        </main>
      </motion.div>
    </div>
  );
}
