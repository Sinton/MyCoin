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

const { Title, Text } = Typography;

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
    areaStyle: {
      fill: 'l(270) 0:#ffffff 0.5:#1890ff 1:#1890ff',
      fillOpacity: 0.1,
    },
    line: {
      color: '#1890ff',
      size: 2,
    },
    point: {
      size: 4,
      shape: 'circle',
      style: {
        fill: '#fff',
        stroke: '#1890ff',
        lineWidth: 2,
      },
    },
    tooltip: {
      formatter: (datum: any) => ({ name: '营收', value: `¥${datum.value}` }),
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
      type: 'inner',
      offset: '-50%',
      content: '{value}%',
      style: { textAlign: 'center', fontSize: 14 },
    },
    interactions: [{ type: 'element-active' }],
    legend: { position: 'bottom' as const },
    tooltip: {
      formatter: (datum: any) => ({ name: datum.type, value: `${datum.value}%` }),
    },
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* 顶部标题栏 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Title level={2} style={{ marginBottom: 4 }}>运营概览</Title>
          <Text type="secondary">实时监控您的业务核心指标与增长趋势</Text>
        </div>
        <Space>
          <Button icon={<CalendarOutlined />}>最近7天</Button>
          <Button 
            type="primary" 
            icon={<ReloadOutlined spin={isStatsLoading} />} 
            onClick={handleRefresh}
          >
            同步数据
          </Button>
        </Space>
      </div>

      {/* 1. 核心指标卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        {[
          { title: '累计营收', value: `¥${stats?.totalRevenue.toLocaleString()}`, change: stats?.totalRevenueChange, icon: <DashboardOutlined />, color: '#1890ff' },
          { title: '活跃用户', value: stats?.activeUsers.toLocaleString(), change: stats?.activeUsersChange, icon: <UserOutlined />, color: '#52c41a' },
          { title: '客单价 (ARPU)', value: `¥${stats?.avgOrderValue}`, change: stats?.avgOrderValueChange, icon: <LineChartOutlined />, color: '#faad14' },
          { title: '业务健康度', value: `${stats?.healthScore}%`, change: stats?.healthScoreChange, icon: <PieChartOutlined />, color: '#722ed1' },
        ].map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card variant="outlined" hoverable>
              {isStatsLoading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
                <div className="flex items-start justify-between">
                  <div>
                    <Text type="secondary" style={{ fontSize: 14 }}>{item.title}</Text>
                    <div className="text-2xl font-bold mt-2">{item.value}</div>
                    <div className="mt-2">
                      <Tag color={(item.change || 0) >= 0 ? 'success' : 'error'} bordered={false}>
                        {(item.change || 0) >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        <span className="ml-1">{Math.abs(item.change || 0)}%</span>
                      </Tag>
                      <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>较上周</Text>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: `${item.color}10`, color: item.color }}>
                    {React.cloneElement(item.icon as React.ReactElement, { style: { fontSize: 24 } })}
                  </div>
                </div>
              )}
            </Card>
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
