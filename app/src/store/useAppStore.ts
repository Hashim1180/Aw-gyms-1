import { create } from "zustand";

interface ChatMessage {
  role: "user" | "ai";
  text: string;
  timestamp: number;
}

interface AppState {
  isChatOpen: boolean;
  chatMessages: ChatMessage[];
  isAiTyping: boolean;
  aiEnabled: boolean;
  adminTab: string;
  
  toggleChat: () => void;
  addMessage: (msg: ChatMessage) => void;
  setAiTyping: (typing: boolean) => void;
  setAiEnabled: (enabled: boolean) => void;
  setAdminTab: (tab: string) => void;
  clearChat: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isChatOpen: false,
  chatMessages: [
    { role: "ai", text: "Welcome to AW GYMS. I am your autonomous training coordinator. How may I optimize your protocol today?", timestamp: Date.now() },
  ],
  isAiTyping: false,
  aiEnabled: true,
  adminTab: "metrics",
  
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  addMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
  setAiTyping: (typing) => set({ isAiTyping: typing }),
  setAiEnabled: (enabled) => set({ aiEnabled: enabled }),
  setAdminTab: (tab) => set({ adminTab: tab }),
  clearChat: () => set({ chatMessages: [] }),
}));
