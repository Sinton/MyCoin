import React from 'react';
import { Typography, Space, Divider } from 'antd';

const { Title, Text } = Typography;

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
  stats?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  extra,
  stats
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
      <div>
        <Title level={2} style={{ margin: 0, marginBottom: 4 }}>{title}</Title>
        {subtitle && <Text type="secondary">{subtitle}</Text>}
        {stats && (
          <div className="mt-2">
             <Space split={<Divider type="vertical" />}>
                {stats}
             </Space>
          </div>
        )}
      </div>
      {extra && (
        <Space size="small">
          {extra}
        </Space>
      )}
    </div>
  );
};

export default PageHeader;
