import type { Order, OrderStats } from '@/types';

export const MOCK_ORDERS: Order[] = [
  { key: '1', id: 'ORD-20240511001', user: '张三 (ID: U88421)', product: 'Pro 连续月包', amount: 19.00, status: 'success', time: '2024-05-11 10:30:25', platform: 'apple' },
  { key: '2', id: 'ORD-20240511002', user: '李美丽 (ID: U77210)', product: 'Pro 连续年包', amount: 168.00, status: 'pending', time: '2024-05-11 11:15:10', platform: 'android' },
  { key: '3', id: 'ORD-20240511003', user: '王五 (ID: U99215)', product: '终身会员套餐', amount: 398.00, status: 'success', time: '2024-05-11 09:45:00', platform: 'apple' },
  { key: '4', id: 'ORD-20240511004', user: '赵小六 (ID: U11202)', product: 'Pro 连续月包', amount: 19.00, status: 'refunded', time: '2024-05-11 08:20:15', platform: 'apple' },
  { key: '5', id: 'ORD-20240511005', user: '钱老七 (ID: U55410)', product: 'Pro 连续月包', amount: 19.00, status: 'success', time: '2024-05-11 12:05:40', platform: 'android' },
];

export const MOCK_ORDER_STATS: OrderStats = {
  todayOrders: 124,
  todayRevenue: 5842.00,
  refundCount: 3,
  activeUsers: 1520
};
