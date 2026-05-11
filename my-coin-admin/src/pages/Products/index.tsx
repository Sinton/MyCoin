import React, { useState, useMemo } from 'react';
import { 
  Typography, Space, Button, Row, Col, App, 
  Input, Divider, Empty
} from 'antd';
import { 
  PlusOutlined, SearchOutlined, 
  DatabaseOutlined, 
  HistoryOutlined, RocketOutlined
} from '@ant-design/icons';
import FeatureLibraryModal from './FeatureLibraryModal';
import ProductEditModal from './ProductEditModal';
import ProductLocalizationModal from './ProductLocalizationModal';
import SubscriptionCard from './SubscriptionCard';
import type { FeatureLibraryItem } from './FeatureLibraryModal';
import { useConfig } from '../../context/ConfigContext';

const { Text, Title } = Typography;

// --- 初始数据 ---
const INITIAL_LIBRARY: FeatureLibraryItem[] = [
  { key: 'FEAT_CHARTS', label: '全量动态图表', sort: 10, category: 'feature' },
  { key: 'FEAT_NOADS', label: '无广告体验', sort: 5, category: 'experience' },
  { key: 'FEAT_STORAGE_10G', label: '10GB 云端空间', sort: 20, category: 'storage' },
  { key: 'FEAT_STORAGE_50G', label: '50GB 云端空间', sort: 21, category: 'storage' },
  { key: 'FEAT_STORAGE_INF', label: '无限云端空间', sort: 25, category: 'storage' },
  { key: 'FEAT_SUPPORT_PRIO', label: '优先技术支持', sort: 40, category: 'service' },
  { key: 'FEAT_EXPORT', label: '高级数据导出', sort: 30, category: 'feature' },
  { key: 'FEAT_FUTURE_UPDATES', label: '所有未来更新', sort: 100, category: 'entitlement' },
  { key: 'FEAT_FULL_UNLOCK', label: '永久解锁所有功能', sort: 1, category: 'entitlement' },
];

const INITIAL_PACKAGES = [
  {
    id: 'pkg_month_202405',
    appleId: 'com.mycoin.pro.monthly',
    googleId: 'pro_monthly_sku',
    name: 'Pro 连续月包',
    price: 19.00,
    currency: 'CNY',
    plan: 'Pro',
    features: [
      { label: '全量动态图表', key: 'FEAT_CHARTS', sort: 10 },
      { label: '10GB 云端空间', key: 'FEAT_STORAGE_10G', sort: 20 },
      { label: '无广告体验', key: 'FEAT_NOADS', sort: 5 }
    ],
    status: 'active',
    type: 'subscription',
    cycle: 'month',
    enableApple: true,
    enableGoogle: true,
    locales: [
      { lang: 'zh_CN', name: 'Pro 连续月包', description: '解锁全量动态图表及10GB云存储空间' },
      { lang: 'zh_TW', name: 'Pro 連續月包', description: '解鎖全量動態圖表及10GB雲存儲空間' },
      { lang: 'en_US', name: 'Pro Monthly Subscription', description: 'Unlock dynamic charts and 10GB cloud storage.' },
      { lang: 'ja_JP', name: 'Pro 月間サブスクリプション', description: 'すべてのダイナミックチャートと10GBのクラウドストレージをアンロックします。' },
      { lang: 'ko_KR', name: 'Pro 월간 구독', description: '모든 다이내믹 차트와 10GB 클라우드 스토리지를 이용할 수 있습니다.' }
    ]
  },
  {
    id: 'pkg_year_202405',
    appleId: 'com.mycoin.pro.yearly',
    googleId: 'pro_yearly_sku',
    name: 'Pro 连续年包',
    price: 168.00,
    currency: 'CNY',
    plan: 'Pro',
    features: [
      { label: '全量动态图表', key: 'FEAT_CHARTS', sort: 10 },
      { label: '50GB 云端空间', key: 'FEAT_STORAGE_50G', sort: 21 },
      { label: '无广告体验', key: 'FEAT_NOADS', sort: 5 },
      { label: '优先技术支持', key: 'FEAT_SUPPORT_PRIO', sort: 40 }
    ],
    status: 'active',
    type: 'subscription',
    cycle: 'year',
    enableApple: true,
    enableGoogle: true,
    locales: [
      { lang: 'zh_CN', name: 'Pro 连续年包', description: '尊享50GB空间及优先技术支持，比月包更划算' },
      { lang: 'zh_TW', name: 'Pro 連續年包', description: '尊享50GB空間及優先技術支持，比月包更划算' },
      { lang: 'en_US', name: 'Pro Yearly Subscription', description: '50GB cloud storage & priority support. Best value!' },
      { lang: 'ja_JP', name: 'Pro 年間サブスクリプション', description: '50GBのストレージと优先サポート。最もお得なプランです。' },
      { lang: 'ko_KR', name: 'Pro 연간 구독', description: '50GB 스토리지 및 우선 지원. 가장 합리적인 선택!' }
    ]
  },
  {
    id: 'pkg_forever_202405',
    appleId: 'com.mycoin.lifetime',
    googleId: 'lifetime_sku',
    name: '终身会员套餐',
    price: 398.00,
    currency: 'CNY',
    plan: 'Lifetime',
    features: [
      { label: '永久解锁所有功能', key: 'FEAT_FULL_UNLOCK', sort: 1 },
      { label: '无限云端空间', key: 'FEAT_STORAGE_INF', sort: 25 },
      { label: '所有未来更新', key: 'FEAT_FUTURE_UPDATES', sort: 100 }
    ],
    status: 'inactive',
    type: 'consumable',
    cycle: 'forever',
    enableApple: true,
    enableGoogle: true,
    locales: [
      { lang: 'zh_CN', name: '终身会员套餐', description: '一次购买，永久解锁所有功能及未来更新' },
      { lang: 'zh_TW', name: '終身會員套餐', description: '一次購買，永久解鎖所有功能及未來更新' },
      { lang: 'en_US', name: 'Lifetime Membership', description: 'One-time purchase. Lifetime access to all future updates.' },
      { lang: 'ja_JP', name: 'ライフタイム会员', description: '一度の購入で、すべての功能と将来のアップデートを永久に利用できます。' },
      { lang: 'ko_KR', name: '평생 멤버십', description: '한 번의 구매로 모든 기능과 향후 업데이트를 평생 이용하세요.' }
    ]
  }
];

