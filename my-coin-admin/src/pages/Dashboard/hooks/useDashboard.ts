import { App } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  getDashboardStats, 
  getRevenueTrend, 
  getProductDistribution, 
  getRecentActivity 
} from '@/api/dashboard';

export const useDashboard = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();

  // --- Data Fetching ---
  const { data: statsRes, isLoading: isStatsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats
  });

  const { data: trendRes, isLoading: isTrendLoading } = useQuery({
    queryKey: ['revenueTrend'],
    queryFn: getRevenueTrend
  });

  const { data: distRes, isLoading: isDistLoading } = useQuery({
    queryKey: ['productDist'],
    queryFn: getProductDistribution
  });

  const { data: activityRes, isLoading: isActivityLoading } = useQuery({
    queryKey: ['recentActivity'],
    queryFn: getRecentActivity
  });

  const stats = statsRes?.data;
  const trendData = trendRes?.data || [];
  const distData = distRes?.data || [];
  const activities = activityRes?.data || [];

  const handleRefresh = async () => {
    await refetchStats();
    message.success('仪表盘数据已刷新');
  };

  // --- Chart Configurations ---
  const areaConfig = {
    data: trendData,
    xField: 'date',
    yField: 'value',
    smooth: true,
    height: 280,
    padding: 'auto',
    style: {
      fill: 'linear-gradient(-90deg, white 0%, #1677ff 100%)',
      fillOpacity: 0.2,
    },
    axis: {
      y: { labelFormatter: (v: any) => `¥${v}` }
    },
    tooltip: {
      items: [{ channel: 'y', name: '营收金额', valueFormatter: (v: any) => `¥${v.toLocaleString()}` }],
    },
  };

  const pieConfig = {
    data: distData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.6,
    innerRadius: 0.4,
    height: 280,
    padding: [10, 60, 10, 60],
    label: {
      text: (d: any) => `${d.type}: ${d.value}%`,
      position: 'spider',
      style: {
        fontSize: 12,
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        position: 'bottom',
        layout: { justifyContent: 'center' },
      },
    },
    tooltip: {
      items: [{ channel: 'y', name: '占比', valueFormatter: (v: any) => `${v}%` }],
    },
    annotations: [
      {
        type: 'text',
        style: {
          text: '订阅分布',
          x: '50%',
          y: '50%',
          textAlign: 'center',
          fontSize: 14,
          fill: '#8c8c8c',
        },
      },
    ],
  };

  return {
    stats,
    activities,
    loading: {
      stats: isStatsLoading,
      trend: isTrendLoading,
      dist: isDistLoading,
      activity: isActivityLoading
    },
    configs: {
      area: areaConfig,
      pie: pieConfig
    },
    actions: {
      handleRefresh,
      navigate
    }
  };
};
