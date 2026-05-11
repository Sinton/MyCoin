import { request } from '@/utils/request';
import type { 
  ApiResponse, 
  DashboardStats, 
  TrendData, 
  DistributionData, 
  RecentActivity 
} from '@/types';

/**
 * 获取核心统计指标
 */
export const getDashboardStats = (): Promise<ApiResponse<DashboardStats>> => {
  return request({ url: '/dashboard/stats', method: 'GET' });
};

/**
 * 获取营收趋势数据
 */
export const getRevenueTrend = (): Promise<ApiResponse<TrendData[]>> => {
  return request({ url: '/dashboard/revenue', method: 'GET' });
};

/**
 * 获取订阅产品分布数据
 */
export const getProductDistribution = (): Promise<ApiResponse<DistributionData[]>> => {
  return request({ url: '/dashboard/distribution', method: 'GET' });
};

/**
 * 获取最近动态
 */
export const getRecentActivity = (): Promise<ApiResponse<RecentActivity[]>> => {
  return request({ url: '/dashboard/activity', method: 'GET' });
};
