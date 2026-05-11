import React, { useEffect } from 'react';
import { 
  Modal, Form, Row, Col, Input, InputNumber, Select, 
  Divider, Space, Switch, Typography, Button, App, Tag, Empty, Avatar
} from 'antd';
import { 
  AppleOutlined, AndroidOutlined, PlusOutlined, 
  DeleteOutlined, TagOutlined, InfoCircleOutlined,
  LinkOutlined, RobotOutlined
} from '@ant-design/icons';
import type { FeatureLibraryItem } from './FeatureLibraryModal';

const { Text } = Typography;
const { Option, OptGroup } = Select;

const CURRENCY_OPTIONS = [
  { value: 'CNY', label: '人民币 (CNY)' },
  { value: 'USD', label: '美元 (USD)' },
  { value: 'JPY', label: '日元 (JPY)' },
  { value: 'KRW', label: '韩元 (KRW)' },
];

const CATEGORY_MAP: Record<string, { label: string, color: string }> = {
  feature: { label: '功能', color: 'blue' },
  experience: { label: '体验', color: 'cyan' },
  storage: { label: '存储', color: 'purple' },
  service: { label: '服务', color: 'orange' },
  entitlement: { label: '权益', color: 'gold' },
};

interface ProductEditModalProps {
  open: boolean;
  onCancel: () => void;
  onSave: (values: any) => void;
  editingProduct: any;
  featureLibrary: FeatureLibraryItem[];
  type: string;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({ 
  open, 
  onCancel, 
  onSave, 
  editingProduct, 
  featureLibrary,
  type
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  
  // 监听名称和周期，用于自动生成 ID

  const cycle = Form.useWatch('cycle', form);

  // 自动化 ID 生成逻辑
  useEffect(() => {
    if (open && !editingProduct) {
      const now = new Date();
      const yearMonth = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}`;
      
      // 只有在名称或周期存在时才生成，或者初始化一个基础格式
      const prefix = 'pkg';
      const cyclePart = cycle || 'sub';
      
      const autoId = `${prefix}_${cyclePart}_${yearMonth}`;
      form.setFieldsValue({ id: autoId });
    }
  }, [open, editingProduct, cycle, form]);

  useEffect(() => {
    if (open) {
      if (editingProduct) form.setFieldsValue(editingProduct);
    }
  }, [open, editingProduct, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const enrichedFeatures = (values.features || []).map((f: any) => {
        const item = featureLibrary.find(i => i.key === f.key);
        return item ? { ...item } : null;
      }).filter(Boolean);

      onSave({ ...values, features: enrichedFeatures, type });
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const renderOptions = (allFeatures: FeatureLibraryItem[], selectedKeys: string[]) => {
    const grouped = allFeatures.reduce((acc, item) => {
      const cat = item.category || 'other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {} as Record<string, FeatureLibraryItem[]>);

    return Object.entries(grouped).map(([ck, items]) => (
      <OptGroup key={ck} label={CATEGORY_MAP[ck]?.label || '其他'}>
        {items.map(l => (
          <Option key={l.key} value={l.key} label={l.label} disabled={selectedKeys.includes(l.key)}>
            <div className="flex justify-between items-center">
              <span>{l.label}</span>
              <Text type="secondary" style={{fontSize:10}}>{l.key}</Text>
            </div>
          </Option>
        ))}
      </OptGroup>
    ));
  };

  return (
    <Modal
      title={editingProduct ? "配置订阅套餐" : "新增订阅套餐"}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      width={600}
      destroyOnHidden
      styles={{ body: { padding: '8px 0' } }}
    >
      <Form form={form} layout="vertical" className="px-6">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              label={<Space><RobotOutlined className="text-blue-500"/> 套餐 ID (自动生成)</Space>} 
              name="id" 
              rules={[{required:true}]}
              tooltip="系统根据套餐类型和时间自动生成的唯一标识，不可修改"
            >
              <Input variant="filled" disabled style={{ color: '#666', fontWeight: 'bold' }} />
            </Form.Item>
          </Col>
          <Col span={12}><Form.Item label="套餐名称" name="name" rules={[{required:true, message:'必填'}]}><Input placeholder="例如：Pro 会员月包"/></Form.Item></Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={8}><Form.Item label="价格" name="price" rules={[{required:true, message:'必填'}]}><InputNumber className="w-full" precision={2}/></Form.Item></Col>
          <Col span={8}><Form.Item label="货币单位" name="currency" initialValue="CNY"><Select options={CURRENCY_OPTIONS}/></Form.Item></Col>
          <Col span={8}>
            <Form.Item label="计费周期" name="cycle" initialValue="month">
              <Select options={[{value:'month',label:'每月续费'},{value:'year',label:'每年续费'},{value:'forever',label:'终身有效'}]}/>
            </Form.Item>
          </Col>
        </Row>

        <Divider plain><Text type="secondary" style={{fontSize:11}}>多平台 ID 绑定</Text></Divider>
        
        <div className="space-y-2">
          {[
            { field: 'enableApple', idField: 'appleId', label: 'App Store', icon: <AppleOutlined/>, placeholder: 'com.app.premium_monthly', color: '#000' },
            { field: 'enableGoogle', idField: 'googleId', label: 'Google Play', icon: <AndroidOutlined/>, placeholder: 'sku_premium_monthly', color: '#3DDC84' }
          ].map(p => (
            <Form.Item noStyle shouldUpdate key={p.field}>
              {() => {
                const active = form.getFieldValue(p.field);
                return (
                  <div className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 ${active ? 'bg-white border-blue-100 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                    <Avatar 
                      icon={p.icon} 
                      size="default"
                      style={{ 
                        backgroundColor: active ? p.color : '#e5e7eb',
                        flexShrink: 0,
                        transition: 'all 0.3s'
                      }} 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <Text strong style={{ fontSize: 13 }}>{p.label}</Text>
                        <Form.Item name={p.field} valuePropName="checked" initialValue={true} noStyle>
                          <Switch size="small" />
                        </Form.Item>
                      </div>
                      <Form.Item name={p.idField} noStyle rules={[{ required: active, message: '请输入 ID' }]}>
                        <Input 
                          size="small"
                          placeholder={p.placeholder}
                          disabled={!active}
                          variant="filled"
                          prefix={<LinkOutlined style={{ fontSize: 10, color: '#bfbfbf' }} />}
                          style={{ borderRadius: 6 }}
                        />
                      </Form.Item>
                    </div>
                  </div>
                );
              }}
            </Form.Item>
          ))}
        </div>

        <Divider plain><Text type="secondary" style={{fontSize:11}}>套餐权益清单 (按类聚合)</Text></Divider>
        
        <Form.Item noStyle shouldUpdate={(prev, curr) => prev.features !== curr.features}>
          {() => (
            <Form.List name="features">
              {(fields, { add, remove }) => {
                const allSelectedKeys = form.getFieldValue('features')?.map((f:any) => f?.key).filter(Boolean) || [];
                const readyFields: Record<string, any[]> = {};
                const pendingFields: any[] = [];
                fields.forEach((field) => {
                  const selectedKey = form.getFieldValue(['features', field.name, 'key']);
                  if (!selectedKey) pendingFields.push(field);
                  else {
                    const item = featureLibrary.find(i => i.key === selectedKey);
                    const cat = item?.category || 'other';
                    if (!readyFields[cat]) readyFields[cat] = [];
                    readyFields[cat].push(field);
                  }
                });

                return (
                  <div className="space-y-4">
                    {Object.entries(readyFields).map(([catKey, catFields]) => (
                      <div key={catKey} className="border border-gray-100 rounded-lg bg-white overflow-hidden shadow-sm">
                        <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-100 flex items-center justify-between">
                          <Space><TagOutlined className="text-gray-400"/><Text strong style={{fontSize:12}}>{CATEGORY_MAP[catKey]?.label || '其他'}</Text></Space>
                          <Tag color={CATEGORY_MAP[catKey]?.color} style={{margin:0, fontSize:10}}>{catFields.length} 项</Tag>
                        </div>
                        <div className="p-1 space-y-1">
                          {catFields.map(({ key, ...rest }) => (
                            <div key={key} className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded transition-colors group">
                              <Form.Item {...rest} name={[rest.name, 'key']} noStyle>
                                <Select showSearch variant="borderless" className="flex-1" size="small" optionFilterProp="label">
                                  {renderOptions(featureLibrary, allSelectedKeys.filter(k => k !== form.getFieldValue(['features', rest.name, 'key'])))}
                                </Select>
                              </Form.Item>
                              <DeleteOutlined className="text-gray-300 hover:text-red-500 cursor-pointer transition-opacity" onClick={() => remove(rest.name)} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {pendingFields.length > 0 && (
                      <div className="border border-blue-200 rounded-lg bg-blue-50/30 p-3 border-dashed">
                        <div className="mb-2 flex items-center gap-2">
                          <InfoCircleOutlined className="text-blue-400"/>
                          <Text type="secondary" strong style={{fontSize:12}}>正在配置新权益...</Text>
                        </div>
                        <div className="space-y-2">
                          {pendingFields.map(({ key, ...rest }) => (
                            <div key={key} className="flex items-center gap-2 bg-white p-2 rounded shadow-sm border border-blue-100">
                              <Form.Item {...rest} name={[rest.name, 'key']} noStyle rules={[{required:true, message:'请选择'}]}>
                                <Select placeholder="请搜索选择目标权益" showSearch className="flex-1" optionFilterProp="label">
                                  {renderOptions(featureLibrary, allSelectedKeys)}
                                </Select>
                              </Form.Item>
                              <DeleteOutlined className="text-red-300 hover:text-red-500 cursor-pointer" onClick={() => remove(rest.name)} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {fields.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂未配置权益" className="my-4"/>}
                    
                    <Button 
                      type="dashed" 
                      block 
                      icon={<PlusOutlined />} 
                      onClick={() => {
                        if (fields.length >= featureLibrary.length) {
                          message.warning('素材库中的所有权益已全部添加完毕');
                          return;
                        }
                        add();
                      }}
                      style={{ height: 40, borderRadius: 6 }}
                    >
                      添加权益素材到套餐
                    </Button>
                  </div>
                );
              }}
            </Form.List>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductEditModal;
