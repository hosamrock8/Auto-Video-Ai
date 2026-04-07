import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface EngineConfig {
  provider: string;
  api_key: string;
  custom_endpoint: string;
  model_id: string;
}

interface GlobalSettings {
  aspect_ratio: '9:16' | '16:9' | '1:1';
  resolution: '720p' | '1080p' | '4k';
  language: string;
  watermark: boolean;
  fallback_enabled: boolean;
  max_cost_limit: number;
  budget_alert: boolean;
}

interface SettingsState {
  llm: EngineConfig;
  image: EngineConfig;
  video: EngineConfig;
  audio: EngineConfig;
  music: EngineConfig;
  sfx: EngineConfig;
  global: GlobalSettings;
  
  loading: boolean;
  testingProvider: string | null;
  hasUnsavedChanges: boolean;
  
  // Actions
  fetchSettings: () => Promise<void>;
  updateSettings: (newSettings: any) => Promise<void>;
  updateCategory: (category: string, config: Partial<EngineConfig | GlobalSettings>) => void;
  testConnection: (category: string) => Promise<{ status: string; message: string }>;
  setHasUnsavedChanges: (val: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      llm: { provider: 'openai', api_key: '', custom_endpoint: '', model_id: 'gpt-4o-mini' },
      image: { provider: 'fal.ai', api_key: '', custom_endpoint: '', model_id: 'flux-schnell' },
      video: { provider: 'google', api_key: '', custom_endpoint: '', model_id: 'gemini-2.0-flash-exp' },
      audio: { provider: 'elevenlabs', api_key: '', custom_endpoint: '', model_id: 'eleven_multilingual_v2' },
      music: { provider: 'fal.ai', api_key: '', custom_endpoint: '', model_id: 'stable-audio' },
      sfx: { provider: 'fal.ai', api_key: '', custom_endpoint: '', model_id: 'sfx-generator' },
      global: { 
        aspect_ratio: '9:16', 
        resolution: '1080p', 
        language: 'english', 
        watermark: false,
        fallback_enabled: true,
        max_cost_limit: 5.0,
        budget_alert: true
      },
      
      loading: false,
      testingProvider: null,
      hasUnsavedChanges: false,

      fetchSettings: async () => {
        try {
          const res = await axios.get('http://localhost:8000/api/settings');
          if (res.data) {
             set({ ...res.data, hasUnsavedChanges: false });
          }
        } catch (err) {
          console.error('Failed to fetch settings from backend:', err);
        }
      },

      updateSettings: async (newSettings) => {
        set({ loading: true });
        try {
          await axios.post('http://localhost:8000/api/settings', newSettings);
          set({ ...newSettings, hasUnsavedChanges: false });
        } catch (err) {
          console.error('Failed to update settings:', err);
        } finally {
          set({ loading: false });
        }
      },

      updateCategory: (category, config) => {
        set((state: any) => ({
          [category]: { ...state[category], ...config },
          hasUnsavedChanges: true
        }));
      },

      setHasUnsavedChanges: (val) => set({ hasUnsavedChanges: val }),

      testConnection: async (category) => {
        const config = (get() as any)[category];
        set({ testingProvider: category });
        try {
          const res = await axios.post('http://localhost:8000/api/settings/test', {
            provider: config.provider,
            api_key: config.api_key
          });
          return res.data;
        } catch (err: any) {
          return { status: 'error', message: err.message || 'Connection failed' };
        } finally {
          set({ testingProvider: null });
        }
      }
    }),
    {
      name: 'lumina-settings-storage',
    }
  )
);
