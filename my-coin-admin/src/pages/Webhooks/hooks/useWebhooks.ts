import { useState } from 'react';
import { App } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getWebhookLogs, getWebhookStats } from '@/api/webhooks';
import { exportToCSV } from '@/utils/csv';
import type { WebhookLog } from '@/types';

export const useWebhooks = () => {
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
    message.loading('正在导出 Webhook 日志...', 0.5);
    const headers = {
      id: '通知 ID',
      event: '事件类型',
      product: '产品标识',
      status: '处理状态',
      latency: '响应耗时(ms)',
      time: '接收时间'
    };
    setTimeout(() => {
      exportToCSV(logsData, 'MyCoin_Webhook_Logs', headers);
      message.success('日志导出成功');
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
    message.success('内容已复制到剪贴板');
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
