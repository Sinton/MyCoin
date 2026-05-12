import React from 'react';
import { 
  Badge, Popover, List, Typography, 
  Button, Space, Tag, Empty, App 
} from 'antd';
import { 
  BellOutlined, ShoppingCartOutlined, 
  NotificationOutlined, BugOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getNotifications, 
  markNotificationRead, 
  markAllNotificationsRead 
} from '../../api/notifications';
import type { NotificationItem } from '../../mocks/data/notifications';

const { Text } = Typography;

const NotificationCenter: React.FC = () => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // --- 获取数据 ---
  const { data: res, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    refetchInterval: 30000, // 每30秒轮询一次
  });

  const notifications = res?.data || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  // --- 操作逻辑 ---
  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      message.success('已全部标记为已读');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'order': return <ShoppingCartOutlined className="text-blue-500" />;
      case 'alert': return <BugOutlined className="text-red-500" />;
      default: return <NotificationOutlined className="text-orange-500" />;
    }
  };

  const notificationList = (
    <div style={{ width: 320 }}>
      <div className="flex justify-between items-center mb-4 px-1">
        <Text strong style={{ fontSize: 16 }}>通知中心</Text>
        {unreadCount > 0 && (
          <Button 
            type="link" 
            size="small" 
            onClick={() => markAllReadMutation.mutate()}
            style={{ padding: 0 }}
          >
            全部已读
          </Button>
        )}
      </div>
      
      <div className="max-h-[400px] overflow-auto">
        <List
          loading={isLoading}
          dataSource={notifications}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无通知" /> }}
          renderItem={(item) => (
            <List.Item 
              className={`px-2 py-3 cursor-pointer transition-colors hover:bg-gray-50 rounded-lg mb-1 border-none ${!item.read ? 'bg-blue-50/30' : ''}`}
              onClick={() => !item.read && markReadMutation.mutate(item.id)}
            >
              <List.Item.Meta
                avatar={
                  <div className={`p-2 rounded-full ${item.read ? 'bg-gray-100' : 'bg-white shadow-sm'}`}>
                    {getIcon(item.type)}
                  </div>
                }
                title={
                  <div className="flex justify-between items-start">
                    <Text strong={!item.read} style={{ fontSize: 13 }}>{item.title}</Text>
                    {!item.read && item.priority === 'high' && <Tag color="error" bordered={false} style={{ fontSize: 10, margin: 0 }}>紧急</Tag>}
                  </div>
                }
                description={
                  <div className="mt-1">
                    <div className={`text-xs ${item.read ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.content}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">{item.time}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>
      
      <div className="border-t border-gray-100 mt-2 pt-2 text-center">
        <Button type="link" block size="small" onClick={() => navigate('/notifications')}>查看全部历史通知</Button>
      </div>
    </div>
  );

  return (
    <Popover 
      content={notificationList} 
      trigger="click" 
      placement="bottomRight"
      arrow={{ pointAtCenter: true }}
      overlayClassName="notification-popover"
    >
      <div className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center">
        <Badge count={unreadCount} size="small" offset={[2, 2]}>
          <BellOutlined style={{ fontSize: 20, color: '#595959' }} />
        </Badge>
      </div>
    </Popover>
  );
};

export default NotificationCenter;
