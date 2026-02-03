import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface RecentTool {
  id: string;
  name: string;
  path: string;
  lastUsed: number;
}

interface AppState {
  // Recent tools history
  recentTools: RecentTool[];
  addRecentTool: (tool: Omit<RecentTool, 'lastUsed'>) => void;
  clearRecentTools: () => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;

  // Global settings
  settings: {
    autoDownload: boolean;
    showTutorials: boolean;
    compactMode: boolean;
  };
  updateSettings: (settings: Partial<AppState['settings']>) => void;

  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Modal state
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
}

const MAX_RECENT_TOOLS = 5;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Recent tools
      recentTools: [],
      addRecentTool: (tool) => {
        set((state) => {
          const filtered = state.recentTools.filter((t) => t.id !== tool.id);
          const newRecent: RecentTool = { ...tool, lastUsed: Date.now() };
          return {
            recentTools: [newRecent, ...filtered].slice(0, MAX_RECENT_TOOLS),
          };
        });
      },
      clearRecentTools: () => set({ recentTools: [] }),

      // Favorites
      favorites: [],
      toggleFavorite: (toolId) => {
        set((state) => ({
          favorites: state.favorites.includes(toolId)
            ? state.favorites.filter((id) => id !== toolId)
            : [...state.favorites, toolId],
        }));
      },
      isFavorite: (toolId) => get().favorites.includes(toolId),

      // Settings
      settings: {
        autoDownload: false,
        showTutorials: true,
        compactMode: false,
      },
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      // UI state
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Modal
      activeModal: null,
      setActiveModal: (modal) => set({ activeModal: modal }),
    }),
    {
      name: 'web-tools-storage',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      partialize: (state) => ({
        recentTools: state.recentTools,
        favorites: state.favorites,
        settings: state.settings,
      }),
    }
  )
);

// Selector hooks for common patterns
export const useRecentTools = () => useAppStore((state) => state.recentTools);
export const useFavorites = () => useAppStore((state) => state.favorites);
export const useSettings = () => useAppStore((state) => state.settings);
