import type { ApiResponse } from '../types';
import type { NotificationItem } from '../mock/notifications';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 获取通知列表
 */
export const getNotifications = async (): Promise<ApiResponse<NotificationItem[]>> => {
  await sleep(400);
  const { LIVE_NOTIFICATIONS } = await import('../mock/notifications');
  return { code: 200, data: [...LIVE_NOTIFICATIONS], message: 'success' };
};

/**
 * 标记单条通知为已读
 */
export const markNotificationRead = async (id: string): Promise<ApiResponse<null>> => {
  await sleep(200);
  const { markRead } = await import('../mock/notifications');
  markRead(id);
  return { code: 200, data: null, message: 'success' };
};

/**
 * 全部标记为已读
 */
export const markAllNotificationsRead = async (): Promise<ApiResponse<null>> => {
  await sleep(300);
  const { markAllRead } = await import('../mock/notifications');
  markAllRead();
  return { code: 200, data: null, message: 'success' };
};
