import React from 'react';
import { Drawer, Space, Button, Descriptions, Tag, Badge, Divider, Empty, Typography } from 'antd';
import { InfoCircleOutlined, CopyOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { WebhookLog } from '@/types';

const { Text } = Typography;

interface WebhookDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedLog: WebhookLog | null;
  onCopy: (text: string) => void;
}

const WebhookDetailDrawer: React.FC<WebhookDetailDrawerProps> = ({
  open,
  onClose,
  selectedLog,
  onCopy
}) => {
  const { t } = useTranslation();
  return (
    <Drawer
      title={<Space><InfoCircleOutlined className="text-blue-500" /> {t('webhooks.detail_title')}</Space>}
      placement="right"
      onClose={onClose}
      open={open}
      width={window.innerWidth < 1200 ? '90%' : 600}
      footer={
        <div className="flex justify-end gap-3 py-2 px-1">
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button 
            type="primary" 
            icon={<CopyOutlined />} 
            onClick={() => onCopy(selectedLog?.payload || '')}
          >
            {t('webhooks.copy_payload')}
          </Button>
        </div>
      }
    >
      {selectedLog ? (
        <div className="space-y-6">
          <Descriptions bordered column={2} size="small" layout="vertical">
            <Descriptions.Item label={t('webhooks.columns.id')}>{selectedLog.id}</Descriptions.Item>
            <Descriptions.Item label={t('webhooks.columns.event')}>
              <Tag color="blue" bordered={false}>{selectedLog.event}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('webhooks.columns.time')}>{selectedLog.time}</Descriptions.Item>
            <Descriptions.Item label={t('webhooks.columns.status')}>
              <Badge 
                status={selectedLog.status === 'success' ? 'success' : 'error'} 
                text={selectedLog.status === 'success' ? t('common.status.success') : t('common.status.error')} 
              />
            </Descriptions.Item>
          </Descriptions>

          <Divider orientation="left" plain>
            <Space><ClockCircleOutlined /> {t('webhooks.payload')}</Space>
          </Divider>
          <div className="relative group">
            <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-auto text-xs leading-relaxed max-h-[400px]">
              {selectedLog.payload}
            </pre>
          </div>

          <Divider orientation="left" plain>
            <Space><CheckCircleOutlined /> {t('webhooks.response')}</Space>
          </Divider>
          <div className="relative group">
            <pre className={`p-4 rounded-lg overflow-auto text-xs leading-relaxed ${selectedLog.status === 'failed' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
              {selectedLog.response}
            </pre>
          </div>
        </div>
      ) : <Empty />}
    </Drawer>
  );
};

export default WebhookDetailDrawer;
