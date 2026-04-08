'use client';

import { create } from 'zustand';
import api from '@/lib/api';

interface Scene {
  scene_number: number;
  narrator_text: string;
  image_prompt: string;
  video_animation_prompt: string;
  motion_direction: string;
}

interface Script {
  title: string;
  scenes: Scene[];
}

interface CostDetail {
  provider: string;
  model: string;
  cost: number;
  time: string;
}

interface Project {
  id: string;
  status: string;
  input: string | null;
  script: Script | null;
  assets: {
    scenes: Array<{
      scene: number;
      audio: string;
      image: string;
      video?: string;
    }>;
  } | null;
  costs: {
    total: number;
    details: CostDetail[];
  };
  output_video?: string;
  thumbnail?: string;
  seo?: {
    titles: string[];
    description: string;
    tags: string[];
  };
  error_log: string | null;
}

interface StudioState {
  currentProject: Project | null;
  allProjects: Project[];
  loading: boolean;
  isPolling: boolean;
  isGenerating: boolean;
  currentProjectId: string | null;
  isGeneratingImages: boolean;
  isGeneratingVideos: boolean;
  
  // Wizard State
  wizardStep: number;
  wizardData: {
    niche: string;
    hook: string;
    customFocus: string;
    customScript: string;
    language: string;
    voice: string;
    bgStyle: string;
    bgMusic: string;
    artStyle: string;
    captionStyle: string;
    voicePersona: string;
    effects: {
      shake: boolean;
      filmGrain: boolean;
      animatedHook: boolean;
    };
    socialsConnected: boolean;
    seriesName: string;
    videoDuration: string;
    publishTime: string;
    generatedScript: Script | null;
  };

  setWizardStep: (step: number) => void;
  updateWizardData: (data: Partial<StudioState['wizardData']>) => void;
  initProject: () => Promise<string>;
  generateScript: () => Promise<void>;
  generateImages: () => Promise<void>;
  generateVideos: () => Promise<void>;
  resetWizard: () => void;
  
  // Dashboard Actions
  fetchProject: (id: string) => Promise<void>;
  syncAllProjects: () => Promise<void>;
  generateAssets: (id: string) => Promise<void>;
  finalizeProduction: (id: string) => Promise<void>;
  startPolling: (id: string) => void;
  stopPolling: () => void;
}

let pollInterval: NodeJS.Timeout | null = null;

