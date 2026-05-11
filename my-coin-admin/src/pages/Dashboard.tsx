import React from 'react';
import { 
  Row, Col, Card, Statistic, Typography, Space, List, Tag, Badge, Divider, Button, App
} from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  UserOutlined, 
  LineChartOutlined,
  TransactionOutlined,
  ShoppingOutlined,
  SafetyOutlined,
  HistoryOutlined,
  BarChartOutlined,
  HistoryOutlined as HistoryIcon
} from '@ant-design/icons';
import { Area, Pie } from '@ant-design/charts';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // 1. 营收趋势数据
  const revenueData = [
    { date: '05-05', value: 3800 },
    { date: '05-06', value: 5200 },
    { date: '05-07', value: 6100 },
    { date: '05-08', value: 4500 },
    { date: '05-09', value: 5800 },
    { date: '05-10', value: 8900 },
    { date: '05-11', value: 10200 },
  ];

  // 2. 产品分布数据
  const productDistribution = [
    { type: 'Pro 连续月包', value: 45 },
    { type: 'Pro 连续年包', value: 30 },
    { type: '终身会员套餐', value: 15 },
    { type: '其他', value: 10 },
  ];

  // 图表配置
  const areaConfig = {
    data: revenueData,
    xField: 'date',
    yField: 'value',
    style: {
      fill: 'linear-gradient(to bottom, #1890ff, rgba(24, 144, 255, 0.1))',
      fillOpacity: 0.6,
    },
  };

  const pieConfig = {
    data: productDistribution,
    angleField: 'value',
    colorField: 'type',
    radius: 0.7,
    label: { 
      text: (d: any) => `${d.value}%`, 
      position: 'outside' 
    },
    tooltip: {
      items: [
        (d: any) => ({ name: '占比', value: `${d.value}%` })
      ]
    },
    legend: { color: { position: 'bottom', layout: { justifyContent: 'center' } } },
  };

  const recentOrders = [
    { id: 'ORD_001', user: '张晓明', amount: 19, status: 'success', time: '1分钟前' },
    { id: 'ORD_002', user: '李美丽', amount: 198, status: 'success', time: '5分钟前' },
    { id: 'ORD_003', user: '赵大炮', amount: 19, status: 'refunded', time: '12分钟前' },
    { id: 'ORD_004', user: '钱小二', amount: 398, status: 'success', time: '25分钟前' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <Title level={3} style={{ margin: 0 }}>数据仪表盘</Title>
          <Text type="secondary">监测实时营收趋势与核心业务指标</Text>
        </div>
        <Button icon={<HistoryIcon />} onClick={() => window.location.reload()}>刷新</Button>
      </div>

      {/* 核心指标 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined">
            <Statistic title={<Space><TransactionOutlined /> 总收入</Space>} value={168420} prefix="¥" valueStyle={{ fontWeight: 800 }} />
            <div className="mt-2"><Tag color="success" icon={<ArrowUpOutlined />}>12.5%</Tag></div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined">
            <Statistic title={<Space><UserOutlined /> 活跃订阅</Space>} value={3219} suffix="人" valueStyle={{ color: '#52c41a', fontWeight: 800 }} />
            <div className="mt-2"><Tag color="success" icon={<ArrowUpOutlined />}>5.2%</Tag></div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined">
            <Statistic title={<Space><ShoppingOutlined /> 平均客单价</Space>} value={52.4} prefix="¥" valueStyle={{ fontWeight: 800 }} />
            <div className="mt-2"><Tag color="error" icon={<ArrowDownOutlined />}>1.8%</Tag></div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined">
            <Statistic title={<Space><SafetyOutlined /> 系统状态</Space>} value={100} suffix="%" valueStyle={{ color: '#1677ff', fontWeight: 800 }} />
            <div className="mt-2"><Badge status="processing" text="服务正常" /></div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title={<Space><LineChartOutlined /> 营收趋势 (7日)</Space>} variant="outlined" extra={<Button type="link" onClick={() => navigate('/orders')}>更多</Button>}>
            <div className="h-[320px]"><Area {...areaConfig} /></div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={<Space><BarChartOutlined /> 订阅产品占比</Space>} variant="outlined">
            <div className="h-[320px]"><Pie {...pieConfig} /></div>
          </Card>
        </Col>
      </Row>

      {/* 动态流水卡片直接紧跟趋势图 */}
      <Card title={<Space><HistoryOutlined /> 最近动态流水</Space>} variant="outlined" extra={<Button type="link" onClick={() => navigate('/orders')}>全部订单</Button>}>
        <List
          dataSource={recentOrders}
          renderItem={(item) => (
            <List.Item extra={<Text type="secondary">{item.time}</Text>}>
              <List.Item.Meta
                avatar={<div className={`w-10 h-10 rounded flex items-center justify-center ${item.status === 'success' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}><ShoppingOutlined /></div>}
                title={<Space><Text strong>{item.user}</Text><Text type="secondary">订阅了 {item.amount > 300 ? '终身会员套餐' : (item.amount > 100 ? 'Pro 连续年包' : 'Pro 连续月包')}</Text></Space>}
                description={<Space split={<Divider type="vertical" />}><Text type="secondary">{item.id}</Text><Text strong type="danger">¥{item.amount}</Text><Badge status={item.status === 'success' ? 'success' : 'warning'} text={item.status === 'success' ? '支付成功' : '已退款'} /></Space>}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

const DashboardContainer: React.FC = () => (
  <App>
    <Dashboard />
  </App>
);

export default DashboardContainer;
