import React from 'react';
import { Typography, Space, Divider, Button } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
  stats?: React.ReactNode;
  onExport?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  extra,
  stats,
  onExport,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
      {/* 左侧标题区 */}
      <div>
        <Title level={2} className="!m-0 !mb-1">{title}</Title>
        {subtitle && <Text type="secondary" className="text-sm">{subtitle}</Text>}
        {stats && (
          <div className="mt-2">
            <Space split={<Divider type="vertical" />}>
              {stats}
            </Space>
          </div>
        )}
      </div>

      {/* 右侧操作区 */}
      <Space size="small" wrap>
        {onExport && (
          <Button icon={<ExportOutlined />} onClick={onExport}>
            {t('common.export')}
          </Button>
        )}
        {extra}
      </Space>
    </div>
  );
};

export default PageHeader;
