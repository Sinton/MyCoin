import React from 'react';
import { Drawer, Space, Button, Descriptions, Tag, Badge, Divider, Empty, Typography } from 'antd';
import { InfoCircleOutlined, CopyOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
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
  return (
    <Drawer
      title={<Space><InfoCircleOutlined className="text-blue-500" /> Webhook 报文详情</Space>}
      placement="right"
      onClose={onClose}
      open={open}
      width={window.innerWidth < 1200 ? '90%' : 600}
      footer={
        <div className="flex justify-end gap-3 py-2 px-1">
          <Button onClick={onClose}>关闭详情</Button>
          <Button 
            type="primary" 
            icon={<CopyOutlined />} 
            onClick={() => onCopy(selectedLog?.payload || '')}
          >
            复制完整报文
          </Button>
        </div>
      }
    >
      {selectedLog ? (
        <div className="space-y-6">
          <Descriptions bordered column={2} size="small" layout="vertical">
            <Descriptions.Item label="通知 ID">{selectedLog.id}</Descriptions.Item>
            <Descriptions.Item label="事件类型">
              <Tag color="blue" bordered={false}>{selectedLog.event}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="接收时间">{selectedLog.time}</Descriptions.Item>
            <Descriptions.Item label="处理结果">
              <Badge 
                status={selectedLog.status === 'success' ? 'success' : 'error'} 
                text={selectedLog.status === 'success' ? '成功' : '失败'} 
              />
            </Descriptions.Item>
          </Descriptions>

          <Divider orientation="left" plain>
            <Space><ClockCircleOutlined /> 请求载荷 (Payload)</Space>
          </Divider>
          <div className="relative group">
            <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-auto text-xs leading-relaxed max-h-[400px]">
              {selectedLog.payload}
            </pre>
          </div>

          <Divider orientation="left" plain>
            <Space><CheckCircleOutlined /> 系统响应 (Response)</Space>
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
