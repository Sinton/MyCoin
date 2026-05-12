import React from 'react';
import { Row, Col, Button } from 'antd';
import { 
  CalendarOutlined, ReloadOutlined,
  DashboardOutlined, UserOutlined, 
  LineChartOutlined, PieChartOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import { useDashboard } from './hooks/useDashboard';
import DashboardCharts from './components/DashboardCharts';
import RecentActivityList from './components/RecentActivityList';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { stats, activities, loading, configs, actions } = useDashboard();

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* 顶部标题栏 */}
      <PageHeader 
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
        extra={
          <>
            <Button icon={<CalendarOutlined />}>最近7天</Button>
            <Button 
              type="primary" 
              icon={<ReloadOutlined spin={loading.stats} />} 
              onClick={actions.handleRefresh}
            >
              {t('common.refresh')}
            </Button>
          </>
        }
      />

      {/* 1. 核心指标卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        {[
          { title: t('dashboard.stats.revenue'), value: `¥${stats?.totalRevenue.toLocaleString()}`, change: stats?.totalRevenueChange, icon: <DashboardOutlined />, color: '#1677ff' },
          { title: t('dashboard.stats.users'), value: stats?.activeUsers.toLocaleString(), change: stats?.activeUsersChange, icon: <UserOutlined />, color: '#52c41a' },
          { title: t('dashboard.stats.order_value'), value: `¥${stats?.avgOrderValue}`, change: stats?.avgOrderValueChange, icon: <LineChartOutlined />, color: '#faad14' },
          { title: t('dashboard.stats.health'), value: `${stats?.healthScore}%`, change: stats?.healthScoreChange, icon: <PieChartOutlined />, color: '#722ed1' },
        ].map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <StatCard 
              {...item}
              loading={loading.stats}
            />
          </Col>
        ))}
      </Row>

      {/* 2. 图表区域 */}
      <DashboardCharts 
        areaConfig={configs.area}
        pieConfig={configs.pie}
        isTrendLoading={loading.trend}
        isDistLoading={loading.dist}
        onMoreData={() => actions.navigate('/orders')}
      />

      {/* 3. 最近动态 */}
      <RecentActivityList 
        activities={activities}
        isLoading={loading.activity}
        onMore={() => actions.navigate('/notifications')}
      />
    </div>
  );
};

export default Dashboard;
