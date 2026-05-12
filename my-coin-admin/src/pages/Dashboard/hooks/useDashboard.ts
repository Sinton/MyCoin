import { App } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '@/store';
import { 
  getDashboardStats, 
  getRevenueTrend, 
  getProductDistribution, 
  getRecentActivity 
} from '@/api/dashboard';

export const useDashboard = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { previewLang } = useConfigStore();

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
  
  // 动态处理图表语言
  const distData = (distRes?.data || []).map(item => ({
    ...item,
    type: (previewLang === 'master' ? item.type : item.names?.[previewLang]) || item.type
  }));

  // 动态处理动态列表语言
  const activities = (activityRes?.data || []).map(item => ({
    ...item,
    title: (previewLang === 'master' ? item.title : item.i18n?.[previewLang]) || item.title
  }));

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
    paddingLeft: 50,
    paddingRight: 30,
    paddingBottom: 50,
    paddingTop: 20,
    style: {
      fill: 'linear-gradient(to bottom, #1677ff 0%, rgba(22, 119, 255, 0) 100%)', // 改为纵向渐变
      fillOpacity: 0.4,
    },
    scale: {
      x: { padding: 0.1 }, // 留出 10% 的呼吸间距
    },
    point: {
      size: 4,
      style: {
        fill: '#ffffff',
        stroke: '#1677ff',
        lineWidth: 2,
      },
    },
    axis: {
      x: {
        labelTransform: 'rotate(45)',
        labelFontSize: 10,
        labelSpacing: 8,
      },
      y: { 
        labelFormatter: (v: any) => `¥${v}`,
        grid: { stroke: '#f0f0f0' }, // 浅灰色网格线
      }
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
