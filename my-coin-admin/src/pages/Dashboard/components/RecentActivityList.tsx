import React from 'react';
import { Card, Space, List, Badge, Typography, Button } from 'antd';
import { HistoryOutlined, EllipsisOutlined, ShoppingCartOutlined, DashboardOutlined, UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface RecentActivityListProps {
  activities: any[];
  isLoading: boolean;
}

const RecentActivityList: React.FC<RecentActivityListProps> = ({
  activities,
  isLoading
}) => {
  return (
    <Card 
      title={<Space><HistoryOutlined /> 最近系统动态</Space>} 
      variant="outlined"
      extra={<Button type="link" icon={<EllipsisOutlined />} />}
    >
      <List
        loading={isLoading}
        dataSource={activities}
        renderItem={(item) => (
          <List.Item className="border-none py-3">
            <List.Item.Meta
              avatar={
                <div className={`p-2 rounded-full ${item.type === 'order' ? 'bg-blue-50' : item.type === 'system' ? 'bg-purple-50' : 'bg-green-50'}`}>
                  {item.type === 'order' ? <ShoppingCartOutlined className="text-blue-500" /> : item.type === 'system' ? <DashboardOutlined className="text-purple-500" /> : <UserOutlined className="text-green-500" />}
                </div>
              }
              title={<span className="text-sm font-medium">{item.title}</span>}
              description={
                <Space size="middle">
                  <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
                  {item.status && <Badge status={item.status === 'success' ? 'success' : 'error'} text={item.status === 'success' ? '正常' : '异常'} />}
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
