import type { ApiResponse, Order, OrderStats } from '../types';
import { MOCK_ORDERS, MOCK_ORDER_STATS } from '../mock/orders';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getOrders = async (): Promise<ApiResponse<Order[]>> => {
  await sleep(600);
  return {
    code: 200,
    data: MOCK_ORDERS,
    message: 'success'
  };
};

export const getOrderStats = async (): Promise<ApiResponse<OrderStats>> => {
  await sleep(400);
  return {
    code: 200,
    data: MOCK_ORDER_STATS,
    message: 'success'
  };
};

export const updateOrderStatus = async (id: string, status: string): Promise<ApiResponse<null>> => {
  await sleep(800);
  return {
    code: 200,
    data: null,
    message: '状态更新成功'
  };
};
