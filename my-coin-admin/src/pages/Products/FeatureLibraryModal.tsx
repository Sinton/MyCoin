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

const { Text, Title } = Typography;
const { Option } = Select;

// --- 类别配置 ---
export const FEATURE_CATEGORIES = [
  { value: 'all', label: '全部权益', icon: <AppstoreOutlined />, color: 'default' },
  { value: 'feature', label: '功能特性', icon: <RocketOutlined />, color: 'blue' },
  { value: 'experience', label: '用户体验', icon: <SmileOutlined />, color: 'green' },
  { value: 'storage', label: '存储空间', icon: <DatabaseOutlined />, color: 'orange' },
  { value: 'service', label: '专属服务', icon: <SettingOutlined />, color: 'purple' },
  { value: 'entitlement', label: '核心权益', icon: <SafetyCertificateOutlined />, color: 'magenta' },
];

export interface FeatureLibraryItem {
  key: string;
  label: string;
  sort: number;
  category: string;
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
    message.success('权益信息已更新');
  };

  const handleAddNewRow = () => {
    const newKey = `FEAT_NEW_${Date.now()}`;
    const newItem = { key: newKey, label: '新权益项', sort: 99, category: libCategory === 'all' ? 'feature' : libCategory };
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
          <div className="mb-8 px-2 font-bold text-gray-700">标准权益素材库</div>
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
          <Button type="primary" block icon={<PlusOutlined />} onClick={handleAddNewRow} ghost>添加权益</Button>
        </div>

        {/* 右侧列表 */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center bg-gray-50/20">
            <Title level={5} style={{margin:0}}>{FEATURE_CATEGORIES.find(c => c.value === libCategory)?.label}</Title>
            <Input 
              prefix={<SearchOutlined />} 
              placeholder="搜索权益名称或代号" 
              className="w-56 rounded-full" 
              value={libSearchText} 
              onChange={e => setLibSearchText(e.target.value)} 
            />
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <Table 
              dataSource={library.filter(i => (libCategory === 'all' || i.category === libCategory) && (i.label.toLowerCase().includes(libSearchText.toLowerCase()) || i.key.toLowerCase().includes(libSearchText.toLowerCase())))}
              pagination={false}
              size="middle"
              rowKey="key"
              columns={[
                { 
                  title: '权益名称', 
                  dataIndex: 'label', 
                  render: (text, record) => record.key === editingKey ? (
                    <Input 
                      value={editRowData.label} 
                      onChange={e => setEditRowData({...editRowData, label: e.target.value})} 
                      variant="borderless"
                      className="bg-gray-100 hover:bg-gray-200 rounded px-2"
                      style={{ height: '28px', fontSize: '14px' }}
                    />
                  ) : <Text strong className="px-2 block" style={{ height: '28px', lineHeight: '28px', fontSize: '14px' }}>{text}</Text>
                },
                { 
                  title: '权益代号', 
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
                  title: '类别', 
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
                  title: '权重', 
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
                  title: '操作', 
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
                      <Popconfirm title="确认删除？" okText="确定" cancelText="取消" onConfirm={() => onChange(library.filter(i => i.key !== record.key))}>
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
