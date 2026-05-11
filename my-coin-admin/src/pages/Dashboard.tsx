import React from 'react';
import { 
  Row, Col, Card, Statistic, Typography, Space, 
  List, Badge, Button, Skeleton, App, Tag
} from 'antd';
import { 
  ArrowUpOutlined, ArrowDownOutlined, 
  EllipsisOutlined, ReloadOutlined,
  CalendarOutlined, UserOutlined, 
  DashboardOutlined, LineChartOutlined,
  PieChartOutlined, HistoryOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { Area, Pie } from '@ant-design/charts';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  getDashboardStats, 
  getRevenueTrend, 
  getProductDistribution, 
  getRecentActivity 
} from '../api/dashboard';
import StatCard from '../components/common/StatCard';

const { Title, Text } = Typography;
import PageHeader from '../components/common/PageHeader';

const Dashboard: React.FC = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();

  // --- 获取数据 ---
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

  // 图表配置
  const areaConfig = {
    data: trendData,
    xField: 'date',
    yField: 'value',
    smooth: true,
    height: 280,
    padding: 'auto',
    style: {
      fill: 'linear-gradient(-90deg, white 0%, #1890ff 100%)',
      fillOpacity: 0.2,
    },
    axis: {
      y: { labelFormatter: (v: any) => `¥${v}` }
    },
    tooltip: {
      channel: 'y',
      valueFormatter: (v: any) => `¥${v.toLocaleString()}`,
    },
  };

  const pieConfig = {
    data: distData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.6,
    height: 280,
    label: {
      text: (d: any) => `${d.value}%`,
      position: 'inside',
      style: {
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
      items: [{ channel: 'y', valueFormatter: (v: any) => `${v}%` }],
    },
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* 顶部标题栏 */}
      <PageHeader 
        title="运营概览"
        subtitle="实时监控您的业务核心指标与增长趋势"
        extra={
          <>
            <Button icon={<CalendarOutlined />}>最近7天</Button>
            <Button 
              type="primary" 
              icon={<ReloadOutlined spin={isStatsLoading} />} 
              onClick={handleRefresh}
            >
              同步数据
            </Button>
          </>
        }
      />

      {/* 1. 核心指标卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        {[
          { title: '累计营收', value: `¥${stats?.totalRevenue.toLocaleString()}`, change: stats?.totalRevenueChange, icon: <DashboardOutlined />, color: '#1890ff' },
          { title: '活跃用户', value: stats?.activeUsers.toLocaleString(), change: stats?.activeUsersChange, icon: <UserOutlined />, color: '#52c41a' },
          { title: '客单价 (ARPU)', value: `¥${stats?.avgOrderValue}`, change: stats?.avgOrderValueChange, icon: <LineChartOutlined />, color: '#faad14' },
          { title: '业务健康度', value: `${stats?.healthScore}%`, change: stats?.healthScoreChange, icon: <PieChartOutlined />, color: '#722ed1' },
        ].map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <StatCard 
              {...item}
              loading={isStatsLoading}
            />
          </Col>
        ))}
      </Row>

      {/* 2. 图表区域 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={16}>
          <Card 
            title={<Space><LineChartOutlined /> 7日营收趋势分析</Space>} 
            variant="outlined"
            extra={<Button type="link" onClick={() => navigate('/orders')}>更多数据</Button>}
          >
            {isTrendLoading ? <Skeleton active /> : <Area {...areaConfig} />}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={<Space><PieChartOutlined /> 订阅产品占比</Space>} 
            variant="outlined"
          >
            {isDistLoading ? <Skeleton active /> : <Pie {...pieConfig} />}
          </Card>
        </Col>
      </Row>

      {/* 3. 最近动态 */}
      <Card 
        title={<Space><HistoryOutlined /> 最近系统动态</Space>} 
        variant="outlined"
        extra={<Button type="link" icon={<EllipsisOutlined />} />}
      >
        <List
          loading={isActivityLoading}
          dataSource={activities}
          renderItem={(item) => (
            <List.Item className="border-none py-3">
              <List.Item.Meta
                avatar={
                  <div className={`p-2 rounded-full ${item.type === 'order' ? 'bg-blue-50' : item.type === 'system' ? 'bg-purple-50' : 'bg-green-50'}`}>
                    {item.type === 'order' ? <ShoppingCartOutlined className="text-blue-500" /> : item.type === 'system' ? <DashboardOutlined className="text-purple-500" /> : <UserOutlined className="text-green-500" />}
                  </div>
                }
                title={<span className="text-sm font-medium">{item.title}</span>}
                description={
                  <Space size="middle">
                    <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
                    {item.status && <Badge status={item.status === 'success' ? 'success' : 'error'} text={item.status === 'success' ? '正常' : '异常'} />}
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
