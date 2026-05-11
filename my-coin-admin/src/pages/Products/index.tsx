import React, { useState, useMemo } from 'react';
import { 
  Typography, Card, Space, Button, Input, 
  Row, Col, Divider, App, Empty, Skeleton
} from 'antd';
import { 
  PlusOutlined, SearchOutlined, 
  DatabaseOutlined, RocketOutlined, 
  HistoryOutlined, ReloadOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useConfig } from '../../context/ConfigContext';
import { getProducts, getProductStats, updateProductStatus, getFeatureLibrary, updateFeatureLibrary } from '../../api/products';
import SubscriptionCard from './SubscriptionCard';
import ProductEditModal from './ProductEditModal';
import ProductLocalizationModal from './ProductLocalizationModal';
import FeatureLibraryModal from './FeatureLibraryModal';
import PageHeader from '../../components/common/PageHeader';
import type { Product, FeatureLibraryItem } from '../../types';

const { Title, Text } = Typography;

const ProductContent: React.FC = () => {
  const { message } = App.useApp();
  const { previewLang } = useConfig();
  const queryClient = useQueryClient();
  
  const [searchKey, setSearchKey] = useState('');
  
  const [libModalOpen, setLibModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [locModalOpen, setLocModalOpen] = useState(false);
  
  const [editingPackage, setEditingPackage] = useState<Product | null>(null);
  const [localizingPackage, setLocalizingPackage] = useState<Product | null>(null);

  // --- 异步数据获取 (接入 P0) ---
  const { 
    data: productsRes, 
    isLoading: isProductsLoading, 
    refetch: refetchProducts,
    isRefetching: isProductsRefetching 
  } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  const { data: statsRes } = useQuery({
    queryKey: ['productStats'],
    queryFn: getProductStats
  });

  const { data: libRes } = useQuery({
    queryKey: ['featureLibrary'],
    queryFn: getFeatureLibrary
  });

  // --- 业务操作 Mutations ---
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: 'active' | 'inactive' }) => updateProductStatus(id, status as any),
    onSuccess: (res) => {
      message.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const libMutation = useMutation({
    mutationFn: (newLib: FeatureLibraryItem[]) => updateFeatureLibrary(newLib),
    onSuccess: (res) => {
      message.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['featureLibrary'] });
    }
  });

  const packageList = productsRes?.data || [];
  const stats = statsRes?.data;
  const featureLibrary = libRes?.data || [];

  // --- 原始搜索过滤逻辑 ---
  const filteredList = useMemo(() => {
    return packageList.filter(p => {
      const search = searchKey.toLowerCase();
      // 获取当前语言下的名称
      let currentName = p.name;
      if (previewLang !== 'master' && p.locales) {
        const locale = p.locales.find((l: any) => l.lang === previewLang);
        if (locale) currentName = locale.name;
      }
      
      return currentName.toLowerCase().includes(search) || 
        p.id.toLowerCase().includes(search) ||
        p.appleId?.toLowerCase().includes(search) ||
        p.googleId?.toLowerCase().includes(search);
    });
  }, [packageList, searchKey, previewLang]);

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* 顶部标题与快速统计 - 使用 PageHeader 还原样式 */}
      <PageHeader 
        title="订阅管理中心"
        stats={
          <>
            <Text type="secondary"><RocketOutlined /> 在线套餐: {stats?.activeProducts || 0}</Text>
            <Text type="secondary"><DatabaseOutlined /> 权益池素材: {featureLibrary.length} 项</Text>
            <Text type="secondary"><HistoryOutlined /> 最后更新: 刚刚</Text>
          </>
        }
        extra={
          <>
            <Button icon={<ReloadOutlined spin={isProductsRefetching} />} onClick={() => refetchProducts()}>刷新</Button>
            <Button 
               icon={<DatabaseOutlined />} 
               onClick={() => setLibModalOpen(true)}
               style={{ 
                 borderRadius: 8,
                 backgroundColor: '#f0f7ff',
                 color: '#0050b3',
                 border: '1px solid #adc6ff',
                 fontWeight: 500
               }}
               className="hover:bg-blue-100 transition-all"
            >
              素材库
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              size="large"
              onClick={() => { setEditingPackage(null); setEditModalOpen(true); }}>
              发布新套餐
            </Button>
          </>
        }
      />

      {/* 搜索控制条 - 原始交互 */}
      <div className="mb-8">
        <Input 
          placeholder="搜索套餐名称、ID 或商店 SKU..." 
          prefix={<SearchOutlined className="text-gray-400" />}
          size="large"
          className="shadow-sm border-none rounded-xl h-12 px-6"
          allowClear
          value={searchKey}
          onChange={e => setSearchKey(e.target.value)}
        />
      </div>

      {/* 列表渲染 - 原始交互 */}
      {isProductsLoading ? (
        <Row gutter={[24, 24]}>
          {[1, 2, 3].map(i => <Col xs={24} lg={12} xl={8} key={i}><Card loading variant="outlined" style={{ height: 400 }} /></Col>)}
        </Row>
      ) : (
        <Row gutter={[24, 24]}>
          {filteredList.map((pkg) => (
            <Col xs={24} lg={12} xl={8} key={pkg.id}>
              <SubscriptionCard 
                pkg={pkg} 
                onEdit={(p) => { setEditingPackage(p); setEditModalOpen(true); }} 
                onLocalize={(p) => { setLocalizingPackage(p); setLocModalOpen(true); }}
                onDelete={(id) => message.info('演示环境暂不支持删除，请使用下架功能')}
                onStatusChange={(id, status) => statusMutation.mutate({ id, status: status as any })}
              />
            </Col>
          ))}
          {filteredList.length === 0 && (
            <Col span={24}>
              <div className="py-20 bg-gray-50/50 rounded-2xl border-dashed border-2 flex flex-col items-center justify-center text-gray-400">
                <Empty description="未找到符合条件的套餐" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            </Col>
          )}
        </Row>
      )}

      {/* 弹窗组件 - 原始功能 */}
      <FeatureLibraryModal 
        open={libModalOpen}
        onCancel={() => setLibModalOpen(false)}
        library={featureLibrary}
        onChange={(newLib) => libMutation.mutate(newLib)}
      />
      <ProductEditModal 
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onSave={(values) => {
           console.log('Saving product:', values);
           setEditModalOpen(false);
           message.success('保存成功（演示环境）');
        }}
        editingProduct={editingPackage}
        featureLibrary={featureLibrary}
        type={editingPackage?.type || 'subscription'}
      />
      <ProductLocalizationModal 
        open={locModalOpen}
        onCancel={() => setLocModalOpen(false)}
        onSave={(locales) => {
           console.log('Saving locales:', locales);
           setLocModalOpen(false);
           message.success('本地化配置已更新（演示环境）');
        }}
        initialLocales={localizingPackage?.locales || []}
        productName={localizingPackage?.name || ''}
      />
    </div>
  );
};

const Products: React.FC = () => (<App><ProductContent /></App>);

export default Products;
