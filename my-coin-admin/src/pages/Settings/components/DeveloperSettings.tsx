import React from 'react';
import { Typography, Card, Form, Space, Input, Button, Tooltip, List, Switch } from 'antd';
import { CopyOutlined, ReloadOutlined, InfoCircleOutlined, BugOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface DeveloperSettingsProps {
  data?: any;
  onResetSecret: () => void;
  onCopy: (text: string) => void;
  onUpdate: (path: string, value: any) => void;
}

const DeveloperSettings: React.FC<DeveloperSettingsProps> = ({ 
  data, 
  onResetSecret,
  onCopy,
  onUpdate
}) => {
  return (
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
                <Input.Password value={data?.webhookSecret} readOnly />
                <Button icon={<CopyOutlined />} onClick={() => onCopy(data?.webhookSecret)} />
                <Button danger icon={<ReloadOutlined />} onClick={onResetSecret}>重置</Button>
              </Space.Compact>
            </Form.Item>
            <Form.Item label="API 终端地址" style={{ marginBottom: 0 }}>
              <Input 
                value={data?.apiEndpoint} 
                readOnly 
                suffix={<Tooltip title="生产环境地址不可更改"><InfoCircleOutlined /></Tooltip>} 
              />
            </Form.Item>
          </Form>
        </Card>
      </section>
      
      <section>
        <Title level={5}>调试模式</Title>
        <Card variant="outlined" size="small">
          <List itemLayout="horizontal">
            <List.Item actions={[
              <Switch 
                key="debug" 
                checked={data?.debugMode} 
                onChange={(val) => onUpdate('developer.debugMode', val)}
              />
            ]}>
              <List.Item.Meta 
                title={<Space><BugOutlined /> 详细日志模式</Space>} 
                description="开启后将记录所有 Webhook 的完整 Headers 信息，生产环境建议关闭" 
              />
            </List.Item>
          </List>
        </Card>
      </section>
    </div>
  );
};

export default DeveloperSettings;
