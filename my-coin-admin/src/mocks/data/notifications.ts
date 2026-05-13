import type { ApiResponse } from '@/types';

export interface NotificationItem {
  id: string;
  type: 'order' | 'system' | 'alert';
  title: string;
  content: string;
  titles?: Record<string, string>;
  contents?: Record<string, string>;
  timestamp: number;
  read: boolean;
  priority?: 'high' | 'medium' | 'low';
}

// 内存中的实时通知状态
// 基于当前时间 2026-05-12T12:30:00 左右设置的固定值
export let LIVE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'order',
    title: '新订单通知',
    content: '用户 Yan 刚刚订阅了 [年度至尊套餐]，金额 ¥1,298.00',
    titles: {
      en_US: 'New Order Received',
      ja_JP: '新規注文通知'
    },
    contents: {
      en_US: 'User Yan just subscribed to [Annual Premium], amount $199.00',
      ja_JP: 'ユーザー Yan が [年間プレミアム] を購読しました、金額 ¥199.00'
    },
    timestamp: 1778568600000, // 2026-05-12 12:10:00
    read: false,
    priority: 'high'
  },
  {
    id: '2',
    type: 'alert',
    title: 'Webhook 处理异常',
    content: 'Google Play 回调通知 (ID: evt_982) 重试 3 次均失败，请手动检查。',
    titles: {
      en_US: 'Webhook Processing Error',
      ja_JP: 'Webhook 処理異常'
    },
    contents: {
      en_US: 'Google Play callback (ID: evt_982) failed after 3 retries. Manual check required.',
      ja_JP: 'Google Play のコールバック (ID: evt_982) が 3 回の再試行後に失败しました。'
    },
    timestamp: 1778567400000, // 2026-05-12 11:50:00
    read: false,
    priority: 'high'
  },
  {
    id: '3',
    type: 'system',
    title: '系统维护提醒',
    content: 'MyCoin Admin 将于本周日凌晨 02:00 进行数据库性能优化。',
    titles: {
      en_US: 'System Maintenance',
      ja_JP: 'システムメンテナンス'
    },
    contents: {
      en_US: 'MyCoin Admin will perform database optimization this Sunday at 02:00 AM.',
      ja_JP: 'MyCoin Admin は今週日曜日の午前 02:00 にデータベースの最適化を行います。'
    },
    timestamp: 1778563800000, // 2026-05-12 10:50:00
    read: true,
    priority: 'medium'
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
