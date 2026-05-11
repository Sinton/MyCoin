import type { ApiResponse } from '../types';

export interface NotificationItem {
  id: string;
  type: 'order' | 'system' | 'alert';
  title: string;
  content: string;
  time: string;
  read: boolean;
  priority?: 'high' | 'medium' | 'low';
}

// 内存中的实时通知状态
export let LIVE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'order',
    title: '新订单通知',
    content: '用户 Yan 刚刚订阅了 [年度至尊套餐]，金额 ¥1,298.00',
    time: '2分钟前',
    read: false,
    priority: 'high'
  },
  {
    id: '2',
    type: 'alert',
    title: 'Webhook 处理异常',
    content: 'Google Play 回调通知 (ID: evt_982) 重试 3 次均失败，请手动检查。',
    time: '15分钟前',
    read: false,
    priority: 'high'
  },
  {
    id: '3',
    type: 'system',
    title: '系统维护提醒',
    content: 'MyCoin Admin 将于本周日凌晨 02:00 进行数据库性能优化。',
    time: '1小时前',
    read: true,
    priority: 'medium'
  },
  {
    id: '4',
    type: 'order',
    title: '退款申请待处理',
    content: '用户 (ID: 55210) 发起了退款申请，原因：误购。',
    time: '3小时前',
    read: false,
    priority: 'medium'
  },
  {
    id: '5',
    type: 'system',
    title: '新功能上线',
    content: '订阅管理模块现已支持素材库批量编辑功能，快去试试吧！',
    time: '昨天',
    read: true,
    priority: 'low'
  }
];

export const markRead = (id: string) => {
  LIVE_NOTIFICATIONS = LIVE_NOTIFICATIONS.map(n => 
    n.id === id ? { ...n, read: true } : n
  );
};

export const markAllRead = () => {
  LIVE_NOTIFICATIONS = LIVE_NOTIFICATIONS.map(n => ({ ...n, read: true }));
};
