import React, { useEffect } from 'react';
import { Modal, Form, Select, Input, Space, Typography, Button, App, Table, Empty } from 'antd';
import { GlobalOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;
const { Option } = Select;

interface LocalizationItem {
  lang: string;
  name: string;
  description: string;
}

interface ProductLocalizationModalProps {
  open: boolean;
  onCancel: () => void;
  onSave: (locales: LocalizationItem[]) => void;
  initialLocales?: LocalizationItem[];
  productName: string;
}

const ProductLocalizationModal: React.FC<ProductLocalizationModalProps> = ({ 
  open, 
  onCancel, 
  onSave, 
  initialLocales = [],
  productName
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const LANG_OPTIONS = [
    { value: 'zh_CN', label: '简体中文' },
    { value: 'zh_TW', label: '繁體中文' },
    { value: 'en_US', label: 'English' },
    { value: 'ja_JP', label: '日本語' },
    { value: 'ko_KR', label: '한국어' },
  ];

  useEffect(() => {
    if (open) {
      form.setFieldsValue({ locales: initialLocales });
    }
  }, [open, initialLocales, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSave(values.locales || []);
      message.success(t('common.copy_success'));
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <GlobalOutlined className="text-blue-500" />
          <span>{t('products.localization.title')} - {productName}</span>
        </Space>
      }
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      width={750}
      destroyOnHidden
      okText={t('common.confirm')}
    >
      <div className="mb-4 mt-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
        <Text type="secondary" style={{ fontSize: 12 }}>
          {t('products.localization.tip')}
        </Text>
      </div>

      <Form form={form} layout="vertical">
        <Form.List name="locales">
          {(fields, { add, remove }) => (
            <>
              <Table
                dataSource={fields}
                pagination={false}
                className="mb-4"
                rowKey="key"
                columns={[
                  {
                    title: t('products.localization.columns.lang'),
                    dataIndex: 'lang',
                    width: 180,
                    render: (_, field) => (
                      <Form.Item 
                        name={[field.name, 'lang']} 
                        rules={[{ required: true, message: t('common.validation.required') }]} 
                        noStyle
                      >
                        <Select placeholder={t('products.localization.columns.lang')} size="small">
                          {LANG_OPTIONS.map(opt => (
                            <Option key={opt.value} value={opt.value} disabled={
                              form.getFieldValue('locales')?.some((l: any, idx: number) => l?.lang === opt.value && idx !== field.name)
                            }>
                              {opt.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )
                  },
                  {
                    title: t('products.localization.columns.name'),
                    dataIndex: 'name',
                    render: (_, field) => (
                      <Form.Item 
                        name={[field.name, 'name']} 
                        rules={[{ required: true, message: t('common.validation.required') }]} 
                        noStyle
                      >
                        <Input placeholder={t('products.localization.placeholders.name')} size="small" />
                      </Form.Item>
                    )
                  },
                  {
                    title: t('products.localization.columns.desc'),
                    dataIndex: 'description',
                    render: (_, field) => (
                      <Form.Item 
                        name={[field.name, 'description']} 
                        noStyle
                      >
                        <Input.TextArea placeholder={t('products.localization.placeholders.desc')} autoSize={{ minRows: 1 }} size="small" />
                      </Form.Item>
                    )
                  },
                  {
                    title: t('common.more'),
                    width: 60,
                    render: (_, field) => (
                      <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(field.name)} size="small" />
                    )
                  }
                ]}
                locale={{ emptyText: <Empty description={t('products.localization.empty')} image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
              />
              <Button type="dashed" block icon={<PlusOutlined />} onClick={() => add()}>
                {t('products.localization.add_new')}
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default ProductLocalizationModal;
