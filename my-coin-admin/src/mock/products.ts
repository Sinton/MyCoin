import type { Product, ProductStats } from '../types';

export const MOCK_PRODUCT_STATS: ProductStats = {
  activeProducts: 5,
  totalSubscribers: 12480,
  mrr: 45820.00
};

export const MOCK_PRODUCTS: Product[] = [
  {
    key: '1',
    id: 'com.pro.month',
    name: 'Pro 连续月包',
    type: 'subscription',
    interval: 'month',
    price: 19.00,
    currency: 'CNY',
    appleId: 'com.mycoin.pro.monthly',
    googleId: 'gp.mycoin.pro.monthly',
    status: 'active',
    features: ['无限次记账', '多端同步', '高级报表', 'AI 财务顾问'],
    localizations: [
      { lang: 'en_US', name: 'Pro Monthly', description: 'Unlimited features', currency: 'USD', price: 2.99 },
      { lang: 'ja_JP', name: 'Pro マンスリー', description: '無制限の機能', currency: 'JPY', price: 400 },
    ]
  },
  {
    key: '2',
    id: 'com.plus.year',
    name: 'Plus 连续年包',
    type: 'subscription',
    interval: 'year',
    price: 168.00,
    currency: 'CNY',
    appleId: 'com.mycoin.plus.yearly',
    googleId: 'gp.mycoin.plus.yearly',
    status: 'active',
    features: ['无限次记账', '多端同步', '离线模式'],
    localizations: [
      { lang: 'en_US', name: 'Plus Yearly', description: 'Essential features', currency: 'USD', price: 19.99 },
    ]
  },
  {
    key: '3',
    id: 'com.lifetime.pro',
    name: '终身会员套餐',
    type: 'one-time',
    price: 398.00,
    currency: 'CNY',
    appleId: 'com.mycoin.lifetime',
    googleId: 'gp.mycoin.lifetime',
    status: 'active',
    features: ['所有 Pro 功能', '终身免费更新', '专属身份标识'],
    localizations: []
  }
];
