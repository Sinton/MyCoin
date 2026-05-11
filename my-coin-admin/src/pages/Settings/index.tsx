import React from 'react';
import { 
  Typography, Card, Space, Select, Divider, App as AntdApp, 
  Tabs, Form, Switch, Input, Button, List, Badge, Tooltip
} from 'antd';
import { 
  SettingOutlined, SafetyCertificateOutlined, 
  CopyOutlined, ReloadOutlined, 
  InfoCircleOutlined, RocketOutlined, BugOutlined
} from '@ant-design/icons';
import { useConfig } from '../../context/ConfigContext';
import PageHeader from '../../components/common/PageHeader';

const { Title, Text } = Typography;

const Settings: React.FC = () => {
  const { previewLang, setPreviewLang } = useConfig();
  const { message, modal } = AntdApp.useApp();
  
  const handleSave = () => {
    message.success('配置已成功保存并实时生效');
  };

  const handleResetSecret = () => {
    modal.confirm({
      title: '重置 Webhook 密钥？',
      content: '重置后，现有的 Webhook 验证将失效，您需要同步更新生产环境的验证逻辑。',
      okText: '确定重置',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        message.loading('正在重置...');
        setTimeout(() => message.success('密钥重置成功'), 1000);
      }
    });
  };

  const items = [
    {
      key: 'general',
      label: <Space><SettingOutlined />通用设置</Space>,
      children: (
        <div className="space-y-6">
          <section>
            <Title level={5}>显示与预览</Title>
            <Card variant="outlined" size="small">
              <List itemLayout="horizontal">
                <List.Item
                  actions={[
                    <Select 
                      key="lang"
                      value={previewLang} 
                      onChange={setPreviewLang} 
                      style={{ width: 160 }}
                      options={[
                        { value: 'master', label: '系统主名称' },
                        { value: 'zh_CN', label: '简体中文' },
                        { value: 'en_US', label: '英语 (US)' },
                        { value: 'ja_JP', label: '日语' },
                      ]}
                    />
                  ]}
                >
                  <List.Item.Meta
                    title="全局预览语言"
                    description="设置订阅套餐、权益清单在所有页面中的默认显示语言"
                  />
                </List.Item>
                <List.Item
                  actions={[<Switch key="compact" defaultChecked />]}
                >
                  <List.Item.Meta
                    title="紧凑模式"
                    description="减少页面元素间距，在小屏幕上显示更多内容"
                  />
                </List.Item>
              </List>
            </Card>
          </section>

          <section>
            <Title level={5}>系统通知</Title>
            <Card variant="outlined" size="small">
              <List itemLayout="horizontal">
                <List.Item actions={[<Switch key="email" defaultChecked />]}>
                  <List.Item.Meta title="异常告警邮件" description="当 Webhook 处理失败超过阈值时发送通知" />
                </List.Item>
                <List.Item actions={[<Switch key="browser" />]}>
                  <List.Item.Meta title="浏览器通知" description="开启实时订单成交的桌面推送" />
                </List.Item>
              </List>
            </Card>
          </section>
        </div>
      )
    },
    {
      key: 'developer',
      label: <Space><SafetyCertificateOutlined />开发者选项</Space>,
      children: (
        <div className="space-y-6">
          <section>
            <Title level={5}>API 安全</Title>
            <Card variant="outlined" size="small">
              <Form layout="vertical" className="mt-2">
                <Form.Item 
                  label="Webhook 验证密钥 (Secret)" 
                  tooltip="用于校验从 App Store / Google Play 发来的通知合法性"
                  style={{ marginBottom: 16 }}
                >
                  <Space.Compact className="w-full">
                    <Input.Password value="sk_test_51MzS2yLpXvQ9..." readOnly />
                    <Button icon={<CopyOutlined />} onClick={() => message.success('密钥已复制')} />
                    <Button danger icon={<ReloadOutlined />} onClick={handleResetSecret}>重置</Button>
                  </Space.Compact>
                </Form.Item>
                <Form.Item label="API 终端地址" style={{ marginBottom: 0 }}>
                  <Input value="https://api.mycoin.com/v1/webhooks" readOnly suffix={<Tooltip title="生产环境地址不可更改"><InfoCircleOutlined /></Tooltip>} />
                </Form.Item>
              </Form>
            </Card>
          </section>
          
          <section>
            <Title level={5}>调试模式</Title>
            <Card variant="outlined" size="small">
              <List itemLayout="horizontal">
                <List.Item actions={[<Switch key="debug" />]}>
                  <List.Item.Meta 
                    title={<Space><BugOutlined /> 详细日志模式</Space>} 
                    description="开启后将记录所有 Webhook 的完整 Headers 信息，生产环境建议关闭" 
                  />
                </List.Item>
              </List>
            </Card>
          </section>
        </div>
      )
    },
    {
      key: 'about',
      label: <Space><InfoCircleOutlined />关于系统</Space>,
      children: (
        <Card variant="borderless" className="bg-gray-50">
          <div className="flex flex-col items-center py-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-sm">
              MC
            </div>
            <Title level={4} style={{ marginBottom: 4 }}>MyCoin Admin Pro</Title>
            <Text type="secondary" className="mb-6">版本 v1.2.4 (Build 20260511)</Text>
            
            <Divider plain>系统环境</Divider>
            
            <Space split={<Divider type="vertical" />}>
              <Badge status="success" text="生产环境 (Production)" />
              <Text type="secondary">React 18.2</Text>
              <Text type="secondary">Ant Design 5.29</Text>
            </Space>
            
            <div className="mt-8 text-center text-gray-400 text-xs">
              © 2026 MyCoin. All rights reserved.
            </div>
          </div>
        </Card>
      )
    }
  ];

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader 
        title="系统设置"
        subtitle="配置管理后台的全局偏好、开发者权限及系统行为"
        extra={
          <>
            <Button icon={<ReloadOutlined />}>取消修改</Button>
            <Button type="primary" onClick={handleSave} icon={<RocketOutlined />}>保存配置</Button>
          </>
        }
      />

      <Card variant="outlined" className="overflow-hidden" styles={{ body: { padding: 0 } }}>
        <Tabs
          tabPosition="left"
          className="min-h-[500px]"
          items={items}
          style={{ height: '100%' }}
          tabBarStyle={{ 
            width: 180, 
            background: '#fafafa', 
            borderRight: '1px solid #f0f0f0',
            paddingTop: 16
          }}
        />
      </Card>
    </div>
  );
};

export default Settings;
