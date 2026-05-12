import { request } from '@/utils/request';
import type { ApiResponse } from '@/types';
import type { NotificationItem } from '@/mocks/data/notifications';

export const getNotifications = (): Promise<ApiResponse<NotificationItem[]>> => {
  return request({ url: '/notifications', method: 'GET' });
};

export const markNotificationRead = (id: string): Promise<ApiResponse<null>> => {
  return request({ 
    url: `/notifications/${id}/read`, 
    method: 'PUT' 
  });
};

export const markAllNotificationsRead = (): Promise<ApiResponse<null>> => {
  return request({ 
    url: '/notifications/read-all', 
    method: 'PUT' 
  });
};
