import React from 'react';
import { Card, Space, List, Badge, Typography, Button } from 'antd';
import { HistoryOutlined, EllipsisOutlined, ShoppingCartOutlined, DashboardOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-tw';
import 'dayjs/locale/en';
import 'dayjs/locale/ja';
import { useTranslation } from 'react-i18next';
import { useConfigStore } from '@/store';

dayjs.extend(relativeTime);

// 语言映射表
const LOCALE_MAP: Record<string, string> = {
  zh_CN: 'zh-cn',
  zh_TW: 'zh-tw',
  en_US: 'en',
  ja_JP: 'ja',
  master: 'zh-cn', // 默认语种也可以设为英文
};

const { Text } = Typography;

interface RecentActivityListProps {
  activities: any[];
  isLoading: boolean;
  onMore?: () => void;
}

const RecentActivityList: React.FC<RecentActivityListProps> = ({
  activities,
  isLoading,
  onMore
}) => {
  const { t } = useTranslation();
  const { language } = useConfigStore();
  const locale = LOCALE_MAP[language] || 'en';

  return (
    <Card 
      title={<Space><HistoryOutlined /> {t('dashboard.recent_activity')}</Space>} 
      variant="outlined"
      extra={<Button type="link" icon={<EllipsisOutlined />} onClick={onMore} />}
    >
      <List
        loading={isLoading}
        dataSource={activities}
        renderItem={(item) => (
          <List.Item className="border-none py-3">
            <List.Item.Meta
              avatar={
                <div className={`w-9 h-9 flex items-center justify-center rounded-lg ${
                  item.type === 'order' ? 'bg-blue-50' : 
                  item.type === 'system' ? 'bg-purple-50' : 
                  'bg-green-50'
                }`}>
                  {item.type === 'order' ? (
                    <ShoppingCartOutlined className="text-blue-500 text-lg" />
                  ) : item.type === 'system' ? (
                    <DashboardOutlined className="text-purple-500 text-lg" />
                  ) : (
                    <UserOutlined className="text-green-500 text-lg" />
                  )}
                </div>
              }
              title={<span className="text-sm font-medium">{item.title}</span>}
              description={
                <Space size="middle">
                  <Text type="secondary" style={{ fontSize: 12 }}>{dayjs(item.time).locale(locale).fromNow()}</Text>
                  {item.status && (
                    <Badge 
                      status={item.status === 'success' ? 'success' : 'error'} 
                      text={item.status === 'success' ? t('common.status.success') : t('common.status.error')} 
                    />
                  )}
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RecentActivityList;
