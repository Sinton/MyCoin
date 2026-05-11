import React, { useState } from 'react';
import { 
  Table, Tag, Card, Typography, Space, Button, 
  Row, Col, Statistic, Tooltip, App, 
  Skeleton, Empty, Popconfirm, Badge
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  PlusOutlined, ReloadOutlined, 
  GlobalOutlined, EditOutlined,
  ShoppingOutlined, TeamOutlined, FundOutlined,
  EyeOutlined, EyeInvisibleOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, getProductStats, updateProductStatus } from '../../api/products';
import ProductEditModal from './ProductEditModal';
import ProductLocalizationModal from './ProductLocalizationModal';
import type { Product, ProductStatus } from '../../types';

const { Title, Text } = Typography;

const Products: React.FC = () => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // --- 使用 React Query 获取数据 ---
  const { 
    data: productsRes, 
    isLoading: isProductsLoading, 
    refetch: refetchProducts,
    isRefetching: isProductsRefetching 
  } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  const { data: statsRes, isLoading: isStatsLoading } = useQuery({
    queryKey: ['productStats'],
    queryFn: getProductStats
  });

  // --- 状态变更 Mutation ---
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: ProductStatus }) => updateProductStatus(id, status),
    onSuccess: (res) => {
      message.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const products = productsRes?.data || [];
  const stats = statsRes?.data;

  const handleEdit = (record: Product) => {
    setEditingProduct(record);
    setIsEditModalOpen(true);
  };

  const handleLocalization = (record: Product) => {
    setEditingProduct(record);
    setIsLocModalOpen(true);
  };

  const columns: ColumnsType<Product> = [
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex flex-col">
          <Text strong style={{ fontSize: 13 }}>{text}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>ID: {record.id}</Text>
        </div>
      ),
    },
    {
      title: '类型/周期',
      key: 'type',
      render: (_, record) => (
        <Space size="small">
          <Tag color="cyan" bordered={false} style={{fontSize: 11}}>{record.type === 'subscription' ? '订阅型' : '一次性'}</Tag>
          {record.interval && <Tag color="purple" bordered={false} style={{fontSize: 11}}>{record.interval === 'month' ? '按月' : '按年'}</Tag>}
        </Space>
      ),
    },
    {
      title: '默认定价 (CNY)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <Text strong style={{ fontSize: 13 }}>¥{price.toFixed(2)}</Text>,
    },
    {
      title: '内购 ID (Store IDs)',
      key: 'storeIds',
      render: (_, record) => (
        <div style={{ lineHeight: 1.4 }}>
          <div><Badge status="processing" /><Text type="secondary" style={{ fontSize: 11 }}>Apple: {record.appleId}</Text></div>
          <div><Badge status="warning" /><Text type="secondary" style={{ fontSize: 11 }}>Google: {record.googleId}</Text></div>
        </div>
      ),
    },
    {
      title: '当前状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge status={status === 'active' ? 'success' : 'default'} text={status === 'active' ? '上架中' : '已下架'} />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="编辑配置"><Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} /></Tooltip>
          <Tooltip title="多语言定价"><Button type="text" icon={<GlobalOutlined />} onClick={() => handleLocalization(record)} /></Tooltip>
          <Popconfirm 
            title={record.status === 'active' ? "下架产品？" : "上架产品？"}
            onConfirm={() => statusMutation.mutate({ id: record.id, status: record.status === 'active' ? 'archived' : 'active' })}
            okButtonProps={{ loading: statusMutation.isPending }}
          >
            <Button 
              type="text" 
              danger={record.status === 'active'}
              icon={record.status === 'active' ? <EyeInvisibleOutlined /> : <EyeOutlined />} 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* 核心指标卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={8}>
          <Card variant="outlined" bodyStyle={{ padding: '20px 24px' }}>
            {isStatsLoading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
              <Statistic title={<Space><ShoppingOutlined /> 活跃产品</Space>} value={stats?.activeProducts} valueStyle={{ fontSize: 24, fontWeight: 600, color: '#1890ff' }} />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card variant="outlined" bodyStyle={{ padding: '20px 24px' }}>
            {isStatsLoading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
              <Statistic title={<Space><TeamOutlined /> 累计订阅人数</Space>} value={stats?.totalSubscribers} valueStyle={{ fontSize: 24, fontWeight: 600, color: '#52c41a' }} />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card variant="outlined" bodyStyle={{ padding: '20px 24px' }}>
            {isStatsLoading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
              <Statistic title={<Space><FundOutlined /> 预估月收入 (MRR)</Space>} value={stats?.mrr} prefix="¥" precision={2} valueStyle={{ fontSize: 24, fontWeight: 600, color: '#722ed1' }} />
            )}
          </Card>
        </Col>
      </Row>

      {/* 列表 Card */}
      <Card 
        variant="outlined"
        title={<Space><ShoppingOutlined /> 订阅套餐管理</Space>}
        extra={
          <Space>
            <Button icon={<ReloadOutlined spin={isProductsRefetching} />} onClick={() => refetchProducts()}>刷新</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsEditModalOpen(true)}>新增套餐</Button>
          </Space>
        }
      >
        <Table 
          columns={columns} 
          dataSource={products} 
          loading={isProductsLoading}
          size="middle"
          pagination={false}
          locale={{ emptyText: <Empty description="暂无产品配置" /> }}
        />
      </Card>

      {/* 弹窗组件 */}
      <ProductEditModal 
        open={isEditModalOpen} 
        onCancel={() => { setIsEditModalOpen(false); setEditingProduct(null); }} 
        initialValues={editingProduct || undefined}
      />
      
      <ProductLocalizationModal
        open={isLocModalOpen}
        onCancel={() => { setIsLocModalOpen(false); setEditingProduct(null); }}
        product={editingProduct || undefined}
      />
    </div>
  );
};

export default Products;
