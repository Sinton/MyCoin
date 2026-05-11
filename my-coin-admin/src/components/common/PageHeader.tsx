import { Typography, Space, Divider, Button } from 'antd';
import { ExportOutlined } from '@ant-design/icons';

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
  onExport
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
