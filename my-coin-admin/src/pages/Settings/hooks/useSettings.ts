import React, { useState, useEffect } from 'react';
import { App } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getSettings, updateSettings, resetWebhookSecret } from '@/api/settings';

export const useSettings = () => {
  const { t } = useTranslation();
  const { message, modal } = App.useApp();
  const queryClient = useQueryClient();

  // --- Data Fetching ---
  const { data: res, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings
  });

  const [localSettings, setLocalSettings] = useState<any>(null);

  useEffect(() => {
    if (res?.data) {
      // 初始化时进行深拷贝，确保 localSettings 与原始数据引用完全隔离
      setLocalSettings(JSON.parse(JSON.stringify(res.data)));
    }
  }, [res?.data]);

  const settings = res?.data;
  const isDirty = localSettings && settings ? JSON.stringify(localSettings) !== JSON.stringify(settings) : false;

  // --- Mutations ---
  const saveMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      message.success(t('settings.messages.save_success'));
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    }
  });

  const resetSecretMutation = useMutation({
    mutationFn: resetWebhookSecret,
    onSuccess: () => {
      message.success(t('settings.messages.reset_secret_success'));
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    }
  });

  const handleResetSecret = () => {
    modal.confirm({
      title: t('settings.reset_confirm.title'),
      content: t('settings.reset_confirm.content'),
      okText: t('common.confirm'),
      okType: 'danger',
      cancelText: t('common.cancel'),
      onOk: () => resetSecretMutation.mutate()
    });
  };

  const handleSave = () => {
    saveMutation.mutate(localSettings);
  };

  const handleCancel = () => {
    setLocalSettings(JSON.parse(JSON.stringify(settings)));
    message.info(t('settings.messages.cancel_info'));
  };

  const updateLocalSettings = (path: string, value: any) => {
    setLocalSettings((prev: any) => {
      const next = JSON.parse(JSON.stringify(prev)); // 每次修改都进行深拷贝
      const parts = path.split('.');
      let current = next;
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return next;
    });
  };

  return {
    settings: localSettings,
    isLoading,
    isSaving: saveMutation.isPending,
    isDirty,
    actions: {
      handleSave,
      handleCancel,
      handleResetSecret,
      updateLocalSettings,
      copySecret: (text: string) => {
        navigator.clipboard.writeText(text);
        message.success(t('settings.messages.copy_secret'));
      }
    }
  };
};