export const useStudioStore = create<StudioState>()((set, get) => ({
  currentProject: null,
  allProjects: [],
  loading: false,
  isPolling: false,
  isGenerating: false,
  currentProjectId: null,
  isGeneratingImages: false,
  isGeneratingVideos: false,

  wizardStep: 0,
  wizardData: {
    niche: 'scary-stories',
    hook: '',
    customFocus: '',
    customScript: '',
    language: 'english',
    voice: 'adam',
    bgMusic: 'none',
    bgStyle: 'ai-gen',
    artStyle: '3d-render',
    captionStyle: 'bold-stroke',
    voicePersona: 'professional',
    effects: {
      shake: true,
      filmGrain: false,
      animatedHook: true,
    },
    socialsConnected: false,
    seriesName: '',
    videoDuration: '30-45',
    publishTime: '18:00',
    generatedScript: null,
  },

  setWizardStep: (step) => set({ wizardStep: step }),
  updateWizardData: (data) => set((state) => ({
    wizardData: { ...state.wizardData, ...data }
  })),

  initProject: async () => {
    try {
      const resp = await api.post('/api/projects/init');
      const projectId = resp.data.project_id;
      set({ currentProjectId: projectId });
      return projectId;
    } catch (err) {
      console.error("Init project failed", err);
      throw err;
    }
  },

  generateScript: async () => {
    const { wizardData, currentProjectId, initProject } = get();
    set({ isGenerating: true });

    try {
      let projectId = currentProjectId;
      if (!projectId) {
        projectId = await initProject();
      }

      const source = wizardData.niche === 'custom' 
        ? `${wizardData.customFocus}\n\nExample:\n${wizardData.customScript}`
        : wizardData.niche;

      await api.post(`/api/projects/${projectId}/generate-script`, {
        source,
        config: {
          art_style: wizardData.artStyle,
          language: wizardData.language,
          voice: wizardData.voice
        }
      });

      // Poll until status is AWAITING_SCRIPT_APPROVAL
      let status = 'scripting';
      while (status === 'scripting' || status === 'pending') {
        const checkResp = await api.get(`/api/projects/${projectId}`);
        status = checkResp.data.status.toLowerCase();
        if (status === 'awaiting_script_approval') {
          set({ 
            wizardData: { 
              ...wizardData, 
              generatedScript: checkResp.data.script 
            } 
          });
          break;
        }
        if (status === 'error') {
          throw new Error(checkResp.data.error_log || "Generation failed");
        }
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch (err) {
      console.error("Generate script failed", err);
    } finally {
      set({ isGenerating: false });
    }
  },

  generateImages: async () => {
    const { currentProjectId } = get();
    if (!currentProjectId) return;

    set({ isGeneratingImages: true });
    try {
      await api.post(`/api/projects/${currentProjectId}/generate-images`);

      // Poll until status is AWAITING_ASSET_APPROVAL
      let status = 'generating_assets';
      while (status === 'generating_assets' || status === 'scripting') {
        const checkResp = await api.get(`/api/projects/${currentProjectId}`);
        status = checkResp.data.status.toLowerCase();
        
        if (status === 'awaiting_asset_approval') {
          set({ currentProject: checkResp.data });
          break;
        }
        if (status === 'error') {
          throw new Error(checkResp.data.error_log || "Image generation failed");
        }
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch (err) {
      console.error("Generate images failed", err);
    } finally {
      set({ isGeneratingImages: false });
    }
  },

  generateVideos: async () => {
    const { currentProjectId } = get();
    if (!currentProjectId) return;

    set({ isGeneratingVideos: true });
    try {
      await api.post(`/api/projects/${currentProjectId}/generate-videos`);

      // Poll until status is AWAITING_ASSET_APPROVAL
      let status = 'generating_assets';
      while (status === 'generating_assets' || status === 'scripting') {
        const checkResp = await api.get(`/api/projects/${currentProjectId}`);
        status = checkResp.data.status.toLowerCase();
        
        if (status === 'awaiting_asset_approval') {
          set({ currentProject: checkResp.data });
          break;
        }
        if (status === 'error') {
          throw new Error(checkResp.data.error_log || "Video generation failed");
        }
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch (err) {
      console.error("Generate videos failed", err);
    } finally {
      set({ isGeneratingVideos: false });
    }
  },

  resetWizard: () => set({
    wizardStep: 1,
    currentProjectId: null,
    wizardData: {
      niche: 'scary-stories',
      hook: '',
      customFocus: '',
      customScript: '',
      language: 'english',
      voice: 'adam',
      bgMusic: 'none',
      bgStyle: 'ai-gen',
      artStyle: '3d-render',
      captionStyle: 'bold-stroke',
      voicePersona: 'professional',
      effects: {
        shake: true,
        filmGrain: false,
        animatedHook: true,
      },
      socialsConnected: false,
      seriesName: '',
      videoDuration: '30-45',
      publishTime: '18:00',
      generatedScript: null,
    }
  }),

  fetchProject: async (id: string) => {
    try {
      const res = await api.get(`/api/projects/${id}`);
      set({ currentProject: res.data });
    } catch (err) {
      console.error('Fetch error:', err);
    }
  },

  syncAllProjects: async () => {
    const res = await api.get('/api/projects');
    set({ allProjects: res.data });
  },

  generateAssets: async (id: string) => {
    set({ loading: true });
    try {
      await api.post(`/api/projects/${id}/generate-assets`);
      get().startPolling(id);
    } catch (err) {
      console.error('Generate assets error:', err);
    } finally {
      set({ loading: false });
    }
  },

  finalizeProduction: async (id: string) => {
    set({ loading: true });
    try {
      await api.post(`/api/projects/${id}/finalize`);
      get().startPolling(id);
    } catch (err) {
      console.error('Finalize error:', err);
    } finally {
      set({ loading: false });
    }
  },

  startPolling: (id: string) => {
    if (pollInterval) clearInterval(pollInterval);
    set({ isPolling: true });
    
    pollInterval = setInterval(async () => {
      const res = await api.get(`/api/projects/${id}`);
      const project = res.data;
      set({ currentProject: project });

      const termStates = ['awaiting_script_approval', 'awaiting_asset_approval', 'completed', 'error'];
      if (termStates.includes(project.status.toLowerCase())) {
        get().stopPolling();
      }
    }, 2000);
  },

  stopPolling: () => {
    if (pollInterval) clearInterval(pollInterval);
    pollInterval = null;
    set({ isPolling: false });
  }
}));
