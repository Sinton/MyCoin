import React from 'react';
import { Typography, Card, List, Select, Switch } from 'antd';
import { useConfigStore } from '@/store';

const { Title } = Typography;

interface GeneralSettingsProps {
  data?: any;
  onUpdate: (path: string, value: any) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ data, onUpdate }) => {
  const { previewLang, setPreviewLang } = useConfigStore();

  const handleLangChange = (val: string) => {
    setPreviewLang(val);
    onUpdate('general.previewLang', val);
  };

  return (
    <div className="space-y-6">
      <section>
        <Title level={5}>显示与预览</Title>
        <Card variant="outlined" size="small">
          <List itemLayout="horizontal">
            <List.Item
              actions={[
                <Select 
                  key="lang"
                  value={data?.previewLang || previewLang} 
                  onChange={handleLangChange} 
                  style={{ width: 120 }}
                  options={[
                    { value: 'master', label: '系统默认' },
                    { value: 'zh_CN', label: '简体中文' },
                    { value: 'zh_TW', label: '繁体中文' },
                    { value: 'en_US', label: '英语' },
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
              actions={[
                <Switch 
                  key="compact" 
                  checked={data?.compactMode} 
                  onChange={(val) => onUpdate('general.compactMode', val)} 
                />
              ]}
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
            <List.Item actions={[
              <Switch 
                key="email" 
                checked={data?.emailAlert} 
                onChange={(val) => onUpdate('general.emailAlert', val)}
              />
            ]}>
              <List.Item.Meta title="异常告警邮件" description="当 Webhook 处理失败超过阈值时发送通知" />
            </List.Item>
            <List.Item actions={[
              <Switch 
                key="browser" 
                checked={data?.browserNotification} 
                onChange={(val) => onUpdate('general.browserNotification', val)}
              />
            ]}>
              <List.Item.Meta title="浏览器通知" description="开启实时订单成交的桌面推送" />
            </List.Item>
          </List>
        </Card>
      </section>
    </div>
  );
};

export default GeneralSettings;
