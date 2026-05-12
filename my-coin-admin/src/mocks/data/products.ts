import type { Product, ProductStats, FeatureLibraryItem } from '@/types';

export const MOCK_FEATURE_LIBRARY: FeatureLibraryItem[] = [
  { key: 'FEAT_UNLIMITED', label: '无限次记账', sort: 1, category: 'feature' },
  { key: 'FEAT_SYNC', label: '多端同步', sort: 2, category: 'feature' },
  { key: 'FEAT_REPORT', label: '高级报表', sort: 3, category: 'feature' },
  { key: 'FEAT_AI', label: 'AI 财务顾问', sort: 4, category: 'feature' },
  { key: 'FEAT_OFFLINE', label: '离线模式', sort: 5, category: 'experience' },
  { key: 'FEAT_STORAGE_50G', label: '50GB 云端空间', sort: 10, category: 'storage' },
  { key: 'FEAT_SUPPORT_PRIO', label: '优先技术支持', sort: 20, category: 'service' },
];

// --- 关键：使用可变变量存储 Mock 数据 ---
export let LIVE_PRODUCTS: Product[] = [
  {
    id: 'com.pro.month',
    name: 'Pro 连续月包',
    type: 'subscription',
    cycle: 'month',
    price: 19.00,
    currency: 'CNY',
    appleId: 'com.mycoin.pro.monthly',
    googleId: 'gp.mycoin.pro.monthly',
    enableApple: true,
    enableGoogle: true,
    status: 'active',
    features: [
      { key: 'FEAT_UNLIMITED', label: '无限次记账', sort: 1, category: 'feature' },
      { key: 'FEAT_SYNC', label: '多端同步', sort: 2, category: 'feature' },
      { key: 'FEAT_REPORT', label: '高级报表', sort: 3, category: 'feature' }
    ],
    locales: [
      { lang: 'en_US', name: 'Pro Monthly', description: 'Unlimited features for pro users' },
      { lang: 'ja_JP', name: 'Pro マンスリー', description: 'プロユーザー向けの無制限の功能' },
    ]
  },
  {
    id: 'com.plus.year',
    name: 'Plus 连续年包',
    type: 'subscription',
    cycle: 'year',
    price: 168.00,
    currency: 'CNY',
    appleId: 'com.mycoin.plus.yearly',
    googleId: 'gp.mycoin.plus.yearly',
    enableApple: true,
    enableGoogle: true,
    status: 'active',
    features: [
      { key: 'FEAT_UNLIMITED', label: '无限次记账', sort: 1, category: 'feature' },
      { key: 'FEAT_OFFLINE', label: '离线模式', sort: 5, category: 'experience' }
    ],
    locales: [
      { lang: 'en_US', name: 'Plus Yearly', description: 'Best value for essential features' },
    ]
  },
  {
    id: 'pkg_lifetime_2024',
    name: '终身会员套餐',
    type: 'one-time',
    cycle: 'forever',
    price: 398.00,
    currency: 'CNY',
    appleId: 'com.mycoin.lifetime',
    googleId: 'gp.mycoin.lifetime',
    enableApple: true,
    enableGoogle: true,
    status: 'inactive',
    features: [
      { key: 'FEAT_UNLIMITED', label: '无限次记账', sort: 1, category: 'feature' },
      { key: 'FEAT_AI', label: 'AI 财务顾问', sort: 4, category: 'feature' }
    ],
    locales: []
  }
];

/**
 * 动态计算统计指标，确保数据“真实”
 */
export const getLiveStats = (): ProductStats => {
  const activeProducts = LIVE_PRODUCTS.filter(p => p.status === 'active').length;
  return {
    activeProducts,
    totalSubscribers: 12480,
    mrr: 45820.00
  };
};

/**
 * 更新内存中的状态
 */
export const updateLiveProductStatus = (id: string, status: 'active' | 'inactive') => {
  LIVE_PRODUCTS = LIVE_PRODUCTS.map(p => p.id === id ? { ...p, status } : p);
};
