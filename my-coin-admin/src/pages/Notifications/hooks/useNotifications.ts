import { useState } from 'react';
import { App } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { 
  getNotifications, 
  markNotificationRead, 
  markAllNotificationsRead 
} from '@/api/notifications';

export const useNotifications = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');

  // --- Data Fetching ---
  const { data: res, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });

  const notifications = res?.data || [];

  // --- Filtering ---
  const filteredData = notifications.filter(n => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'order') return n.type === 'order';
    if (activeTab === 'system') return n.type === 'system';
    if (activeTab === 'alert') return n.type === 'alert';
    return true;
  });

  // --- Actions ---
  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      message.success(t('common.copy_success'));
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  return {
    notifications,
    filteredData,
    isLoading,
    activeTab,
    setActiveTab,
    actions: {
      markRead: (id: string) => markReadMutation.mutate(id),
      markAllRead: () => markAllReadMutation.mutate(),
      isAllRead: !notifications.some(n => !n.read)
    }
  };
};
