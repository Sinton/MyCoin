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
  productDescription: string;
}

const ProductLocalizationModal: React.FC<ProductLocalizationModalProps> = ({ 
  open, 
  onCancel, 
  onSave, 
  initialLocales = [],
  productName,
  productDescription
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const LANG_ORDER = ['zh_CN', 'zh_TW', 'en_US', 'ja_JP', 'ko_KR'];

  const LANG_OPTIONS = [
    { value: 'zh_CN', label: '简体中文' },
    { value: 'zh_TW', label: '繁體中文' },
    { value: 'en_US', label: 'English' },
    { value: 'ja_JP', label: '日本語' },
    { value: 'ko_KR', label: '한국어' },
  ];

  useEffect(() => {
    if (open) {
      // 自动补齐并排序：确保 5 种语言都在列表中且顺序一致
      const fullLocales = LANG_ORDER.map(lang => {
        const existing = initialLocales.find(l => l.lang === lang);
        if (existing) return existing;
        
        // 如果是简体中文且没有配置过，则默认使用产品的主名称和描述
        if (lang === 'zh_CN') {
          return { lang, name: productName, description: productDescription };
        }
        
        return { lang, name: '', description: '' };
      });
      form.setFieldsValue({ locales: fullLocales });
    }
  }, [open, initialLocales, form, productName, productDescription]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // 过滤掉名称为空的项，只保存有效翻译
      const validLocales = (values.locales || []).filter((l: any) => l.name?.trim());
      onSave(validLocales);
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
          {(fields) => (
            <Table
              dataSource={fields}
              pagination={false}
              className="mb-4"
              rowKey="key"
              columns={[
                {
                  title: t('products.localization.columns.lang'),
                  dataIndex: 'lang',
                  width: 150,
                  render: (_, field) => {
                    const langCode = form.getFieldValue(['locales', field.name, 'lang']);
                    const langLabel = LANG_OPTIONS.find(o => o.value === langCode)?.label || langCode;
                    return (
                      <Form.Item name={[field.name, 'lang']} noStyle>
                        <Text strong>{langLabel}</Text>
                      </Form.Item>
                    );
                  }
                },
                {
                  title: t('products.localization.columns.name'),
                  dataIndex: 'name',
                  render: (_, field) => (
                    <Form.Item 
                      name={[field.name, 'name']} 
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
                    <Form.Item name={[field.name, 'description']} noStyle>
                      <Input.TextArea 
                        placeholder={t('products.localization.placeholders.desc')} 
                        autoSize={{ minRows: 1, maxRows: 3 }} 
                        size="small"
                      />
                    </Form.Item>
                  )
                }
              ]}
            />
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default ProductLocalizationModal;
