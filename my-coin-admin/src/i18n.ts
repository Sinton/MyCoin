import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh_CN from './locales/zh_CN.json';
import en_US from './locales/en_US.json';
import zh_TW from './locales/zh_TW.json';
import ja_JP from './locales/ja_JP.json';
import ko_KR from './locales/ko_KR.json';

// 尝试从 localStorage 中读取 Zustand 持久化的语言设置
const getInitialLanguage = () => {
  const savedConfig = localStorage.getItem('mycoin_config');
  if (savedConfig) {
    try {
      const { state } = JSON.parse(savedConfig);
      return state.language || 'zh_CN';
    } catch (e) {
      return 'zh_CN';
    }
  }
  return 'zh_CN';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      zh_CN: { translation: zh_CN },
      en_US: { translation: en_US },
      zh_TW: { translation: zh_TW },
      ja_JP: { translation: ja_JP },
      ko_KR: { translation: ko_KR },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'zh_CN',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
