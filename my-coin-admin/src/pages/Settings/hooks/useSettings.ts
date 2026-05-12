import React, { useState, useEffect } from 'react';
import { App } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSettings, updateSettings, resetWebhookSecret } from '@/api/settings';

export const useSettings = () => {
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
      message.success('配置已成功保存并实时生效');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    }
  });

  const resetSecretMutation = useMutation({
    mutationFn: resetWebhookSecret,
    onSuccess: (res) => {
      message.success('密钥重置成功');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    }
  });

  const handleResetSecret = () => {
    modal.confirm({
      title: '重置 Webhook 密钥？',
      content: '重置后，现有的 Webhook 验证将失效，您需要同步更新生产环境的验证逻辑。',
      okText: '确定重置',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => resetSecretMutation.mutate()
    });
  };

  const handleSave = () => {
    saveMutation.mutate(localSettings);
  };

  const handleCancel = () => {
    setLocalSettings(JSON.parse(JSON.stringify(settings)));
    message.info('修改已取消');
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
        message.success('密钥已复制');
      }
    }
  };
};
