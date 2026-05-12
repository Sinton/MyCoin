import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { useConfigStore } from '@/store';
import { getOrders, getOrderStats, updateOrderStatus } from '@/api/orders';
import { type Order } from '@/types';

export const useOrders = () => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const { previewLang } = useConfigStore();
  
  const [activeTab, setActiveTab] = useState('all');
  const [selectedUserKey, setSelectedUserKey] = useState<string | undefined>(undefined);

  // --- 获取列表数据 ---
  const { 
    data: ordersResponse, 
    isLoading: isListLoading, 
    refetch: refetchOrders, 
    isRefetching: isListRefetching 
  } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders
  });

  // --- 获取统计数据 ---
  const { 
    data: statsResponse, 
    isLoading: isStatsLoading, 
    refetch: refetchStats 
  } = useQuery({
    queryKey: ['orderStats'],
    queryFn: getOrderStats
  });

  // --- 更新状态 Mutation ---
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => updateOrderStatus(id, status),
    onSuccess: (res) => {
      message.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orderStats'] });
    },
  });

  const ordersData = ordersResponse?.data || [];
  const stats = statsResponse?.data;

  // --- 衍生数据：用户下拉列表 ---
  const userData = useMemo(() => {
    const userMap = new Map();
    ordersData.forEach(order => {
      if (!userMap.has(order.user)) {
        const idMatch = order.user.match(/\(ID: ([^)]+)\)/);
        userMap.set(order.user, { 
          key: order.user, 
          name: order.user.split(' ')[0], 
          uid: idMatch ? idMatch[1] : 'Unknown'
        });
      }
    });
    return Array.from(userMap.values());
  }, [ordersData]);

  // --- 衍生数据：过滤后的列表 ---
  const filteredData = useMemo(() => {
    // 映射多语言产品名称
    let result = ordersData.map(order => ({
      ...order,
      product: (previewLang === 'master' ? order.product : order.productNames?.[previewLang]) || order.product
    }));

    if (activeTab !== 'all') result = result.filter(item => item.status === activeTab);
    if (selectedUserKey) result = result.filter(item => item.user === selectedUserKey);
    return result;
  }, [ordersData, activeTab, selectedUserKey, previewLang]);

  const refreshAll = () => {
    refetchStats();
    refetchOrders();
  };

  return {
    ordersData,
    filteredData,
    stats,
    userData,
    isListLoading,
    isListRefetching,
    isStatsLoading,
    activeTab,
    setActiveTab,
    selectedUserKey,
    setSelectedUserKey,
    statusMutation,
    refreshAll,
    refetchOrders
  };
};
