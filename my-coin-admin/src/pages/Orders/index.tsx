import React, { useState } from 'react';
import { 
  Table, Tag, Badge, Card, Typography, Space, Button, 
  Row, Col, Tabs, App
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  ReloadOutlined,
  UserOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
  ExportOutlined,
  StopOutlined
} from '@ant-design/icons';

import { exportToCSV } from '@/utils/csv';
import TableSelect from '@/components/TableSelect';
import StatCard from '@/components/common/StatCard';
import PageHeader from '@/components/common/PageHeader';
import type { Order } from '@/types';

// 引入重构后的 Hook 和 组件
import { useOrders } from './hooks/useOrders';
import OrderDetailDrawer from './components/OrderDetailDrawer';

const { Text } = Typography;

const Orders: React.FC = () => {
  const { message } = App.useApp();
  
  // --- 业务逻辑托管给 Hook ---
  const {
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
  } = useOrders();

  // --- UI 内部状态 ---
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // --- 导出逻辑 ---
  const handleExport = () => {
    if (ordersData.length === 0) {
      message.warning('当前没有可导出的交易数据');
      return;
    }
    message.loading('准备导出文件...', 0.5);
    const headers = {
      id: '订单编号',
      user: '用户信息',
      product: '产品名称',
      amount: '金额 (CNY)',
      status: '订单状态',
      time: '成交时间'
    };
    setTimeout(() => {
      exportToCSV(ordersData, 'MyCoin_Orders_Report', headers);
      message.success('导出成功！');
    }, 600);
  };

  const handleShowDetail = (record: Order) => {
    setSelectedOrder(record);
    setIsDetailOpen(true);
  };

  const handleRefund = (id: string) => {
    statusMutation.mutate({ id, status: 'refunded' }, {
      onSuccess: () => {
        setIsDetailOpen(false);
      }
    });
  };

  // --- 表格列配置 (可以在外部定义，这里保持简洁) ---
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
        }[status as 'success' | 'pending' | 'refunded'];
        return <Badge status={config.color as any} text={<span style={{fontSize: 12}}>{config.text}</span>} />;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button type="link" size="small" style={{ padding: 0 }} onClick={() => handleShowDetail(record)}>详情</Button>
      ),
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader 
        title="订单流水管理"
        subtitle="查看并处理全平台实时交易记录"
        onExport={handleExport}
        extra={
          <Button 
            icon={<ReloadOutlined spin={isStatsLoading} />} 
            onClick={refreshAll}
          >
            刷新数据
          </Button>
        }
      />

      <Row gutter={[16, 16]} className="mb-6">
        {[
          { title: '今日订单', value: stats?.todayOrders, change: 12, icon: <ShoppingCartOutlined />, color: '#1890ff' },
          { title: '今日营收', value: `¥${stats?.todayRevenue?.toLocaleString()}`, change: 8.5, icon: <DashboardOutlined />, color: '#52c41a' },
          { title: '退款订单', value: stats?.refundCount, change: -2, icon: <StopOutlined />, color: '#ff4d4f' },
          { title: '活跃付费用户', value: stats?.activeUsers?.toLocaleString(), change: 5.2, icon: <UserOutlined />, color: '#722ed1' },
        ].map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <StatCard 
              {...item}
              loading={isStatsLoading}
              changeLabel="较昨日"
            />
          </Col>
        ))}
      </Row>

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
            <Button icon={<ExportOutlined />} size="middle" onClick={handleExport}>导出</Button>
            <Button 
              type="primary" 
              icon={<ReloadOutlined spin={isListRefetching} />} 
              onClick={() => refetchOrders()} 
              size="middle"
            >
              刷新数据
            </Button>
          </Space>
        }
      >
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          loading={isListLoading} 
          size="middle" 
          pagination={{ pageSize: 10 }} 
        />
      </Card>

      {/* 详情抽屉组件 */}
      <OrderDetailDrawer 
        open={isDetailOpen}
        order={selectedOrder}
        onClose={() => setIsDetailOpen(false)}
        onRefund={handleRefund}
        refundLoading={statusMutation.isPending}
      />
    </div>
  );
};

export default Orders;
