import { request } from '@/utils/request';
import type { ApiResponse } from '@/types';
import type { SystemSettings } from '@/mocks/data/settings';

export const getSettings = (): Promise<ApiResponse<SystemSettings>> => {
  return request({ url: '/settings', method: 'GET' });
};

export const updateSettings = (data: Partial<SystemSettings>): Promise<ApiResponse<null>> => {
  return request({ url: '/settings', method: 'PUT', data });
};

export const resetWebhookSecret = (): Promise<ApiResponse<{ newSecret: string }>> => {
  return request({ url: '/settings/reset-secret', method: 'POST' });
};
