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
  { type: 'Pro 连续月包', value: 45 },
  { type: 'Pro 连续年包', value: 30 },
  { type: '终身会员套餐', value: 25 },
];

export const MOCK_RECENT_ACTIVITY: RecentActivity[] = [
  { id: '1', type: 'order', title: '新订单: zhang***@gmail.com 购买了 Pro 连续月包', time: '2分钟前', status: 'success' },
  { id: '2', type: 'user', title: '用户 id_84210 完成了实名认证', time: '15分钟前' },
  { id: '3', type: 'system', title: '系统成功处理了 Apple Store 的 Webhook 回调', time: '32分钟前', status: 'success' },
  { id: '4', type: 'order', title: '订单 ORD-8842 支付失败 (余额不足)', time: '1小时前', status: 'error' },
  { id: '5', type: 'system', title: '数据库自动备份任务已完成', time: '3小时前', status: 'success' },
];
