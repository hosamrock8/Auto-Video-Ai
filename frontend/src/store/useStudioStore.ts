import { create } from 'zustand';
import axios from 'axios';

interface Project {
  id: string;
  status: string;
  input: string | null;
  script: {
    title: string;
    scenes: Array<{
      scene_number: number;
      narrator_text: string;
      image_prompt: string;
      motion_direction: string;
    }>;
  } | null;
  assets: {
    scenes: Array<{
      scene: number;
      audio: string;
      image: string;
    }>;
  } | null;
  costs: {
    total: number;
    details: Array<any>;
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
  
  // Actions
  initProject: () => Promise<string>;
  fetchProject: (id: string) => Promise<void>;
  generateScript: (id: string, source: string) => Promise<void>;
  updateScriptLocally: (script: any) => void;
  syncAllProjects: () => Promise<void>;
  generateAssets: (id: string) => Promise<void>;
  regenerateScene: (id: string, sceneNumber: number) => Promise<void>;
  finalizeProduction: (id: string) => Promise<void>;
  startPolling: (id: string) => void;
  stopPolling: () => void;
}

let pollInterval: NodeJS.Timeout | null = null;

export const useStudioStore = create<StudioState>((set, get) => ({
  currentProject: null,
  allProjects: [],
  loading: false,
  isPolling: false,

  initProject: async () => {
    const res = await axios.post('http://localhost:8000/api/projects/init');
    return res.data.project_id;
  },

  fetchProject: async (id: string) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/projects/${id}`);
      set({ currentProject: res.data });
    } catch (err) {
      console.error('Fetch error:', err);
    }
  },

  generateScript: async (id: string, source: string) => {
    set({ loading: true });
    try {
      await axios.post(`http://localhost:8000/api/projects/${id}/generate-script`, { source });
      get().startPolling(id);
    } catch (err) {
      console.error('Generate script error:', err);
    } finally {
      set({ loading: false });
    }
  },

  generateAssets: async (id: string) => {
    set({ loading: true });
    try {
      await axios.post(`http://localhost:8000/api/projects/${id}/generate-assets`);
      get().startPolling(id);
    } catch (err) {
      console.error('Generate assets error:', err);
    } finally {
      set({ loading: false });
    }
  },

  regenerateScene: async (id: string, sceneNumber: number) => {
    try {
      await axios.post(`http://localhost:8000/api/projects/${id}/regenerate-scene/${sceneNumber}`);
      get().startPolling(id);
    } catch (err) {
      console.error('Regenerate scene error:', err);
    }
  },

  finalizeProduction: async (id: string) => {
    set({ loading: true });
    try {
      await axios.post(`http://localhost:8000/api/projects/${id}/finalize`);
      get().startPolling(id);
    } catch (err) {
      console.error('Finalize error:', err);
    } finally {
      set({ loading: false });
    }
  },

  updateScriptLocally: (script: any) => {
    set((state) => ({
      currentProject: state.currentProject ? { ...state.currentProject, script } : null
    }));
  },

  syncAllProjects: async () => {
    const res = await axios.get('http://localhost:8000/api/projects');
    set({ allProjects: res.data });
  },

  startPolling: (id: string) => {
    if (pollInterval) clearInterval(pollInterval);
    set({ isPolling: true });
    
    pollInterval = setInterval(async () => {
      const res = await axios.get(`http://localhost:8000/api/projects/${id}`);
      const project = res.data;
      set({ currentProject: project });

      // Stop polling on terminal states
      if (['awaiting_script_approval', 'awaiting_asset_approval', 'completed', 'error'].includes(project.status)) {
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
