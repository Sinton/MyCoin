import { useState } from 'react';
import { App } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getWebhookLogs, getWebhookStats } from '@/api/webhooks';
import { exportToCSV } from '@/utils/csv';
import type { WebhookLog } from '@/types';

export const useWebhooks = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');

  // --- Data Fetching ---
  const { 
    data: logsRes, 
    isLoading: isLogsLoading, 
    refetch: refetchLogs,
    isRefetching: isLogsRefetching 
  } = useQuery({
    queryKey: ['webhookLogs'],
    queryFn: getWebhookLogs
  });

  const { data: statsRes, isLoading: isStatsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['webhookStats'],
    queryFn: getWebhookStats
  });

  const logsData = logsRes?.data || [];
  const stats = statsRes?.data;

  // --- Export Logic ---
  const handleExport = () => {
    if (logsData.length === 0) return;
    message.loading(t('orders.export.preparing'), 0.5);
    const headers = {
      id: t('webhooks.columns.id'),
      event: t('webhooks.columns.event'),
      product: t('webhooks.columns.product'),
      status: t('webhooks.columns.status'),
      latency: t('webhooks.columns.latency'),
      time: t('webhooks.columns.time')
    };
    setTimeout(() => {
      exportToCSV(logsData, 'MyCoin_Webhook_Logs', headers);
      message.success(t('orders.export.success'));
    }, 600);
  };

  // --- Filtering Logic ---
  const filteredData = logsData.filter(log => {
    const matchTab = activeTab === 'all' || (activeTab === 'success' && log.status === 'success') || (activeTab === 'failed' && log.status === 'failed');
    const matchSearch = log.id.toLowerCase().includes(searchText.toLowerCase()) || log.product.includes(searchText);
    return matchTab && matchSearch;
  });

  const showDetails = (log: WebhookLog) => {
    setSelectedLog(log);
    setDrawerOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success(t('common.copy_success'));
  };

  return {
    stats,
    filteredData,
    loading: {
      logs: isLogsLoading,
      logsRefetching: isLogsRefetching,
      stats: isStatsLoading
    },
    filter: {
      activeTab,
      setActiveTab,
      searchText,
      setSearchText
    },
    drawer: {
      open: drawerOpen,
      setOpen: setDrawerOpen,
      selectedLog
    },
    actions: {
      handleExport,
      refetchLogs,
      refetchStats,
      showDetails,
      copyToClipboard
    }
  };
};
