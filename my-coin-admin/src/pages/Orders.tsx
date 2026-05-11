import React, { useState, useMemo } from 'react';
import { 
  Table, Tag, Space, Button, Card, Drawer, 
  Descriptions, Typography, App, Popconfirm,
  Row, Col, Statistic, Tabs, Badge, Tooltip, Divider
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  ReloadOutlined,
  AppleFilled, AndroidFilled, InfoCircleOutlined,
  ExportOutlined, SyncOutlined,
  ShoppingCartOutlined, TransactionOutlined, RetweetOutlined
} from '@ant-design/icons';
import TableSelect from '../components/TableSelect';

const { Text } = Typography;

interface DataType {
  key: string;
  orderId: string;
  userId: string;
  userName: string;
  productName: string;
  amount: number;
  status: 'success' | 'failed' | 'refunded';
  platform: 'apple' | 'google';
  date: string;
}

const mockUsers = [
  { id: 'U001', name: '张晓明' },
  { id: 'U002', name: '李美丽' },
  { id: 'U003', name: '赵大炮' },
  { id: 'U004', name: '钱小二' },
  { id: 'U005', name: '王老五' },
];

const OrderContent: React.FC = () => {
  const { message } = App.useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DataType | null>(null);
  const [searchUserId, setSearchUserId] = useState<string | undefined>(undefined);
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [reissuingKey, setReissuingKey] = useState<string | null>(null);
  
  const rawData: DataType[] = useMemo(() => [
    { key: '1', orderId: 'ORD_20260511_01', userId: 'U001', userName: '张晓明', productName: 'Pro 连续月包', amount: 19.0, status: 'success', platform: 'apple', date: '2026-05-11 13:45:22' },
    { key: '2', orderId: 'ORD_20260511_02', userId: 'U002', userName: '李美丽', productName: 'Plus 年度会员', amount: 198.0, status: 'success', platform: 'google', date: '2026-05-11 13:40:10' },
    { key: '3', orderId: 'ORD_20260511_03', userId: 'U003', userName: '赵大炮', productName: 'Pro 连续月包', amount: 19.0, status: 'refunded', platform: 'apple', date: '2026-05-10 12:20:00' },
    { key: '4', orderId: 'ORD_20260511_04', userId: 'U004', userName: '钱小二', productName: 'Pro 连续月包', amount: 19.0, status: 'success', platform: 'apple', date: '2026-05-10 11:15:00' },
    { key: '5', orderId: 'ORD_20260511_05', userId: 'U005', userName: '王老五', productName: 'Lifetime 终身会员', amount: 398.0, status: 'success', platform: 'google', date: '2026-05-10 09:30:00' },
  ], []);

  const filteredData = useMemo(() => {
    let result = rawData;
    if (searchUserId) result = result.filter(item => item.userId === searchUserId);
    if (activeStatus !== 'all') result = result.filter(item => item.status === activeStatus);
    return result;
  }, [rawData, searchUserId, activeStatus]);

  const handleReissue = (record: DataType) => {
    setReissuingKey(record.key);
    const key = 'reissue';
    message.loading({ content: `正在为 ${record.userName} 补发权益...`, key, duration: 0 });
    setTimeout(() => {
      setReissuingKey(null);
      message.success({ content: `订单 ${record.orderId} 补发成功！`, key, duration: 2 });
    }, 1500);
  };

  const showDetails = (record: DataType) => {
    setSelectedOrder(record);
    setDrawerOpen(true);
  };

  const columns: ColumnsType<DataType> = [
    { 
      title: '订单信息', 
      key: 'orderInfo',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 13 }}>{record.orderId}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.date}</Text>
        </Space>
      )
    },
    { 
      title: '用户信息', 
      key: 'userInfo',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.userName}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.userId}</Text>
        </Space>
      )
    },
    { 
      title: '产品套餐', 
      dataIndex: 'productName', 
      key: 'productName',
      render: (text) => <Tag bordered={false} color="blue">{text}</Tag>
    },
    {
      title: '来源',
      dataIndex: 'platform',
      key: 'platform',
      render: (platform) => (
        <Tooltip title={platform === 'apple' ? 'App Store' : 'Google Play'}>
          {platform === 'apple' ? <AppleFilled style={{ fontSize: 18 }} /> : <AndroidFilled style={{ color: '#3DDC84', fontSize: 18 }} />}
        </Tooltip>
      )
    },
    { 
      title: '实付金额', 
      dataIndex: 'amount', 
      key: 'amount', 
      align: 'right',
      render: (val) => (
        <Text strong style={{ color: '#f5222d', fontSize: 15 }}>
          ¥{val.toFixed(2)}
        </Text>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = {
          success: { color: 'success', text: '支付成功', icon: <Badge status="success" /> },
          failed: { color: 'error', text: '支付失败', icon: <Badge status="error" /> },
          refunded: { color: 'warning', text: '已退款', icon: <Badge status="warning" /> }
        };
        const item = config[status] || config.failed;
        return <Space size={4}>{item.icon}<Text style={{ fontSize: 13 }}>{item.text}</Text></Space>;
      },
    },
    { 
      title: '操作', 
      key: 'action', 
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="text" size="small" onClick={() => showDetails(record)}>详情</Button>
          <Divider type="vertical" />
          <Popconfirm
            title="权益补发确认"
            description={`确定要为用户 ${record.userName} 补发权益吗？`}
            onConfirm={() => handleReissue(record)}
          >
            <Button 
              type="text" 
              size="small" 
              danger 
              loading={reissuingKey === record.key}
              icon={<SyncOutlined spin={reissuingKey === record.key} />}
            >
              补发
            </Button>
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto p-4">
      {/* 核心指标看板 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} lg={6}>
          <Card bordered>
            <Statistic 
              title={<Space><ShoppingCartOutlined /> 今日订单</Space>} 
              value={12} 
              suffix="单" 
            />
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card bordered>
            <Statistic 
              title={<Space><TransactionOutlined /> 今日营收</Space>} 
              value={1284.5} 
              precision={2}
              prefix="¥" 
            />
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card bordered>
            <Statistic 
              title={<Space><RetweetOutlined /> 退款笔数</Space>} 
              value={1} 
            />
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card bordered>
            <Statistic 
              title={<Space><InfoCircleOutlined /> 异常订单</Space>} 
              value={0} 
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索与筛选 */}
      <Card bordered className="mb-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <Tabs 
            activeKey={activeStatus} 
            onChange={setActiveStatus}
            className="flex-1"
            items={[
              { label: '全部订单', key: 'all' },
              { label: '已支付', key: 'success' },
              { label: '已退款', key: 'refunded' },
              { label: '已失败', key: 'failed' },
            ]}
          />
          <Space wrap>
            <TableSelect
              placeholder="按用户筛选"
              value={searchUserId}
              onChange={setSearchUserId}
              columns={[
                { title: '用户ID', dataIndex: 'id', key: 'id', width: 100 },
                { title: '用户名', dataIndex: 'name', key: 'name' },
              ]}
              dataSource={mockUsers}
              rowKey="id"
              optionLabelRender={(u) => u.name}
              width={180}
            />
            <Button icon={<ReloadOutlined />} onClick={() => { setSearchUserId(undefined); setActiveStatus('all'); }}>重置</Button>
            <Button type="primary" icon={<ExportOutlined />}>导出数据</Button>
          </Space>
        </div>
      </Card>

      {/* 列表数据 - 移除强制横向滚动 */}
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        pagination={{ 
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条订单`,
          showSizeChanger: true
        }} 
        size="middle"
      />

      {/* 订单详情抽屉 */}
      <Drawer
        title="订单详情"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={500}
        extra={
          <Space>
            <Button onClick={() => setDrawerOpen(false)}>关闭</Button>
            <Button type="primary" danger icon={<SyncOutlined />}>补发权益</Button>
          </Space>
        }
      >
        {selectedOrder && (
          <div className="space-y-8">
            <Descriptions title="基本信息" bordered column={1} size="small">
              <Descriptions.Item label="订单流水">{selectedOrder.orderId}</Descriptions.Item>
              <Descriptions.Item label="下单日期">{selectedOrder.date}</Descriptions.Item>
              <Descriptions.Item label="支付平台">
                {selectedOrder.platform === 'apple' ? 'Apple App Store' : 'Google Play Store'}
              </Descriptions.Item>
              <Descriptions.Item label="订单金额">¥{selectedOrder.amount.toFixed(2)}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="用户信息" bordered column={1} size="small">
              <Descriptions.Item label="用户名">{selectedOrder.userName}</Descriptions.Item>
              <Descriptions.Item label="用户ID">{selectedOrder.userId}</Descriptions.Item>
              <Descriptions.Item label="电子邮箱">{selectedOrder.userName.toLowerCase()}@example.com</Descriptions.Item>
            </Descriptions>

            <Descriptions title="商品信息" bordered column={1} size="small">
              <Descriptions.Item label="商品名称">{selectedOrder.productName}</Descriptions.Item>
              <Descriptions.Item label="购买数量">1</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>
    </div>
  );
};

const Orders: React.FC = () => (
  <App>
    <OrderContent />
  </App>
);

export default Orders;
