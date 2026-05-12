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
// 2. Config Store：管理需要持久化的全局偏好配置
//    替代原 ConfigContext，使用 zustand/middleware 的 persist
//    自动同步至 localStorage，无需手动调用 setItem
// ============================================================
interface ConfigState {
  previewLang: string;
  setPreviewLang: (lang: string) => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      previewLang: 'master',
      setPreviewLang: (lang) => {
        set({ previewLang: lang });
        i18n.changeLanguage(lang);
      },
    }),
    {
      name: 'mycoin_config', // localStorage key
    }
  )
);
