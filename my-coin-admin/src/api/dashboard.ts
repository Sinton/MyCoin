import type { 
  ApiResponse, 
  DashboardStats, 
  TrendData, 
  DistributionData, 
  RecentActivity 
} from '../types';
import { 
  MOCK_DASHBOARD_STATS, 
  MOCK_REVENUE_TREND, 
  MOCK_PRODUCT_DIST, 
  MOCK_RECENT_ACTIVITY 
} from '../mock/dashboard';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 获取核心统计指标
 */
export const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
  await sleep(500);
  return { code: 200, data: MOCK_DASHBOARD_STATS, message: 'success' };
};

/**
 * 获取营收趋势数据
 */
export const getRevenueTrend = async (): Promise<ApiResponse<TrendData[]>> => {
  await sleep(700);
  return { code: 200, data: MOCK_REVENUE_TREND, message: 'success' };
};

/**
 * 获取订阅产品分布数据
 */
export const getProductDistribution = async (): Promise<ApiResponse<DistributionData[]>> => {
  await sleep(600);
  return { code: 200, data: MOCK_PRODUCT_DIST, message: 'success' };
};

/**
 * 获取最近动态
 */
export const getRecentActivity = async (): Promise<ApiResponse<RecentActivity[]>> => {
  await sleep(400);
  return { code: 200, data: MOCK_RECENT_ACTIVITY, message: 'success' };
};
