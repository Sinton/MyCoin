import React from 'react';
import { 
  Card, List, Badge, Typography, Button, 
  Space, Tag, Empty, Tabs, Popconfirm
} from 'antd';
import { 
  ShoppingCartOutlined, 
  NotificationOutlined, BugOutlined,
  DeleteOutlined, EyeOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import 'dayjs/locale/ja';

import PageHeader from '@/components/common/PageHeader';
import { useNotifications } from './hooks/useNotifications';

// 启用相对时间插件
dayjs.extend(relativeTime);

const { Text } = Typography;

const Notifications: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { 
    notifications, filteredData, isLoading, activeTab, setActiveTab, actions 
  } = useNotifications();

  // 根据当前语言设置 dayjs 区域
  const getDayjsLocale = (lang: string) => {
    switch (lang) {
      case 'zh_CN': return 'zh-cn';
      case 'ja_JP': return 'ja';
      default: return 'en';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCartOutlined className="text-blue-500" />;
      case 'alert': return <BugOutlined className="text-red-500" />;
      default: return <NotificationOutlined className="text-orange-500" />;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader 
        title={t('notifications.title')}
        subtitle={t('notifications.subtitle')}
        extra={
          <Space>
            <Button 
              icon={<DeleteOutlined />} 
              onClick={actions.markAllRead}
              disabled={actions.isAllRead}
            >
              {t('notifications.mark_all_read')}
            </Button>
            <Popconfirm title={t('notifications.clear_confirm')} okText={t('common.confirm')} cancelText={t('common.cancel')}>
              <Button danger icon={<DeleteOutlined />}>{t('notifications.clear_all')}</Button>
            </Popconfirm>
          </Space>
        }
      />

      <Card 
        variant="outlined"
        styles={{ body: { padding: 0 } }}
        title={
          <Tabs 
            activeKey={activeTab}
            onChange={setActiveTab}
            className="mb-[-16px]"
            items={[
              { key: 'all', label: `${t('notifications.tabs.all')} (${notifications.length})` },
              { key: 'unread', label: `${t('notifications.tabs.unread')} (${notifications.filter(n => !n.read).length})` },
              { key: 'order', label: t('notifications.tabs.order') },
              { key: 'alert', label: t('notifications.tabs.alert') },
              { key: 'system', label: t('notifications.tabs.system') },
            ]}
          />
        }
      >
        <List
          loading={isLoading}
          dataSource={filteredData}
          size="large"
          className="px-6"
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('notifications.empty')} /> }}
          renderItem={(item) => (
            <List.Item 
              className={`hover:bg-gray-50/50 transition-colors px-4 rounded-xl my-2 border-none ${!item.read ? 'bg-blue-50/20' : ''}`}
              actions={[
                !item.read ? (
                  <Button type="link" onClick={() => actions.markRead(item.id)}>{t('notifications.mark_read')}</Button>
                ) : <Text type="secondary" className="text-xs">{t('notifications.already_read')}</Text>,
                <Button icon={<EyeOutlined />} type="text">{t('common.more')}</Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <div className={`p-3 rounded-full ${item.read ? 'bg-gray-100' : 'bg-white shadow-md'}`}>
                    {React.cloneElement(getIcon(item.type) as React.ReactElement, { style: { fontSize: 20 } })}
                  </div>
                }
                title={
                  <Space align="center">
                    <Text strong={!item.read} className="text-sm">
                      {(item.titles && item.titles[i18n.language]) || item.title}
                    </Text>
                    {!item.read && <Badge status="processing" />}
                    {item.priority === 'high' && <Tag color="error">{t('notifications.high_priority')}</Tag>}
                  </Space>
                }
                description={
                  <div className="mt-1">
                    <div className={`text-xs ${item.read ? 'text-gray-400' : 'text-gray-600'}`}>
                      {(item.contents && item.contents[i18n.language]) || item.content}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-2">
                      {dayjs(item.timestamp).locale(getDayjsLocale(i18n.language)).fromNow()}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
        <div className="py-8 text-center border-t border-gray-100">
          <Text type="secondary" className="text-xs">{t('notifications.history_tip')}</Text>
        </div>
      </Card>
    </div>
  );
};

export default Notifications;
