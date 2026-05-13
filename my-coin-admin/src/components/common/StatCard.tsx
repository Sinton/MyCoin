import React from 'react';
import { Card, Typography, Space, Tag, Skeleton } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

export interface StatCardProps {
  title: string;
  value: string | number | React.ReactNode;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  color,
  loading = false,
}) => {
  const { t } = useTranslation();
  const displayLabel = changeLabel || t('common.comparison.vs_last_week');

  return (
    <Card variant="outlined" hoverable style={{ height: '100%' }}>
      {loading ? (
        <Skeleton active paragraph={{ rows: 1 }} />
      ) : (
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Text type="secondary" style={{ fontSize: 14 }}>{title}</Text>
            <div className="text-2xl font-bold mt-2">{value}</div>
            {change !== undefined && (
              <div className="mt-2">
                <Tag color={change >= 0 ? 'success' : 'error'} bordered={false}>
                  {change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  <span className="ml-1">{Math.abs(change)}%</span>
                </Tag>
                <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>{displayLabel}</Text>
              </div>
            )}
          </div>
          <div 
            className="p-3 rounded-lg" 
            style={{ 
              backgroundColor: `${color}10`, 
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {React.isValidElement(icon) 
              ? React.cloneElement(icon as React.ReactElement, { style: { fontSize: 24 } }) 
              : icon
            }
          </div>
        </div>
      )}
    </Card>
  );
};

export default StatCard;
