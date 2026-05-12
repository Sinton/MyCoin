import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh_CN from './locales/zh_CN.json';
import en_US from './locales/en_US.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      zh_CN: { translation: zh_CN },
      en_US: { translation: en_US },
      master: { translation: zh_CN }, // 默认 fallback
    },
    lng: 'zh_CN', // 初始语言
    fallbackLng: 'zh_CN',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
