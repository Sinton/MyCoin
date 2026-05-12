import React from 'react';
import { Card, Tabs, Space, Button, Skeleton } from 'antd';
import { 
  SettingOutlined, SafetyCertificateOutlined, 
  ReloadOutlined, InfoCircleOutlined, SaveOutlined 
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/common/PageHeader';
import GeneralSettings from './components/GeneralSettings';
import DeveloperSettings from './components/DeveloperSettings';
import AboutSystem from './components/AboutSystem';
import { useSettings } from './hooks/useSettings';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const { settings, isLoading, isSaving, isDirty, actions } = useSettings();

  const items = [
    {
      key: 'general',
      label: <Space><SettingOutlined />{t('settings.tabs.general')}</Space>,
      children: (
        <GeneralSettings 
          data={settings?.general} 
          onUpdate={actions.updateLocalSettings} 
        />
      )
    },
    {
      key: 'developer',
      label: <Space><SafetyCertificateOutlined />{t('settings.tabs.developer')}</Space>,
      children: (
        <DeveloperSettings 
          data={settings?.developer} 
          onResetSecret={actions.handleResetSecret}
          onCopy={actions.copySecret}
          onUpdate={actions.updateLocalSettings}
        />
      )
    },
    {
      key: 'about',
      label: <Space><InfoCircleOutlined />{t('settings.tabs.about')}</Space>,
      children: <AboutSystem data={settings?.about} />
    }
  ];

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader 
        title={t('settings.title')}
        subtitle={t('settings.subtitle')}
        extra={
          <>
            {isDirty && (
              <Button icon={<ReloadOutlined />} onClick={actions.handleCancel}>
                {t('common.cancel')}
              </Button>
            )}
            <Button 
              type="primary" 
              loading={isSaving}
              disabled={!isDirty}
              onClick={actions.handleSave} 
              icon={<SaveOutlined />}
            >
              {t('common.save')}
            </Button>
          </>
        }
      />

      <Card variant="outlined" className="overflow-hidden" styles={{ body: { padding: 0 } }}>
        {isLoading ? (
          <div className="p-8"><Skeleton active /></div>
        ) : (
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
        )}
      </Card>
    </div>
  );
};

export default Settings;
