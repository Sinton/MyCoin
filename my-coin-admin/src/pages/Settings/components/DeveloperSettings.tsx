import React from 'react';
import { Typography, Card, Form, Space, Input, Button, Tooltip, List, Switch } from 'antd';
import { CopyOutlined, ReloadOutlined, InfoCircleOutlined, BugOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <section>
        <Title level={5}>{t('settings.tabs.developer')}</Title>
        <Card variant="outlined" size="small">
          <Form layout="vertical" className="mt-2">
            <Form.Item 
              label={t('settings.developer.secret_label')} 
              tooltip={t('settings.developer.secret_help')}
              style={{ marginBottom: 16 }}
            >
              <Space.Compact className="w-full">
                <Input.Password value={data?.webhookSecret} readOnly />
                <Button icon={<CopyOutlined />} onClick={() => onCopy(data?.webhookSecret)} />
                <Button danger icon={<ReloadOutlined />} onClick={onResetSecret}>
                  {t('settings.developer.reset_secret')}
                </Button>
              </Space.Compact>
            </Form.Item>
            <Form.Item label={t('settings.developer.api_label')} style={{ marginBottom: 0 }}>
              <Input 
                value={data?.apiEndpoint} 
                readOnly 
                suffix={<Tooltip title={t('settings.developer.secret_help')}><InfoCircleOutlined /></Tooltip>} 
              />
            </Form.Item>
          </Form>
        </Card>
      </section>
      
      <section>
        <Title level={5}>{t('settings.developer.sandbox_label')}</Title>
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
                title={<Space><BugOutlined /> {t('settings.developer.sandbox_label')}</Space>} 
                description={t('settings.developer.sandbox_help')} 
              />
            </List.Item>
          </List>
        </Card>
      </section>
    </div>
  );
};

export default DeveloperSettings;
