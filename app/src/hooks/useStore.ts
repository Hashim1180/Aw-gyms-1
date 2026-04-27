import { create } from "zustand";

interface AppState {
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  adminSidebarOpen: boolean;
  setAdminSidebarOpen: (open: boolean) => void;
  activeVideo: string | null;
  setActiveVideo: (url: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  chatOpen: false,
  setChatOpen: (open) => set({ chatOpen: open }),
  adminSidebarOpen: true,
  setAdminSidebarOpen: (open) => set({ adminSidebarOpen: open }),
  activeVideo: null,
  setActiveVideo: (url) => set({ activeVideo: url }),
}));
