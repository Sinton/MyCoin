import type { DashboardStats, TrendData, DistributionData, RecentActivity } from '@/types';

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalRevenue: 128420.50,
  totalRevenueChange: 12.5,
  activeUsers: 8420,
  activeUsersChange: 8.2,
  avgOrderValue: 42.80,
  avgOrderValueChange: -2.4,
  healthScore: 94,
  healthScoreChange: 1.5,
};

export const MOCK_REVENUE_TREND: TrendData[] = [
  { date: '2024-05-05', value: 3200 },
  { date: '2024-05-06', value: 4100 },
  { date: '2024-05-07', value: 3800 },
  { date: '2024-05-08', value: 5200 },
  { date: '2024-05-09', value: 4900 },
  { date: '2024-05-10', value: 6100 },
  { date: '2024-05-11', value: 5800 },
];

export const MOCK_PRODUCT_DIST: DistributionData[] = [
  { 
    type: 'Pro 连续月包', 
    value: 45, 
    names: { zh_CN: 'Pro 连续月包', zh_TW: 'Pro 連續月包', en_US: 'Pro Monthly', ja_JP: 'Pro 月間プラン' } 
  },
  { 
    type: 'Pro 连续年包', 
    value: 30, 
    names: { zh_CN: 'Pro 连续年包', zh_TW: 'Pro 連續年包', en_US: 'Pro Yearly', ja_JP: 'Pro 年間プラン' } 
  },
  { 
    type: '终身会员套餐', 
    value: 25, 
    names: { zh_CN: '终身会员套餐', zh_TW: '終身會員套餐', en_US: 'Lifetime Membership', ja_JP: '生涯会员プラン' } 
  },
];

// 基准时间: 2026-04-12 03:00:00 (Unix 毫秒: 1775934000000)
export const MOCK_RECENT_ACTIVITY: RecentActivity[] = [
  { 
    id: '1', 
    type: 'order', 
    title: '新订单: zhang***@gmail.com 购买了 Pro 连续月包', 
    i18n: {
      zh_CN: '新订单: zhang***@gmail.com 购买了 Pro 连续月包',
      zh_TW: '新訂單: zhang***@gmail.com 購買了 Pro 連續月包',
      en_US: 'New Order: zhang***@gmail.com purchased Pro Monthly',
      ja_JP: '新規注文: zhang***@gmail.com が Pro 月間プランを購入しました'
    },
    time: 1775933880000, // 2分钟前
    status: 'success' 
  },
  { 
    id: '2', 
    type: 'user', 
    title: '用户 id_84210 完成了实名认证', 
    i18n: {
      zh_CN: '用户 id_84210 完成了实名认证',
      zh_TW: '用戶 id_84210 完成了实名认证',
      en_US: 'User id_84210 completed KYC verification',
      ja_JP: 'ユーザー id_84210 が本人确认を完了しました'
    },
    time: 1775933100000 // 15分钟前
  },
  { 
    id: '3', 
    type: 'system', 
    title: '系统成功处理了 Apple Store 的 Webhook 回调', 
    i18n: {
      zh_CN: '系统成功处理了 Apple Store 的 Webhook 回调',
      zh_TW: '系統成功處理了 Apple Store 的 Webhook 回調',
      en_US: 'System successfully processed Apple Store Webhook',
      ja_JP: 'システムが Apple Store の Webhook 回信を正常に处理しました'
    },
    time: 1775932080000, // 32分钟前
    status: 'success' 
  },
  { 
    id: '4', 
    type: 'order', 
    title: '订单 ORD-8842 支付失败 (余额不足)', 
    i18n: {
      zh_CN: '订单 ORD-8842 支付失败 (余额不足)',
      zh_TW: '訂單 ORD-8842 支付失敗 (餘額不足)',
      en_US: 'Order ORD-8842 payment failed (Insufficient funds)',
      ja_JP: '注文 ORD-8842 の決済に失敗しました (残高不足)'
    },
    time: 1775930400000, // 1小时前
    status: 'error' 
  },
  { 
    id: '5', 
    type: 'system', 
    title: '数据库自动备份任务已完成', 
    i18n: {
      zh_CN: '数据库自动备份任务已完成',
      zh_TW: '資料庫自動備份任務已完成',
      en_US: 'Database auto-backup task completed',
      ja_JP: 'データベースの自動バックアップタスクが完了しました'
    },
    time: 1775923200000, // 3小时前
    status: 'success' 
  },
];
