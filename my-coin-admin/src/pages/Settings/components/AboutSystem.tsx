import React from 'react';
import { Card, Typography, Divider, Space, Badge } from 'antd';

const { Title, Text } = Typography;

interface AboutSystemProps {
  data?: any;
}

const AboutSystem: React.FC<AboutSystemProps> = ({ data }) => {
  return (
    <Card variant="borderless" className="bg-gray-50">
      <div className="flex flex-col items-center py-8">
        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-sm">
          MC
        </div>
        <Title level={4} style={{ marginBottom: 4 }}>MyCoin Admin Pro</Title>
        <Text type="secondary" className="mb-6">版本 {data?.version} (Build {data?.buildDate})</Text>
        
        <Divider plain>系统环境</Divider>
        
        <Space split={<Divider type="vertical" />}>
          <Badge status="success" text={`${data?.env} 环境`} />
          <Text type="secondary">React 18.2</Text>
          <Text type="secondary">Ant Design 5.29</Text>
        </Space>
        
        <div className="mt-8 text-center text-gray-400 text-xs">
          © 2026 MyCoin. All rights reserved.
        </div>
      </div>
    </Card>
  );
};

export default AboutSystem;
