import React from 'react';
import { Typography, Card, List, Select, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import { useConfigStore } from '@/store';

const { Title } = Typography;

interface GeneralSettingsProps {
  data?: any;
  onUpdate: (path: string, value: any) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ data, onUpdate }) => {
  const { t } = useTranslation();
  const { previewLang, setPreviewLang } = useConfigStore();

  const handleLangChange = (val: string) => {
    setPreviewLang(val);
    onUpdate('general.previewLang', val);
  };

  return (
    <div className="space-y-6">
      <section>
        <Title level={5}>{t('settings.tabs.general')}</Title>
        <Card variant="outlined" size="small">
          <List itemLayout="horizontal">
            <List.Item
              actions={[
                <Select 
                  key="lang"
                  value={data?.previewLang || previewLang} 
                  onChange={handleLangChange} 
                  style={{ width: 140 }}
                  options={[
                    { value: 'master', label: t('settings.general.default_lang') },
                    { value: 'zh_CN', label: '简体中文' },
                    { value: 'zh_TW', label: '繁体中文' },
                    { value: 'en_US', label: 'English' },
                    { value: 'ja_JP', label: '日本語' },
                  ]}
                />
              ]}
            >
              <List.Item.Meta
                title={t('settings.general.lang_label')}
                description={t('settings.general.lang_help')}
              />
            </List.Item>
            <List.Item
              actions={[
                <Switch 
                  key="auto_refresh" 
                  checked={data?.autoRefresh} 
                  onChange={(val) => onUpdate('general.autoRefresh', val)} 
                />
              ]}
            >
              <List.Item.Meta
                title={t('settings.general.refresh_label')}
                description={t('settings.general.refresh_help')}
              />
            </List.Item>
          </List>
        </Card>
      </section>

      <section>
        <Title level={5}>{t('settings.general.notifications')}</Title>
        <Card variant="outlined" size="small">
          <List itemLayout="horizontal">
            <List.Item actions={[
              <Switch 
                key="email" 
                checked={data?.emailAlert} 
                onChange={(val) => onUpdate('general.emailAlert', val)}
              />
            ]}>
              <List.Item.Meta title={t('settings.general.email_label')} description={t('settings.general.email_help')} />
            </List.Item>
            <List.Item actions={[
              <Switch 
                key="browser" 
                checked={data?.browserNotification} 
                onChange={(val) => onUpdate('general.browserNotification', val)}
              />
            ]}>
              <List.Item.Meta title={t('settings.general.browser_label')} description={t('settings.general.browser_help')} />
            </List.Item>
          </List>
        </Card>
      </section>
    </div>
  );
};

export default GeneralSettings;
