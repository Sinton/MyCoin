import React, { useState } from 'react';
import { 
  Typography, Space, Button, Tag, Divider, Modal, Input, 
  InputNumber, message, Select, Table, Popconfirm, List
} from 'antd';
import { 
  EditOutlined, PlusOutlined, DeleteOutlined,
  AppstoreOutlined, DatabaseOutlined, SafetyCertificateOutlined,
  RocketOutlined, SmileOutlined, SearchOutlined, CheckOutlined, CloseOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography;
const { Option } = Select;

// --- 类别配置 ---
export const getFeatureCategories = (t: any) => [
  { value: 'all', label: t('products.library.categories.all'), icon: <AppstoreOutlined />, color: 'default' },
  { value: 'feature', label: t('products.library.categories.feature'), icon: <RocketOutlined />, color: 'blue' },
  { value: 'experience', label: t('products.library.categories.experience'), icon: <SmileOutlined />, color: 'green' },
  { value: 'storage', label: t('products.library.categories.storage'), icon: <DatabaseOutlined />, color: 'orange' },
  { value: 'service', label: t('products.library.categories.service'), icon: <SettingOutlined />, color: 'purple' },
  { value: 'entitlement', label: t('products.library.categories.entitlement'), icon: <SafetyCertificateOutlined />, color: 'magenta' },
];

export interface FeatureLibraryItem {
  key: string;
  name: string;
  sort: number;
  category: string;
  locales?: Record<string, string>;
}

interface FeatureLibraryModalProps {
  open: boolean;
  onCancel: () => void;
  library: FeatureLibraryItem[];
  onChange: (newLibrary: FeatureLibraryItem[]) => void;
}

const FeatureLibraryModal: React.FC<FeatureLibraryModalProps> = ({ 
  open, 
  onCancel, 
  library, 
  onChange 
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const FEATURE_CATEGORIES = getFeatureCategories(t);
  
  const [libCategory, setLibCategory] = useState('all');
  const [libSearchText, setLibSearchText] = useState('');
  const [editingKey, setEditingKey] = useState('');
  const [editRowData, setEditRowData] = useState<Partial<FeatureLibraryItem>>({});

  const startEditLib = (record: FeatureLibraryItem) => {
    setEditingKey(record.key);
    setEditRowData({ ...record });
  };

  const saveLibItem = (key: string) => {
    const newLibrary = library.map(item => item.key === key ? { ...item, ...editRowData } as FeatureLibraryItem : item);
    onChange(newLibrary);
    setEditingKey('');
    message.success(t('products.library.actions.update_success'));
  };

  const handleAddNewRow = () => {
    const newKey = `FEAT_NEW_${Date.now()}`;
    const newItem = { key: newKey, name: t('products.library.actions.new_item'), sort: 99, category: libCategory === 'all' ? 'feature' : libCategory };
    onChange([newItem, ...library]);
    setEditingKey(newKey);
    setEditRowData(newItem);
  };

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={1050}
      styles={{ body: { padding: 0 } }}
      centered
    >
      <div className="flex h-[620px]">
        {/* 左侧导航 */}
        <div className="w-56 bg-gray-50 border-r flex flex-col p-4">
          <div className="mb-8 px-2 font-bold text-gray-700">{t('products.library.title')}</div>
          <div className="flex-1 overflow-auto">
            <List
              dataSource={FEATURE_CATEGORIES}
              renderItem={cat => (
                <div 
                  className={`flex items-center gap-3 px-4 py-2.5 mb-1 rounded-lg cursor-pointer transition-all ${libCategory === cat.value ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-200 text-gray-600'}`}
                  onClick={() => setLibCategory(cat.value)}
                >
                  {cat.icon}
                  <span className="text-sm">{cat.label}</span>
                </div>
              )}
            />
          </div>
          <Divider style={{ margin: '12px 0' }} />
          <Button type="primary" block icon={<PlusOutlined />} onClick={handleAddNewRow} ghost>{t('products.library.actions.add')}</Button>
        </div>

        {/* 右侧列表 */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center bg-gray-50/20">
            <Title level={5} style={{margin:0}}>{FEATURE_CATEGORIES.find(c => c.value === libCategory)?.label}</Title>
            <Input 
              prefix={<SearchOutlined />} 
              placeholder={t('products.library.actions.search')} 
              className="w-56 rounded-full" 
              value={libSearchText} 
              onChange={e => setLibSearchText(e.target.value)} 
            />
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <Table 
              dataSource={library.filter(i => (libCategory === 'all' || i.category === libCategory) && (i.name?.toLowerCase().includes(libSearchText.toLowerCase()) || i.key?.toLowerCase().includes(libSearchText.toLowerCase())))}
              pagination={false}
              size="middle"
              rowKey="key"
              columns={[
                { 
                  title: t('products.library.columns.name'), 
                  dataIndex: 'name', 
                  render: (text, record) => record.key === editingKey ? (
                    <Input 
                      value={editRowData.name} 
                      onChange={e => setEditRowData({...editRowData, name: e.target.value})} 
                      variant="borderless"
                      className="bg-gray-100 hover:bg-gray-200 rounded px-2"
                      style={{ height: '28px', fontSize: '14px' }}
                    />
                  ) : <Text strong className="px-2 block" style={{ height: '28px', lineHeight: '28px', fontSize: '14px' }}>{record.locales?.[currentLang] || text}</Text>
                },
                { 
                  title: t('products.library.columns.code'), 
                  dataIndex: 'key', 
                  width: 200,
                  render: (text, record) => record.key === editingKey ? (
                    <Input 
                      value={editRowData.key} 
                      onChange={e => setEditRowData({...editRowData, key: e.target.value})} 
                      variant="borderless"
                      className="bg-gray-100 hover:bg-gray-200 rounded px-2 font-mono"
                      style={{ height: '28px', fontSize: '14px' }}
                    />
                  ) : <div className="px-2"><Text code style={{ fontSize: '14px', margin: 0, padding: '2px 4px' }}>{text}</Text></div>
                },
                { 
                  title: t('products.library.columns.category'), 
                  dataIndex: 'category', 
                  width: 120,
                  render: (text, record) => record.key === editingKey ? (
                    <Select 
                      value={editRowData.category} 
                      onChange={v => setEditRowData({...editRowData, category: v})} 
                      variant="borderless"
                      className="bg-gray-100 hover:bg-gray-200 rounded w-full"
                      style={{ height: '28px', fontSize: '14px' }}
                    >
                      {FEATURE_CATEGORIES.filter(c => c.value !== 'all').map(c => <Option key={c.value} value={c.value}>{c.label}</Option>)}
                    </Select>
                  ) : <div className="px-2"><Tag color={FEATURE_CATEGORIES.find(c => c.value === text)?.color} style={{ margin: 0, fontSize: '13px' }}>{FEATURE_CATEGORIES.find(c => c.value === text)?.label}</Tag></div>
                },
                { 
                  title: t('products.library.columns.sort'), 
                  dataIndex: 'sort', 
                  width: 80,
                  sorter: (a, b) => a.sort - b.sort,
                  render: (text, record) => record.key === editingKey ? (
                    <InputNumber 
                      value={editRowData.sort} 
                      onChange={v => setEditRowData({...editRowData, sort: v || 0})} 
                      variant="borderless"
                      className="bg-gray-100 hover:bg-gray-200 rounded w-full"
                      style={{ height: '28px', fontSize: '14px' }}
                    />
                  ) : <div className="px-2" style={{ fontSize: '14px' }}>{text}</div>
                },
                { 
                  title: t('products.library.columns.action'), 
                  key: 'action', 
                  align: 'right',
                  width: 100,
                  render: (_, record) => record.key === editingKey ? (
                    <Space size={12} className="px-2">
                      <CheckOutlined className="text-green-500 cursor-pointer" onClick={() => saveLibItem(record.key)} />
                      <CloseOutlined 
                        className="text-gray-400 cursor-pointer" 
                        onClick={() => {
                          if (record.key.startsWith('FEAT_NEW_')) {
                            onChange(library.filter(i => i.key !== record.key));
                          }
                          setEditingKey('');
                        }} 
                      />
                    </Space>
                  ) : (
                    <Space size={12} className="px-2">
                      <EditOutlined className="text-blue-500 cursor-pointer" onClick={() => startEditLib(record)} />
                      <Popconfirm title={t('common.confirm') + '?'} okText={t('common.confirm')} cancelText={t('common.cancel')} onConfirm={() => onChange(library.filter(i => i.key !== record.key))}>
                        <DeleteOutlined className="text-red-400 cursor-pointer" />
                      </Popconfirm>
                    </Space>
                  )
                }
              ]}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FeatureLibraryModal;
