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
import 'dayjs/locale/ko';

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
      case 'ko_KR': return 'ko';
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
            <List.Item className="border-none py-3 px-4 hover:bg-gray-50 transition-colors rounded-xl group">
              <List.Item.Meta
                avatar={
                  <div className={`w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0 ${
                    item.type === 'order' ? 'bg-blue-50' : 
                    item.type === 'alert' ? 'bg-red-50' : 
                    'bg-orange-50'
                  }`}>
                    {React.cloneElement(getIcon(item.type) as React.ReactElement, { 
                      className: `${
                        item.type === 'order' ? 'text-blue-500' : 
                        item.type === 'alert' ? 'text-red-500' : 
                        'text-orange-500'
                      } text-lg` 
                    })}
                  </div>
                }
                title={
                  <div className="flex justify-between items-center">
                    <Space align="center" size={8}>
                      <span className={`text-sm ${!item.read ? 'font-bold' : 'font-medium text-gray-700'}`}>
                        {(item.titles && item.titles[i18n.language]) || item.title}
                      </span>
                      {!item.read && <Badge status="processing" color="blue" />}
                      {item.priority === 'high' && <Tag color="error" bordered={false} className="text-[10px] px-1 line-height-[14px]">{t('notifications.high_priority')}</Tag>}
                    </Space>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {!item.read && (
                        <Button type="link" size="small" className="h-auto p-0 text-xs" onClick={() => actions.markRead(item.id)}>
                          {t('notifications.mark_read')}
                        </Button>
                      )}
                    </div>
                  </div>
                }
                description={
                  <div className="flex justify-between items-end mt-0.5">
                    <Text type="secondary" style={{ fontSize: 12 }} className="line-clamp-1 flex-1 pr-4">
                      {(item.contents && item.contents[i18n.language]) || item.content}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11, opacity: 0.5 }} className="flex-shrink-0">
                      {dayjs(item.timestamp).locale(getDayjsLocale(i18n.language)).fromNow()}
                    </Text>
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
