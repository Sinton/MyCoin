import React, { useEffect } from 'react';
import { 
  Modal, Form, Input, InputNumber, Select, 
  Row, Col, Space, Divider, Switch, Avatar, 
  Typography, App, Tag, Button, Empty
} from 'antd';
import { 
  RobotOutlined, AppleOutlined, AndroidOutlined, 
  LinkOutlined, DeleteOutlined, TagOutlined, 
  PlusOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { Product, ProductFeature } from '@/mocks/data/products';

const { Text } = Typography;
const { Option, OptGroup } = Select;

// 这里的类型定义为了兼容性，如果外部没有定义则在此定义
interface FeatureLibraryItem extends ProductFeature {}

interface ProductEditModalProps {
  open: boolean;
  editingProduct: Product | null;
  featureLibrary: FeatureLibraryItem[];
  onCancel: () => void;
  onSave: (product: any) => void;
}

const CURRENCY_OPTIONS = [
  { value: 'CNY', label: 'CNY (¥)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'KRW', label: 'KRW (₩)' },
];

const ProductEditModal: React.FC<ProductEditModalProps> = ({
  open,
  editingProduct,
  featureLibrary,
  onCancel,
  onSave
}) => {
  const { t, i18n } = useTranslation();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  
  const CATEGORY_MAP: Record<string, {label: string, color: string}> = {
    feature: { label: t('products.edit.feature_category.feature'), color: 'blue' },
    experience: { label: t('products.edit.feature_category.experience'), color: 'green' },
    storage: { label: t('products.edit.feature_category.storage'), color: 'orange' },
    service: { label: t('products.edit.feature_category.service'), color: 'purple' },
    entitlement: { label: t('products.edit.feature_category.entitlement'), color: 'gold' },
  };
  
  const interval = Form.useWatch('interval', form);

  useEffect(() => {
    if (open && !editingProduct) {
      const now = new Date();
      const yearMonth = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}`;
      const prefix = 'pkg';
      const intervalPart = interval || 'sub';
      const autoId = `${prefix}_${intervalPart}_${yearMonth}`;
      form.setFieldsValue({ id: autoId });
    }
  }, [open, editingProduct, interval, form]);

  useEffect(() => {
    if (open) {
      if (editingProduct) {
        const formattedProduct = {
          ...editingProduct,
          features: (editingProduct.features || []).map(f => 
            typeof f === 'string' ? { key: f } : f
          )
        };
        form.setFieldsValue(formattedProduct);
      } else {
        form.resetFields();
      }
    }
  }, [open, editingProduct, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // 保持数据为 Key 数组以匹配 LIVE_PRODUCTS 定义
      const featureKeys = (values.features || []).map((f: any) => f?.key).filter(Boolean);
      onSave({ ...values, features: featureKeys });
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const renderOptions = (allFeatures: FeatureLibraryItem[], selectedKeys: string[]) => {
    const currentLang = i18n.language;
    const grouped = allFeatures.reduce((acc, item) => {
      const cat = item.category || 'other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {} as Record<string, FeatureLibraryItem[]>);

    return Object.entries(grouped).map(([ck, items]) => (
      <OptGroup key={ck} label={CATEGORY_MAP[ck]?.label || t('products.edit.feature_category.other')}>
        {items.map(l => {
          const localizedName = l.locales?.[currentLang] || l.name;
          return (
            <Option key={l.key} value={l.key} label={localizedName} disabled={selectedKeys.includes(l.key)}>
              <div className="flex justify-between items-center">
                <span>{localizedName}</span>
                <Text type="secondary" style={{fontSize:10}}>{l.key}</Text>
              </div>
            </Option>
          );
        })}
      </OptGroup>
    ));
  };

  return (
    <Modal
      title={editingProduct ? t('products.edit.title_edit') : t('products.edit.title_add')}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      width={600}
      destroyOnHidden
      styles={{ body: { padding: '8px 0' } }}
      centered
    >
      <Form form={form} layout="vertical" className="px-6 max-h-[70vh] overflow-y-auto overflow-x-hidden">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              label={<Space><RobotOutlined className="text-blue-500"/> {t('products.edit.id_label')}</Space>} 
              name="id" 
              rules={[{required:true, message:t('common.validation.required')}]}
              tooltip={t('products.edit.id_help')}
            >
              <Input variant="filled" disabled style={{ color: '#666', fontWeight: 'bold' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('products.edit.name_label')} name="name" rules={[{required:true, message:t('common.validation.required')}]}>
              <Input placeholder={t('products.edit.name_placeholder')}/>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={t('products.edit.price_label')} name="price" rules={[{required:true, message:t('common.validation.required')}]}>
              <InputNumber className="w-full" precision={2}/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('products.edit.currency_label')} name="currency" initialValue="CNY">
              <Select options={CURRENCY_OPTIONS}/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('products.edit.cycle_label')} name="interval" initialValue="month">
              <Select options={[
                {value:'month',label:t('products.cycles.month')},
                {value:'year',label:t('products.cycles.year')},
                {value:'forever',label:t('products.cycles.forever')}
              ]}/>
            </Form.Item>
          </Col>
        </Row>

        <Divider plain><Text type="secondary" style={{fontSize:11}}>{t('products.edit.platform_bind')}</Text></Divider>
        
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
                      <Form.Item name={p.idField} noStyle rules={[{ required: active, message: t('common.validation.required') }]}>
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

        <Divider plain><Text type="secondary" style={{fontSize:11}}>{t('products.edit.features_title')}</Text></Divider>
        
        <Form.Item noStyle shouldUpdate={(prev, curr) => prev.features !== curr.features}>
          {() => (
            <Form.List name="features">
              {(fields, { add, remove }) => {
                const featuresValue = form.getFieldValue('features') || [];
                const allSelectedKeys = featuresValue.map((f:any) => f?.key).filter(Boolean) || [];
                
                const readyFields: Record<string, any[]> = {};
                const pendingFields: any[] = [];
                
                fields.forEach((field) => {
                  const val = featuresValue[field.name];
                  const selectedKey = val?.key;
                  if (!selectedKey) {
                    pendingFields.push(field);
                  } else {
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
                          <Space>
                            <TagOutlined className="text-gray-400"/>
                            <Text strong style={{fontSize:12}}>{CATEGORY_MAP[catKey]?.label || t('products.edit.feature_category.other')}</Text>
                          </Space>
                          <Tag color={CATEGORY_MAP[catKey]?.color} style={{margin:0, fontSize:10}}>{catFields.length} {t('common.unit_items')}</Tag>
                        </div>
                        <div className="p-1 space-y-1">
                          {catFields.map((field) => {
                            const { key, ...restField } = field;
                            return (
                              <div key={key} className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded transition-colors group">
                                <Form.Item {...restField} name={[field.name, 'key']} noStyle>
                                  <Select 
                                    showSearch 
                                    variant="borderless" 
                                    className="flex-1" 
                                    size="small" 
                                    optionFilterProp="label"
                                  >
                                    {renderOptions(featureLibrary, allSelectedKeys.filter(k => k !== form.getFieldValue(['features', field.name, 'key'])))}
                                  </Select>
                                </Form.Item>
                                <DeleteOutlined 
                                  className="text-gray-300 hover:text-red-500 cursor-pointer transition-opacity" 
                                  onClick={() => remove(field.name)} 
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {pendingFields.length > 0 && (
                      <div className="border border-blue-200 rounded-lg bg-blue-50/30 p-3 border-dashed">
                        <div className="mb-2 flex items-center gap-2">
                          <InfoCircleOutlined className="text-blue-400"/>
                          <Text type="secondary" strong style={{fontSize:12}}>{t('products.edit.configuring_new', { defaultValue: '正在配置新权益...' })}</Text>
                        </div>
                        <div className="space-y-2">
                          {pendingFields.map((field) => {
                            const { key, ...restField } = field;
                            return (
                              <div key={key} className="flex items-center gap-2 bg-white p-2 rounded shadow-sm border border-blue-100">
                                <Form.Item {...restField} name={[field.name, 'key']} noStyle rules={[{required:true, message:t('common.select_feature')}]}>
                                  <Select 
                                    placeholder={t('common.select_feature')} 
                                    showSearch 
                                    className="flex-1" 
                                    optionFilterProp="label"
                                  >
                                    {renderOptions(featureLibrary, allSelectedKeys)}
                                  </Select>
                                </Form.Item>
                                <DeleteOutlined 
                                  className="text-red-300 hover:text-red-500 cursor-pointer" 
                                  onClick={() => remove(field.name)} 
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {fields.length === 0 && (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('products.edit.no_features')} className="my-4"/>
                    )}
                    
                    <Button 
                      type="dashed" 
                      block 
                      icon={<PlusOutlined />} 
                      onClick={() => {
                        if (fields.length >= featureLibrary.length) {
                          message.warning(t('products.edit.features_full'));
                          return;
                        }
                        add();
                      }}
                      style={{ height: 40, borderRadius: 8 }}
                    >
                      {t('products.edit.add_feature')}
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
