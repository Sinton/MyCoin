export type ApiResponse<T> = {
  code: number;
  data: T;
  message: string;
}

// --- 订单相关 (保持不变) ---
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

// --- 仪表盘相关 (保持不变) ---
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

// --- Webhook 相关 (保持不变) ---
export type WebhookLog = {
  key: string;
  id: string;
  event: string;
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

// --- 产品/套餐相关 (回归原始 c53acab 定义) ---
export type FeatureLibraryItem = {
  key: string;
  label: string;
  sort: number;
  category: string;
}

export type ProductLocale = {
  lang: string;
  name: string;
  description: string;
}

export type Product = {
  id: string;
  key?: string; // 兼容 key
  name: string;
  price: number;
  currency: string;
  type: 'subscription' | 'consumable' | 'one-time';
  cycle: 'month' | 'year' | 'forever' | 'none';
  appleId: string;
  googleId: string;
  enableApple: boolean;
  enableGoogle: boolean;
  status: 'active' | 'inactive';
  features: FeatureLibraryItem[];
  locales: ProductLocale[];
}

export type ProductStats = {
  activeProducts: number;
  totalSubscribers: number;
  mrr: number;
}
