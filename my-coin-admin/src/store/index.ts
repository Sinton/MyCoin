import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '@/i18n';

// ============================================================
// 1. UI Store：管理与 UI 交互相关的客户端状态（不做持久化）
// ============================================================
interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
}));

// ============================================================
// 2. Config Store：管理全局偏好配置
// ============================================================
interface ConfigState {
  language: string;
  setLanguage: (lang: string) => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      language: 'zh_CN', // 默认简体中文
      setLanguage: (lang) => {
        set({ language: lang });
        i18n.changeLanguage(lang);
      },
    }),
    {
      name: 'mycoin_config',
    }
  )
);
