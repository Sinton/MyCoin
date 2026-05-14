import type { ApiResponse } from '@/types';

export interface NotificationItem {
  id: string;
  type: 'order' | 'system' | 'alert';
  title: string;
  content: string;
  titles?: Record<string, string>;
  contents?: Record<string, string>;
  times?: Record<string, string>;
  timestamp: number;
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
    titles: {
      en_US: 'New Order Received',
      zh_TW: '新訂單通知',
      ja_JP: '新規注文通知',
      ko_KR: '새 주문 알림'
    },
    contents: {
      en_US: 'User Yan just subscribed to [Annual Premium], amount $199.00',
      zh_TW: '用戶 Yan 剛剛訂閱了 [年度至尊套餐]，金額 ¥1,298.00',
      ja_JP: 'ユーザー Yan が [年間プレミアム] を購読しました、金額 ¥199.00',
      ko_KR: '사용자 Yan 님이 [연간 프리미엄]을 구독했습니다, 금액 ₩1,298,000'
    },
    times: {
      zh_CN: '2分钟前',
      zh_TW: '2分鐘前',
      en_US: '2m ago',
      ja_JP: '2分前',
      ko_KR: '2분 전'
    },
    timestamp: 1778568600000, 
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
      zh_TW: 'Webhook 處理異常',
      ja_JP: 'Webhook 処理異常',
      ko_KR: 'Webhook 처리 오류'
    },
    contents: {
      en_US: 'Google Play callback (ID: evt_982) failed after 3 retries. Manual check required.',
      zh_TW: 'Google Play 回調通知 (ID: evt_982) 重試 3 次均失敗，請手動檢查。',
      ja_JP: 'Google Play のコールバック (ID: evt_982) が 3 回の再試行後に失敗しました。',
      ko_KR: 'Google Play 콜백(ID: evt_982)이 3회 재시도 후에도 실패했습니다. 수동 확인이 필요합니다.'
    },
    times: {
      zh_CN: '15分钟前',
      zh_TW: '15分鐘前',
      en_US: '15m ago',
      ja_JP: '15分前',
      ko_KR: '15분 전'
    },
    timestamp: 1778567400000,
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
      zh_TW: '系統維護提醒',
      ja_JP: 'システムメンテナンス',
      ko_KR: '시스템 점검 안내'
    },
    contents: {
      en_US: 'MyCoin Admin will perform database optimization this Sunday at 02:00 AM.',
      zh_TW: 'MyCoin Admin 將於本週日凌晨 02:00 進行資料庫性能優化。',
      ja_JP: 'MyCoin Admin は今週日曜日の午前 02:00 にデータベースの最適化を行います。',
      ko_KR: 'MyCoin Admin은 이번 주 일요일 오전 02:00에 데이터베이스 최적화 작업을 진행합니다.'
    },
    times: {
      zh_CN: '1小时前',
      zh_TW: '1小時前',
      en_US: '1h ago',
      ja_JP: '1時間前',
      ko_KR: '1시간 전'
    },
    timestamp: 1778563800000,
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
