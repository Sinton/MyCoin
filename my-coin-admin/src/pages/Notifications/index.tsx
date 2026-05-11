import React from 'react';
import { 
  Card, List, Badge, Typography, Button, 
  Space, Tag, Empty, Tabs, Popconfirm
} from 'antd';
import { 
  ShoppingCartOutlined, 
  NotificationOutlined, BugOutlined,
  CheckCircleOutlined, DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import PageHeader from '@/components/common/PageHeader';
import { useNotifications } from './hooks/useNotifications';

const { Text } = Typography;

const Notifications: React.FC = () => {
  const { 
    notifications, filteredData, isLoading, activeTab, setActiveTab, actions 
  } = useNotifications();

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
        title="系统通知中心"
        subtitle="查阅并管理全平台的业务变动、系统告警与操作日志"
        extra={
          <Space>
            <Button 
              icon={<CheckCircleOutlined />} 
              onClick={actions.markAllRead}
              disabled={actions.isAllRead}
            >
              全部标记已读
            </Button>
            <Popconfirm title="确定清空所有通知吗？">
              <Button danger icon={<DeleteOutlined />}>清空记录</Button>
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
              { key: 'all', label: `全部通知 (${notifications.length})` },
              { key: 'unread', label: `未读 (${notifications.filter(n => !n.read).length})` },
              { key: 'order', label: '订单动态' },
              { key: 'alert', label: '系统告警' },
              { key: 'system', label: '维护通知' },
            ]}
          />
        }
      >
        <List
          loading={isLoading}
          dataSource={filteredData}
          size="large"
          className="px-6"
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无符合条件的通知" /> }}
          renderItem={(item) => (
            <List.Item 
              className={`hover:bg-gray-50/50 transition-colors px-4 rounded-xl my-2 border-none ${!item.read ? 'bg-blue-50/20' : ''}`}
              actions={[
                !item.read ? (
                  <Button type="link" onClick={() => actions.markRead(item.id)}>标记已读</Button>
                ) : <Text type="secondary" className="text-xs">已阅读</Text>,
                <Button icon={<EyeOutlined />} type="text">查看详情</Button>
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
                    <Text strong={!item.read} className="text-sm">{item.title}</Text>
                    {!item.read && <Badge status="processing" />}
                    {item.priority === 'high' && <Tag color="error">高优先级</Tag>}
                  </Space>
                }
                description={
                  <div className="mt-1">
                    <div className={`text-sm ${item.read ? 'text-gray-400' : 'text-gray-600'}`}>{item.content}</div>
                    <div className="text-xs text-gray-400 mt-2">{item.time}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
        <div className="py-8 text-center border-t border-gray-100">
          <Text type="secondary" className="text-xs">已显示最近 30 天的通知记录</Text>
        </div>
      </Card>
    </div>
  );
};

export default Notifications;
