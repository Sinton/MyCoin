import type { ApiResponse } from '@/types';

export interface ProductFeature {
  key: string;
  name: string;
  sort: number;
  category: string;
  locales?: Record<string, string>;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'USD' | 'CNY' | 'JPY' | 'KRW';
  interval: 'month' | 'year' | 'forever';
  status: 'active' | 'inactive';
  features: string[]; // 存储 feature key
  locales?: {
    lang: string;
    name: string;
    description: string;
  }[];
  // 兼容旧版字段
  appleId?: string;
  googleId?: string;
  enableApple?: boolean;
  enableGoogle?: boolean;
}

// 还原 8b96911 版本的原始权益素材
export let MOCK_FEATURE_LIBRARY: ProductFeature[] = [
  { 
    key: 'FEAT_UNLIMITED', 
    name: '无限次记账', 
    sort: 1, 
    category: 'entitlement',
    locales: { en_US: 'Unlimited Accounting', zh_TW: '無限次記賬', ja_JP: '無制限の記帳', ko_KR: '무제한 장부 기록' }
  },
  { 
    key: 'FEAT_SYNC', 
    name: '多端同步', 
    sort: 2, 
    category: 'experience',
    locales: { en_US: 'Multi-device Sync', zh_TW: '多端同步', ja_JP: 'デバイス間同期', ko_KR: '멀티 디바이스 동기화' }
  },
  { 
    key: 'FEAT_REPORT', 
    name: '高级报表', 
    sort: 3, 
    category: 'feature',
    locales: { en_US: 'Advanced Reports', zh_TW: '高級報表', ja_JP: '詳細レポート', ko_KR: '고급 보고서' }
  },
  { 
    key: 'FEAT_AI', 
    name: 'AI 财务顾问', 
    sort: 4, 
    category: 'feature',
    locales: { en_US: 'AI Financial Advisor', zh_TW: 'AI 財務顧問', ja_JP: 'AI財務アドバイザー', ko_KR: 'AI 재무 관리자' }
  },
  { 
    key: 'FEAT_OFFLINE', 
    name: '离线模式', 
    sort: 5, 
    category: 'experience',
    locales: { en_US: 'Offline Mode', zh_TW: '離線模式', ja_JP: 'オフラインモード', ko_KR: '오프라인 모드' }
  },
  { 
    key: 'FEAT_STORAGE_50G', 
    name: '50GB 云端空间', 
    sort: 10, 
    category: 'storage',
    locales: { en_US: '50GB Cloud Storage', zh_TW: '50GB 雲端空間', ja_JP: '50GB クラウドストレージ', ko_KR: '50GB 클라우드 저장소' }
  },
  { 
    key: 'FEAT_SUPPORT_PRIO', 
    name: '优先技术支持', 
    sort: 20, 
    category: 'service',
    locales: { en_US: 'Priority Support', zh_TW: '優先技術支持', ja_JP: '優先サポート', ko_KR: '우선 기술 지원' }
  },
];

export let LIVE_PRODUCTS: Product[] = [
  {
    id: 'com.pro.month',
    name: 'Pro 连续月包',
    description: '适合个人用户的进阶之选，解锁无限记账与同步。',
    price: 19.00,
    currency: 'CNY',
    interval: 'month',
    status: 'active',
    appleId: 'com.mycoin.pro.monthly',
    googleId: 'gp.mycoin.pro.monthly',
    enableApple: true,
    enableGoogle: true,
    features: ['FEAT_UNLIMITED', 'FEAT_SYNC', 'FEAT_REPORT'],
    locales: [
      { lang: 'en_US', name: 'Pro Monthly', description: 'Advanced choice for individuals, unlock unlimited accounting.' },
      { lang: 'zh_TW', name: 'Pro 連續月包', description: '適合個人用戶的進階之选，解鎖無限記賬與同步。' },
      { lang: 'ja_JP', name: 'Pro マンスリー', description: 'プロユーザー向けの無制限機能。' },
      { lang: 'ko_KR', name: 'Pro 월간 패키지', description: '개인 사용자를 위한 최적의 선택, 무제한 장부 기록을 경험하세요.' }
    ]
  },
  {
    id: 'com.plus.year',
    name: 'Plus 连续年包',
    description: '最受欢迎的年度方案，包含离线模式与更多空间。',
    price: 168.00,
    currency: 'CNY',
    interval: 'year',
    status: 'active',
    appleId: 'com.mycoin.plus.yearly',
    googleId: 'gp.mycoin.plus.yearly',
    enableApple: true,
    enableGoogle: true,
    features: ['FEAT_UNLIMITED', 'FEAT_OFFLINE', 'FEAT_STORAGE_50G'],
    locales: [
      { lang: 'en_US', name: 'Plus Yearly', description: 'Most popular annual plan, including offline mode.' },
      { lang: 'zh_TW', name: 'Plus 連續年包', description: '最受歡迎的年度方案，包含離線模式與更多空間。' },
      { lang: 'ja_JP', name: 'Plus アニュアル', description: '一番人気の年間プラン。' },
      { lang: 'ko_KR', name: 'Plus 연간 패키지', description: '가장 인기 있는 연간 요금제, 오프라인 모드가 포함됩니다.' }
    ]
  },
  {
    id: 'pkg_lifetime_2024',
    name: '终身会员套餐',
    description: '一次性付费，永久拥有 AI 财务顾问。',
    price: 398.00,
    currency: 'CNY',
    interval: 'forever',
    status: 'inactive',
    appleId: 'com.mycoin.lifetime',
    googleId: 'gp.mycoin.lifetime',
    enableApple: true,
    enableGoogle: true,
    features: ['FEAT_UNLIMITED', 'FEAT_AI', 'FEAT_SUPPORT_PRIO'],
    locales: [
      { lang: 'en_US', name: 'Lifetime Membership', description: 'One-time payment, lifetime AI financial advisor.' },
      { lang: 'zh_TW', name: '終身會員套餐', description: '一次性付費，永久擁有 AI 財務顧問。' },
      { lang: 'ja_JP', name: '生涯メンバーシップ', description: '一生涯のAIアドバイザー。' },
      { lang: 'ko_KR', name: '평생 멤버십 요금제', description: '한 번의 결제로 AI 재무 관리자를 평생 소장하세요.' }
    ]
  }
];

export const updateProduct = (updated: Product) => {
  LIVE_PRODUCTS = LIVE_PRODUCTS.map(p => p.id === updated.id ? updated : p);
};

export const deleteProduct = (id: string) => {
  LIVE_PRODUCTS = LIVE_PRODUCTS.filter(p => p.id !== id);
};

export const addProduct = (product: Product) => {
  LIVE_PRODUCTS.unshift(product);
};

export const getLiveStats = () => {
  return {
    active: LIVE_PRODUCTS.filter(p => p.status === 'active').length,
    features: MOCK_FEATURE_LIBRARY.length,
    lastUpdate: '刚刚'
  };
};