const ProductContent: React.FC = () => {
  const { message } = App.useApp();
  const { previewLang } = useConfig();
  
  const [packageList, setPackageList] = useState<any[]>(INITIAL_PACKAGES);
  const [featureLibrary, setFeatureLibrary] = useState<FeatureLibraryItem[]>(INITIAL_LIBRARY);
  
  const [searchKey, setSearchKey] = useState('');
  
  const [libModalOpen, setLibModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [locModalOpen, setLocModalOpen] = useState(false);
  
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [localizingPackage, setLocalizingPackage] = useState<any>(null);

  const filteredList = useMemo(() => {
    return packageList.filter(p => 
      p.name.toLowerCase().includes(searchKey.toLowerCase()) || 
      p.id.toLowerCase().includes(searchKey.toLowerCase()) ||
      p.appleId?.toLowerCase().includes(searchKey.toLowerCase()) ||
      p.googleId?.toLowerCase().includes(searchKey.toLowerCase())
    );
  }, [packageList, searchKey]);

  const handleSavePackage = (values: any) => {
    if (editingPackage) {
      setPackageList(prev => prev.map(item => item.id === editingPackage.id ? { ...item, ...values } : item));
      message.success('套餐更新成功');
    } else {
      setPackageList(prev => [...prev, { ...values, status: 'active', id: values.id || `pkg_${Date.now()}` }]);
      message.success('新套餐已创建');
    }
    setEditModalOpen(false);
  };

  const handleDeletePackage = (id: string) => {
    setPackageList(prev => prev.filter(item => item.id !== id));
    message.success('套餐已成功删除');
  };

  const handleStatusChange = (id: string, status: string) => {
    setPackageList(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    message.success(status === 'active' ? '套餐已成功上架' : '套餐已下架，可进行删除操作');
  };

  const handleSaveLocales = (locales: any[]) => {
    if (localizingPackage) {
      setPackageList(prev => prev.map(item => 
        item.id === localizingPackage.id ? { ...item, locales } : item
      ));
    }
    setLocModalOpen(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* 顶部标题与快速统计 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <Title level={2} style={{ margin: 0, marginBottom: 8 }}>订阅管理中心</Title>
          <Space split={<Divider type="vertical" />}>
            <Text type="secondary"><RocketOutlined /> 在线套餐: {packageList.filter(p => p.status === 'active').length}</Text>
            <Text type="secondary"><DatabaseOutlined /> 权益池素材: {featureLibrary.length} 项</Text>
            <Text type="secondary"><HistoryOutlined /> 最后更新: 刚刚</Text>
          </Space>
        </div>
        <Space size="small">
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
            onClick={() => { setEditingPackage(null); setEditModalOpen(true); }}>
            发布新套餐
          </Button>
        </Space>
      </div>

      {/* 搜索控制条 */}
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

      {/* 列表渲染 */}
      <Row gutter={[24, 24]}>
        {filteredList.map((pkg) => (
          <Col xs={24} lg={12} xl={8} key={pkg.id}>
            <SubscriptionCard 
              pkg={pkg} 
              previewLang={previewLang}
              onEdit={(p) => { setEditingPackage(p); setEditModalOpen(true); }} 
              onLocalize={(p) => { setLocalizingPackage(p); setLocModalOpen(true); }}
              onDelete={handleDeletePackage}
              onStatusChange={handleStatusChange}
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

      {/* 弹窗组件 */}
      <FeatureLibraryModal 
        open={libModalOpen}
        onCancel={() => setLibModalOpen(false)}
        library={featureLibrary}
        onChange={setFeatureLibrary}
      />
      <ProductEditModal 
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onSave={handleSavePackage}
        editingProduct={editingPackage}
        featureLibrary={featureLibrary}
        type={editingPackage?.type || 'subscription'}
      />
      <ProductLocalizationModal 
        open={locModalOpen}
        onCancel={() => setLocModalOpen(false)}
        onSave={handleSaveLocales}
        initialLocales={localizingPackage?.locales}
        productName={localizingPackage?.name || ''}
      />
    </div>
  );
};

const Products: React.FC = () => (<App><ProductContent /></App>);

export default Products;
