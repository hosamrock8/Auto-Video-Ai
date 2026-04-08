import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

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
  brand_persona: string;
}

interface Workspace {
  id: string;
  name: string;
  defaults: Partial<SettingsState>;
}

interface Telemetry {
  monthly_cost: number;
  usage_stats: {
    llm: number;
    image: number;
    video: number;
    audio: number;
  };
}

interface PublishingHooks {
  youtube_api_key: string;
  webhook_url: string;
}

interface SettingsState {
  llm: EngineConfig;
  image: EngineConfig;
  video: EngineConfig;
  audio: EngineConfig;
  music: EngineConfig;
  sfx: EngineConfig;
  global: GlobalSettings;
  telemetry: Telemetry;
  publishing: PublishingHooks;
  
  activeWorkspace: string;
  workspaces: Workspace[];

  loading: boolean;
  testingProvider: string | null;
  hasUnsavedChanges: boolean;
  
  // Actions
  fetchSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<SettingsState>) => Promise<void>;
  updateCategory: (category: string, config: Partial<EngineConfig | GlobalSettings | Telemetry | PublishingHooks>) => void;
  testConnection: (category: string) => Promise<{ status: string; message: string }>;
  setHasUnsavedChanges: (val: boolean) => void;
  switchWorkspace: (id: string) => void;
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
        budget_alert: true,
        brand_persona: ''
      },
      telemetry: {
        monthly_cost: 0.0,
        usage_stats: { llm: 0, image: 0, video: 0, audio: 0 }
      },
      publishing: {
        youtube_api_key: '',
        webhook_url: ''
      },
      activeWorkspace: 'default',
      workspaces: [
        { 
          id: 'default', 
          name: 'Default Factory', 
          defaults: {
            global: { 
              aspect_ratio: '16:9', 
              resolution: '1080p', 
              language: 'english', 
              watermark: false, 
              fallback_enabled: true, 
              max_cost_limit: 5.0, 
              budget_alert: true,
              brand_persona: ''
            }
          }
        },
        { 
          id: 'shorts', 
          name: 'YouTube Shorts Factory', 
          defaults: {
            global: { 
              aspect_ratio: '9:16', 
              resolution: '1080p', 
              language: 'arabic', 
              watermark: false, 
              fallback_enabled: true, 
              max_cost_limit: 2.0, 
              budget_alert: true,
              brand_persona: 'Fast-paced Gen-Z Arabic tone, target audience is Gulf region.'
            },
            image: { provider: 'fal.ai', api_key: '', custom_endpoint: '', model_id: 'flux-schnell' }
          }
        },
        { 
          id: 'documentary', 
          name: 'Cinematic Documentary', 
          defaults: {
            global: { 
              aspect_ratio: '16:9', 
              resolution: '4k', 
              language: 'english', 
              watermark: true, 
              fallback_enabled: false, 
              max_cost_limit: 10.0, 
              budget_alert: true,
              brand_persona: 'Deep, immersive narrative style. Formal and educational.'
            },
            video: { provider: 'fal.ai', api_key: '', custom_endpoint: '', model_id: 'luma-dream-machine' }
          }
        }
      ],
      
      loading: false,
      testingProvider: null,
      hasUnsavedChanges: false,

      fetchSettings: async () => {
        try {
          const res = await api.get('/api/settings');
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
          await api.post('/api/settings', newSettings);
          set({ ...newSettings, hasUnsavedChanges: false });
        } catch (err) {
          console.error('Failed to update settings:', err);
        } finally {
          set({ loading: false });
        }
      },

      updateCategory: (category, config) => {
        set((state) => ({
          ...state,
          [category]: { ...(state as unknown as Record<string, unknown>)[category] as Record<string, unknown>, ...config },
          hasUnsavedChanges: true
        }));
      },

      setHasUnsavedChanges: (val) => set({ hasUnsavedChanges: val }),

      testConnection: async (category) => {
        const config = (get() as unknown as Record<string, unknown>)[category] as EngineConfig;
        set({ testingProvider: category });
        try {
          const res = await api.post('/api/settings/test', {
            provider: config.provider,
            api_key: config.api_key
          });
          return res.data;
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Connection failed';
          return { status: 'error', message };
        } finally {
          set({ testingProvider: null });
        }
      },

      switchWorkspace: (id) => {
        const workspace = get().workspaces.find(w => w.id === id);
        if (workspace) {
          set((state) => ({
            ...state,
            ...workspace.defaults,
            activeWorkspace: id,
            hasUnsavedChanges: true
          }));
        }
      }
    }),
    {
      name: 'lumina-settings-storage',
    }
  )
);
