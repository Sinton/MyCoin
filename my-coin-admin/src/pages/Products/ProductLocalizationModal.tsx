import React, { useEffect } from 'react';
import { Modal, Form, Select, Input, Space, Typography, Button, App, Table, Empty } from 'antd';
import { GlobalOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

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

const LANG_OPTIONS = [
  { value: 'zh_CN', label: '简体中文 (中国)' },
  { value: 'zh_TW', label: '繁体中文 (中国台湾)' },
  { value: 'en_US', label: '英语 (美国)' },
  { value: 'ja_JP', label: '日语 (日本)' },
  { value: 'ko_KR', label: '韩语 (韩国)' },
];

const ProductLocalizationModal: React.FC<ProductLocalizationModalProps> = ({ 
  open, 
  onCancel, 
  onSave, 
  initialLocales = [],
  productName
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({ locales: initialLocales });
    }
  }, [open, initialLocales, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSave(values.locales || []);
      message.success(`${productName} 的本地化配置已更新`);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <GlobalOutlined className="text-blue-500" />
          <span>本地化多语言配置 - {productName}</span>
        </Space>
      }
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      width={750}
      destroyOnHidden
      okText="保存配置"
    >
      <div className="mb-4 mt-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
        <Text type="secondary" style={{ fontSize: 12 }}>
          配置该套餐在不同地区商店显示的名称和营销描述。如果不配置，客户端将默认显示主名称。
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
                    title: '目标语言',
                    dataIndex: 'lang',
                    width: 180,
                    render: (_, field) => (
                      <Form.Item 
                        name={[field.name, 'lang']} 
                        rules={[{ required: true, message: '选择语言' }]} 
                        noStyle
                      >
                        <Select placeholder="选择语言" size="small">
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
                    title: '展示名称',
                    dataIndex: 'name',
                    render: (_, field) => (
                      <Form.Item 
                        name={[field.name, 'name']} 
                        rules={[{ required: true, message: '输入名称' }]} 
                        noStyle
                      >
                        <Input placeholder="Region Name" size="small" />
                      </Form.Item>
                    )
                  },
                  {
                    title: '营销描述 (Description)',
                    dataIndex: 'description',
                    render: (_, field) => (
                      <Form.Item 
                        name={[field.name, 'description']} 
                        noStyle
                      >
                        <Input.TextArea placeholder="Region Description" autoSize={{ minRows: 1 }} size="small" />
                      </Form.Item>
                    )
                  },
                  {
                    title: '操作',
                    width: 60,
                    render: (_, field) => (
                      <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(field.name)} size="small" />
                    )
                  }
                ]}
                locale={{ emptyText: <Empty description="尚未添加任何本地化配置" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
              />
              <Button type="dashed" block icon={<PlusOutlined />} onClick={() => add()}>
                添加新的语言配置
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default ProductLocalizationModal;
