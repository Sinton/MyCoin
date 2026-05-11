import React, { useState } from 'react';
import { 
  Table, Tag, Card, Typography, Space, Button, 
  Input, Row, Col, Statistic, Drawer, Descriptions,
  Tabs, Badge, Divider, App, Skeleton, Empty
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  SearchOutlined, ReloadOutlined, BugOutlined, 
  CheckCircleOutlined, 
  InfoCircleOutlined,
  CopyOutlined,
  HistoryOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getWebhookLogs, getWebhookStats } from '../api/webhooks';
import type { WebhookLog } from '../types';

const { Text } = Typography;

const WebhookContent: React.FC = () => {
  const { message } = App.useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');

  // --- 使用 React Query 获取数据 ---
  const { 
    data: logsRes, 
    isLoading: isLogsLoading, 
    refetch: refetchLogs,
    isRefetching: isLogsRefetching 
  } = useQuery({
    queryKey: ['webhookLogs'],
    queryFn: getWebhookLogs
  });

  const { data: statsRes, isLoading: isStatsLoading } = useQuery({
    queryKey: ['webhookStats'],
    queryFn: getWebhookStats
  });

  const logsData = logsRes?.data || [];
  const stats = statsRes?.data;

  // --- 过滤逻辑 ---
  const filteredData = logsData.filter(log => {
    const matchTab = activeTab === 'all' || (activeTab === 'success' && log.status === 'success') || (activeTab === 'failed' && log.status === 'failed');
    const matchSearch = log.id.toLowerCase().includes(searchText.toLowerCase()) || log.product.includes(searchText);
    return matchTab && matchSearch;
  });

  const showDetails = (log: WebhookLog) => {
    setSelectedLog(log);
    setDrawerOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('内容已复制到剪贴板');
  };

  const columns: ColumnsType<WebhookLog> = [
    {
      title: '通知 ID',
      dataIndex: 'id',
      key: 'id',
      width: 180,
      render: (id) => <Text code className="text-xs">{id}</Text>,
    },
    {
      title: '事件类型',
      dataIndex: 'event',
      key: 'event',
      render: (event) => {
        const colors: Record<string, string> = {
          SUBSCRIBED: 'blue',
          DID_RENEW: 'cyan',
          REFUND: 'orange',
          EXPIRED: 'magenta',
        };
        return <Tag color={colors[event] || 'default'} className="font-mono" bordered={false}>{event}</Tag>;
      },
    },
    {
      title: '产品标识',
      dataIndex: 'product',
      key: 'product',
      render: (text) => <Text type="secondary" style={{fontSize: 12}}>{text}</Text>
    },
    {
      title: '处理状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === 'success' ? 'success' : 'error'} 
          text={status === 'success' ? '已完成' : '失败'} 
        />
      ),
    },
    {
      title: '响应耗时',
      dataIndex: 'latency',
      key: 'latency',
      sorter: (a, b) => a.latency - b.latency,
      render: (ms) => (
        <Text type={ms > 500 ? 'danger' : 'secondary'} style={{fontSize: 12}}>
          {ms}ms
        </Text>
      )
    },
    {
      title: '接收时间',
      dataIndex: 'time',
      key: 'time',
      width: 170,
      render: (t) => <Text type="secondary" style={{fontSize: 12}}>{t}</Text>
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => showDetails(record)}>详情</Button>
      ),
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto p-4">
      {/* 状态统计 */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card variant="outlined">
            {isStatsLoading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
              <Statistic 
                title={<Space><HistoryOutlined /> 24H 通知总量</Space>} 
                value={stats?.total24h} 
                valueStyle={{ fontSize: 24, fontWeight: 600 }}
              />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card variant="outlined">
            {isStatsLoading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
              <Statistic 
                title={<Space><CheckCircleOutlined style={{ color: '#52c41a' }} /> 成功率</Space>} 
                value={stats?.successRate} 
                suffix="%" 
                valueStyle={{ fontSize: 24, fontWeight: 600, color: '#52c41a' }}
              />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card variant="outlined">
            {isStatsLoading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
              <Statistic 
                title={<Space><BugOutlined style={{ color: '#cf1322' }} /> 异常告警</Space>} 
                value={stats?.alertCount} 
                valueStyle={{ fontSize: 24, fontWeight: 600, color: '#cf1322' }} 
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* 过滤栏 */}
      <Card variant="outlined" className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            className="flex-1 mb-[-16px]"
            items={[
              { label: '全部记录', key: 'all' },
              { label: '处理成功', key: 'success' },
              { label: '处理失败', key: 'failed' },
            ]}
          />
          <Space wrap>
            <Input 
              placeholder="搜索通知 ID / 产品..." 
              prefix={<SearchOutlined />} 
              style={{ width: 280 }}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
            <Button 
              icon={<ReloadOutlined spin={isLogsRefetching} />} 
              onClick={() => refetchLogs()}
            >
              刷新
            </Button>
          </Space>
        </div>
      </Card>

      {/* 列表数据 */}
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        loading={isLogsLoading}
        size="middle"
        pagination={{ 
          pageSize: 15,
          showTotal: (total) => `共 ${total} 条日志`,
          showSizeChanger: true
        }} 
      />

      {/* 日志详情抽屉 */}
      <Drawer
        title={<Space><InfoCircleOutlined className="text-blue-500" /> Webhook 报文详情</Space>}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={window.innerWidth < 1200 ? '90%' : 800}
        footer={
          <div className="flex justify-end gap-3 py-2 px-1">
             <Button onClick={() => setDrawerOpen(false)}>关闭详情</Button>
             <Button type="primary" icon={<CopyOutlined />} onClick={() => copyToClipboard(selectedLog?.payload || '')}>
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
                <Badge status={selectedLog.status === 'success' ? 'success' : 'error'} text={selectedLog.status === 'success' ? '成功' : '失败'} />
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
    </div>
  );
};

const Webhooks: React.FC = () => (
  <App>
    <WebhookContent />
  </App>
);

export default Webhooks;
