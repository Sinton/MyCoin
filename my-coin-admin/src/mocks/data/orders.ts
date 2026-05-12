export type Order = {
  key: string;
  id: string;
  user: string;
  product: string;
  productNames?: Record<string, string>;
  amount: number;
  status: 'success' | 'pending' | 'refunded';
  time: string;
  platform: 'apple' | 'android';
}

// ... 保持原有代码不变 ...
export const MOCK_ORDERS: Order[] = [
  { 
    key: '1', 
    id: 'ORD-20260511001', 
    user: '张三 (ID: U88421)', 
    product: 'Pro 连续月包', 
    productNames: { zh_CN: 'Pro 连续月包', zh_TW: 'Pro 連續月包', en_US: 'Pro Monthly', ja_JP: 'Pro 月間プラン' },
    amount: 19.00, 
    status: 'success', 
    time: '2026-05-11 10:30:25', 
    platform: 'apple' 
  },
  { 
    key: '2', 
    id: 'ORD-20260511002', 
    user: '李美丽 (ID: U77210)', 
    product: 'Pro 连续年包', 
    productNames: { zh_CN: 'Pro 连续年包', zh_TW: 'Pro 連續年包', en_US: 'Pro Yearly', ja_JP: 'Pro 年間プラン' },
    amount: 168.00, 
    status: 'pending', 
    time: '2026-05-11 11:15:10', 
    platform: 'android' 
  },
  { 
    key: '3', 
    id: 'ORD-20260511003', 
    user: '王五 (ID: U99215)', 
    product: '终身会员套餐', 
    productNames: { zh_CN: '终身会员套餐', zh_TW: '終身會員套餐', en_US: 'Lifetime Membership', ja_JP: '生涯会員プラン' },
    amount: 398.00, 
    status: 'success', 
    time: '2026-05-11 09:45:00', 
    platform: 'apple' 
  },
  { 
    key: '4', 
    id: 'ORD-20260511004', 
    user: '赵小六 (ID: U11202)', 
    product: 'Pro 连续月包', 
    productNames: { zh_CN: 'Pro 连续月包', zh_TW: 'Pro 連續月包', en_US: 'Pro Monthly', ja_JP: 'Pro 月間プラン' },
    amount: 19.00, 
    status: 'refunded', 
    time: '2026-05-11 08:20:15', 
    platform: 'apple' 
  },
  { 
    key: '5', 
    id: 'ORD-20260511005', 
    user: '钱老七 (ID: U55410)', 
    product: 'Pro 连续月包', 
    productNames: { zh_CN: 'Pro 连续月包', zh_TW: 'Pro 連續月包', en_US: 'Pro Monthly', ja_JP: 'Pro 月間プラン' },
    amount: 19.00, 
    status: 'success', 
    time: '2026-05-11 12:05:40', 
    platform: 'android' 
  },
];

export const MOCK_ORDER_STATS: OrderStats = {
  todayOrders: 124,
  todayRevenue: 5842.00,
  refundCount: 3,
  activeUsers: 1520
};
