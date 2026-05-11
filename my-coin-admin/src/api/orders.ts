import { request } from '@/utils/request';
import type { ApiResponse, Order, OrderStats } from '@/types';

export const getOrders = (): Promise<ApiResponse<Order[]>> => {
  return request({ url: '/orders', method: 'GET' });
};

export const getOrderStats = (): Promise<ApiResponse<OrderStats>> => {
  return request({ url: '/orders/stats', method: 'GET' });
};

export const updateOrderStatus = (id: string, status: string): Promise<ApiResponse<null>> => {
  return request({ 
    url: `/orders/${id}/status`, 
    method: 'PUT',
    data: { status }
  });
};
