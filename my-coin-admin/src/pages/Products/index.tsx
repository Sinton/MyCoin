import React, { useState, useMemo } from 'react';
import { 
  Typography, Card, Space, Button, Input, 
  Flex, Divider, App, Empty, Skeleton
} from 'antd';
import { 
  PlusOutlined, SearchOutlined, 
  DatabaseOutlined, RocketOutlined, 
  HistoryOutlined, ReloadOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useConfigStore } from '@/store';
import { getProducts, getProductStats, updateProductStatus, getFeatureLibrary, updateFeatureLibrary, updateProduct, createProduct } from '@/api/products';
import SubscriptionCard from './SubscriptionCard';
import ProductEditModal from './ProductEditModal';
import ProductLocalizationModal from './ProductLocalizationModal';
import FeatureLibraryModal from './FeatureLibraryModal';
import PageHeader from '@/components/common/PageHeader';
import type { Product, FeatureLibraryItem } from '@/types';

const { Title, Text } = Typography;

const ProductContent: React.FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const { language } = useConfigStore();
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

  const saveMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: any }) => updateProduct(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  const createMutation = useMutation({
    mutationFn: (values: any) => createProduct(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  const packageList = productsRes?.data || [];
  const stats = statsRes?.data;
  const featureLibrary = libRes?.data || [];

  // --- 原始搜索过滤逻辑 ---
  const filteredList = useMemo(() => {
    let list = packageList;
    
    // 搜索过滤
    if (searchKey) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(searchKey.toLowerCase()) || 
        p.id.toLowerCase().includes(searchKey.toLowerCase())
      );
    }
    
    // 多语言预览逻辑: 尝试替换显示名称
    return list.map(p => {
      if (p.locales) {
        const locale = p.locales.find((l: any) => l.lang === language);
        if (locale) {
          return { ...p, name: locale.name, description: locale.description };
        }
      }
      return p;
    });
  }, [packageList, searchKey, language]);

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* 顶部标题与快速统计 - 使用 PageHeader 还原样式 */}
      <PageHeader 
        title={t('products.title')}
        stats={
          <>
            <Text type="secondary"><RocketOutlined /> {t('products.stats.active')}: {stats?.activeProducts || 0}</Text>
            <Text type="secondary"><DatabaseOutlined /> {t('products.stats.features', { count: featureLibrary.length })}</Text>
            <Text type="secondary"><HistoryOutlined /> {t('products.stats.last_update', { time: t('products.stats.just_now') })}</Text>
          </>
        }
        extra={
          <>
            <Button icon={<ReloadOutlined spin={isProductsRefetching} />} onClick={() => refetchProducts()}>{t('common.refresh')}</Button>
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
              {t('products.actions.library')}
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => { setEditingPackage(null); setEditModalOpen(true); }}>
              {t('products.actions.new')}
            </Button>
          </>
        }
      />

      {/* 搜索控制条 - 原始交互 */}
      <div className="mb-8">
        <Input 
          placeholder={t('products.search_placeholder')} 
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
        <Flex wrap="wrap" gap={15}>
          {[1, 2, 3].map(i => <Card key={i} loading variant="outlined" style={{ width: 340, height: 400 }} />)}
        </Flex>
      ) : (
        <Flex wrap="wrap" gap={15}>
          {filteredList.map((pkg) => (
             <SubscriptionCard 
              key={pkg.id}
              pkg={pkg} 
              featureLibrary={featureLibrary}
              onEdit={(p) => { setEditingPackage(p); setEditModalOpen(true); }} 
              onLocalize={(p) => { setLocalizingPackage(p); setLocModalOpen(true); }}
              onDelete={(id) => message.info(t('products.messages.delete_demo'))}
              onStatusChange={(id, status) => statusMutation.mutate({ id, status: status as any })}
            />
          ))}
          {filteredList.length === 0 && (
            <div className="w-full py-20 bg-gray-50/50 rounded-2xl border-dashed border-2 flex flex-col items-center justify-center text-gray-400">
              <Empty description={t('products.empty_result')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          )}
        </Flex>
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
           if (editingPackage) {
             saveMutation.mutate({ id: editingPackage.id, values }, {
               onSuccess: () => {
                 message.success(t('products.messages.save_demo'));
                 setEditModalOpen(false);
               }
             });
           } else {
             createMutation.mutate(values, {
               onSuccess: () => {
                 message.success(t('products.messages.save_demo'));
                 setEditModalOpen(false);
               }
             });
           }
        }}
        editingProduct={editingPackage}
        featureLibrary={featureLibrary}
        type={editingPackage?.type || 'subscription'}
      />
      <ProductLocalizationModal 
        open={locModalOpen}
        onCancel={() => setLocModalOpen(false)}
        onSave={(locales) => {
           if (localizingPackage) {
             saveMutation.mutate({ id: localizingPackage.id, values: { locales } }, {
               onSuccess: () => {
                 message.success(t('products.messages.localize_demo'));
                 setLocModalOpen(false);
               }
             });
           }
        }}
        initialLocales={localizingPackage?.locales || []}
        productName={localizingPackage?.name || ''}
        productDescription={localizingPackage?.description || ''}
      />
    </div>
  );
};

const Products: React.FC = () => (<App><ProductContent /></App>);

export default Products;
