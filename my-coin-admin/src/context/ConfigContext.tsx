import React, { createContext, useContext, useState } from 'react';

interface ConfigContextType {
  previewLang: string;
  setPreviewLang: (lang: string) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 从本地存储读取，实现持久化
  const [previewLang, setPreviewLangState] = useState(() => {
    return localStorage.getItem('mycoin_preview_lang') || 'master';
  });

  const setPreviewLang = (lang: string) => {
    setPreviewLangState(lang);
    localStorage.setItem('mycoin_preview_lang', lang);
  };

  return (
    <ConfigContext.Provider value={{ previewLang, setPreviewLang }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
