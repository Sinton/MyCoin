export type ApiResponse<T> = {
  code: number;
  data: T;
  message: string;
}

// --- 订单相关 ---
export type Order = {
  key: string;
  id: string;
  user: string;
  product: string;
  amount: number;
  status: 'success' | 'pending' | 'refunded';
  time: string;
  platform: 'apple' | 'android';
}

export type OrderStats = {
  todayOrders: number;
  todayRevenue: number;
  refundCount: number;
  activeUsers: number;
}

// --- 仪表盘相关 ---
export type DashboardStats = {
  totalRevenue: number;
  totalRevenueChange: number;
  activeUsers: number;
  activeUsersChange: number;
  avgOrderValue: number;
  avgOrderValueChange: number;
  healthScore: number;
  healthScoreChange: number;
}

export type TrendData = {
  date: string;
  value: number;
}

export type DistributionData = {
  type: string;
  value: number;
}

export type RecentActivity = {
  id: string;
  type: 'order' | 'system' | 'user';
  title: string;
  time: string;
  status?: string;
}

// --- Webhook 相关 ---
export type WebhookEvent = 'SUBSCRIBED' | 'DID_RENEW' | 'REFUND' | 'EXPIRED' | 'GRACE_PERIOD';

export type WebhookLog = {
  key: string;
  id: string;
  event: WebhookEvent;
  product: string;
  status: 'success' | 'failed';
  time: string;
  latency: number; 
  payload: string; 
  response: string; 
}

export type WebhookStats = {
  total24h: number;
  successRate: number;
  alertCount: number;
}

// --- 产品/订阅相关 ---
export type ProductStatus = 'active' | 'archived' | 'draft';

export type Localization = {
  lang: string;
  name: string;
  description: string;
  currency: string;
  price: number;
}

export type Product = {
  key: string;
  id: string;
  name: string;
  type: 'subscription' | 'one-time';
  interval?: 'month' | 'year';
  price: number;
  currency: string;
  appleId: string;
  googleId: string;
  status: ProductStatus;
  features: string[];
  localizations: Localization[];
}

export type ProductStats = {
  activeProducts: number;
  totalSubscribers: number;
  mrr: number; // Monthly Recurring Revenue
}
