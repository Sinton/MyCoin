import React, { useState, useMemo } from 'react';
import { 
  Table, Tag, Card, Typography, Space, Button, 
  Row, Col, Statistic, Drawer, 
  Tabs, Badge, Divider, App, Skeleton, Empty, Popconfirm
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  ReloadOutlined,
  AppleFilled, AndroidFilled, InfoCircleOutlined,
  ExportOutlined, SyncOutlined,
  ShoppingCartOutlined, TransactionOutlined, RetweetOutlined,
  CheckCircleOutlined, RollbackOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, getOrderStats, updateOrderStatus } from '../api/orders';
import TableSelect from '../components/TableSelect';
import type { Order } from '../types';

const { Text } = Typography;

const Orders: React.FC = () => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  
  // --- 状态逻辑 ---
  const [activeTab, setActiveTab] = useState('all');
  const [selectedUserKey, setSelectedUserKey] = useState<string | undefined>(undefined);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: ordersResponse, isLoading: isListLoading, refetch: refetchOrders, isRefetching: isListRefetching } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders
  });

  const { data: statsResponse, isLoading: isStatsLoading } = useQuery({
    queryKey: ['orderStats'],
    queryFn: getOrderStats
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => updateOrderStatus(id, status),
    onSuccess: (res) => {
      message.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orderStats'] });
      setIsDetailOpen(false);
    },
  });

  const ordersData = ordersResponse?.data || [];
  const stats = statsResponse?.data;

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

  const filteredData = useMemo(() => {
    let result = ordersData;
    if (activeTab !== 'all') result = result.filter(item => item.status === activeTab);
    if (selectedUserKey) result = result.filter(item => item.user === selectedUserKey);
    return result;
  }, [ordersData, activeTab, selectedUserKey]);

  // --- 列配置 (保持之前的紧凑优化) ---
  const columns: ColumnsType<Order> = [
    {
      title: '订单编号',
      dataIndex: 'id',
      key: 'id',
      width: 170,
      render: (text) => <Text strong className="font-mono" style={{ fontSize: 13 }}>{text}</Text>,
    },
    {
      title: '用户信息',
      dataIndex: 'user',
      key: 'user',
      width: 200,
      render: (userStr) => {
        const name = userStr.split(' ')[0];
        const idMatch = userStr.match(/\(ID: ([^)]+)\)/);
        const uid = idMatch ? idMatch[1] : 'Unknown';
        return (
          <div style={{ lineHeight: '1.2' }}>
            <div style={{ marginBottom: 1 }}><Text strong style={{ fontSize: 13 }}>{name}</Text></div>
            <div><Text type="secondary" style={{ fontSize: 11, color: '#999' }}>ID: {uid}</Text></div>
          </div>
        );
      },
    },
    {
      title: '订阅产品',
      dataIndex: 'product',
      key: 'product',
      render: (text) => <Tag color="blue" bordered={false} style={{ margin: 0, fontSize: 12 }}>{text}</Tag>,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <Text strong style={{ fontSize: 13 }}>¥{amount.toFixed(2)}</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = {
          success: { color: 'success', text: '已支付' },
          pending: { color: 'processing', text: '待支付' },
          refunded: { color: 'default', text: '已退款' },
        }[status];
        return <Badge status={config.color as any} text={<span style={{fontSize: 12}}>{config.text}</span>} />;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button type="link" size="small" style={{ padding: 0 }} onClick={() => { setSelectedOrder(record); setIsDetailOpen(true); }}>详情</Button>
      ),
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* 顶部指标卡片 */}
      <div className="mb-6">
        <Row gutter={[16, 16]}>
          {[
            { title: '今日订单', value: stats?.todayOrders, icon: <ShoppingCartOutlined />, color: '#1890ff' },
            { title: '今日营收', value: stats?.todayRevenue, prefix: '¥', color: '#cf1322' },
            { title: '退款笔数', value: stats?.refundCount, color: '#d48806' },
            { title: '活跃用户', value: stats?.activeUsers, color: '#3f8600' }
          ].map((s, idx) => (
            <Col xs={24} sm={12} lg={6} key={idx}>
              <Card variant="outlined" bodyStyle={{ padding: '16px 20px' }}>
                <Statistic title={<span style={{fontSize: 13}}>{s.title}</span>} value={s.value} prefix={s.prefix} valueStyle={{ fontSize: 22, fontWeight: 600, color: s.color }} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Card 
        variant="outlined"
        title={
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            className="mb-[-16px]"
            items={[
              { key: 'all', label: '全部订单' },
              { key: 'success', label: '已完成' },
              { key: 'pending', label: '待支付' },
              { key: 'refunded', label: '退款记录' },
            ]}
          />
        }
        extra={
          <Space>
            <TableSelect 
              placeholder="用户筛选..." 
              value={selectedUserKey}
              onChange={setSelectedUserKey}
              dataSource={userData}
              columns={[{ title: '姓名', dataIndex: 'name' }, { title: 'UID', dataIndex: 'uid' }]}
              rowKey="key"
              dropdownWidth={300}
              optionLabelRender={(record: any) => record.name}
              width={160}
            />
            <Button icon={<ExportOutlined />} size="middle">导出</Button>
            <Button type="primary" icon={<ReloadOutlined spin={isListRefetching} />} onClick={() => refetchOrders()} size="middle">刷新数据</Button>
          </Space>
        }
      >
        <Table columns={columns} dataSource={filteredData} loading={isListLoading} size="middle" pagination={{ pageSize: 10 }} />
      </Card>

      <Drawer
        title={<Space><InfoCircleOutlined className="text-blue-500" /> 业务详情</Space>}
        placement="right"
        width={500}
        onClose={() => setIsDetailOpen(false)}
        open={isDetailOpen}
        footer={
          <div className="flex justify-between items-center py-2 px-1">
            <Button onClick={() => setIsDetailOpen(false)}>返回列表</Button>
            {selectedOrder?.status === 'success' && (
              <Popconfirm title="确认退款？" onConfirm={() => mutation.mutate({ id: selectedOrder.id, status: 'refunded' })}>
                <Button danger type="primary" icon={<RollbackOutlined />}>申请退款</Button>
              </Popconfirm>
            )}
          </div>
        }
      >
        {selectedOrder ? (
          <div className="space-y-8">
            <section>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <Row gutter={24}>
                  <Col span={14}>
                    <Text type="secondary" className="text-xs uppercase tracking-wider">订单编号</Text>
                    <div className="text-base font-mono font-bold mt-1">{selectedOrder.id}</div>
                  </Col>
                  <Col span={10}>
                    <Text type="secondary" className="text-xs uppercase tracking-wider">实付金额</Text>
                    <div className="text-xl font-bold text-red-600 mt-1">¥{selectedOrder.amount.toFixed(2)}</div>
                  </Col>
                </Row>
              </div>
            </section>
            <section className="px-2 space-y-5">
              <div className="flex justify-between items-center"><Text type="secondary">用户姓名</Text><Text strong>{selectedOrder.user.split(' ')[0]}</Text></div>
              <div className="flex justify-between items-center"><Text type="secondary">用户 ID (UID)</Text><Text code>{selectedOrder.user.match(/\(ID: ([^)]+)\)/)?.[1]}</Text></div>
              <div className="flex justify-between items-center"><Text type="secondary">订阅产品</Text><Tag color="blue" bordered={false}>{selectedOrder.product}</Tag></div>
              <div className="flex justify-between items-center"><Text type="secondary">支付状态</Text><Badge status={selectedOrder.status === 'success' ? 'success' : 'default'} text={selectedOrder.status === 'success' ? '已支付' : '已退款'} /></div>
              <div className="flex justify-between items-center"><Text type="secondary">下单时间</Text><Text>{selectedOrder.time}</Text></div>
            </section>
          </div>
        ) : <Empty />}
      </Drawer>
    </div>
  );
};

export default Orders;
