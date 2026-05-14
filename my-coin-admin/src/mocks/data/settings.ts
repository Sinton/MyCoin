import type { ApiResponse } from '@/types';

export interface SystemSettings {
  general: {
    previewLang: string;
    language: string;
    compactMode: boolean;
    emailAlert: boolean;
    browserNotification: boolean;
  };
  developer: {
    webhookSecret: string;
    apiEndpoint: string;
    debugMode: boolean;
  };
  about: {
    version: string;
    buildDate: string;
    env: string;
  };
}

export const MOCK_SETTINGS: SystemSettings = {
  general: {
    language: 'zh_CN',
    compactMode: true,
    emailAlert: true,
    browserNotification: false,
  },
  developer: {
    webhookSecret: 'sk_test_51MzS2yLpXvQ9...',
    apiEndpoint: 'https://api.mycoin.com/v1/webhooks',
    debugMode: false,
  },
  about: {
    version: 'v1.2.4',
    buildDate: '20260511',
    env: 'Production',
  }
};
