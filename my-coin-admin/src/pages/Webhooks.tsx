import React, { useState } from 'react';
import { 
  Table, Tag, Card, Typography, Space, Button, 
  Input, Row, Col, Statistic, Drawer, Descriptions,
  Tabs, Badge, Divider, App
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

const { Text } = Typography;

interface WebhookLog {
  key: string;
  id: string;
  event: 'SUBSCRIBED' | 'DID_RENEW' | 'REFUND' | 'EXPIRED' | 'GRACE_PERIOD';
  product: string;
  status: 'success' | 'failed';
  time: string;
  latency: number; 
  payload: string; 
  response: string; 
}

const mockLogs: WebhookLog[] = [
  {
    key: '1',
    id: 'WH_88293848102',
    event: 'SUBSCRIBED',
    product: 'com.pro.month',
    status: 'success',
    time: '2026-05-11 14:05:33',
    latency: 145,
    payload: JSON.stringify({
      notification_type: "SUBSCRIBED",
      user_id: "U001",
      purchase_date: "2026-05-11T06:05:33Z",
      original_transaction_id: "1000000123456",
      auto_renew_status: true
    }, null, 2),
    response: JSON.stringify({ code: 200, message: "Order created successfully" }, null, 2)
  },
  {
    key: '2',
    id: 'WH_88293848103',
    event: 'DID_RENEW',
    product: 'com.plus.year',
    status: 'success',
    time: '2026-05-11 14:02:11',
    latency: 89,
    payload: JSON.stringify({
      notification_type: "DID_RENEW",
      user_id: "U002",
      expires_date: "2027-05-11T06:02:11Z",
      transaction_id: "1000000987654"
    }, null, 2),
    response: JSON.stringify({ code: 200, status: "Subscription extended" }, null, 2)
  },
  {
    key: '3',
    id: 'WH_88293848104',
    event: 'REFUND',
    product: 'com.pro.month',
    status: 'failed',
    time: '2026-05-11 13:50:00',
    latency: 1202,
    payload: JSON.stringify({
      notification_type: "REFUND",
      user_id: "U003",
      refund_date: "2026-05-11T05:50:00Z",
      reason: "User requested"
    }, null, 2),
    response: JSON.stringify({ code: 500, error: "Database timeout during refund processing" }, null, 2)
  },
];

const WebhookContent: React.FC = () => {
  const { message } = App.useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');

  const filteredData = mockLogs.filter(log => {
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
        return <Tag color={colors[event] || 'default'} className="font-mono">{event}</Tag>;
      },
    },
    {
      title: '产品标识',
      dataIndex: 'product',
      key: 'product',
      render: (text) => <Text type="secondary">{text}</Text>
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
        <Text type={ms > 500 ? 'danger' : 'secondary'}>
          {ms}ms
        </Text>
      )
    },
    {
      title: '接收时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => showDetails(record)}>详情</Button>
      ),
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto p-4">
      {/* 状态统计 - 图标已移至标题 */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card bordered>
            <Statistic 
              title={<Space><HistoryOutlined /> 24H 通知总量</Space>} 
              value={1284} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered>
            <Statistic 
              title={<Space><CheckCircleOutlined style={{ color: '#52c41a' }} /> 成功率</Space>} 
              value={99.8} 
              suffix="%" 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered>
            <Statistic 
              title={<Space><BugOutlined style={{ color: '#cf1322' }} /> 异常告警</Space>} 
              value={2} 
              valueStyle={{ color: '#cf1322' }} 
            />
          </Card>
        </Col>
      </Row>

      {/* 过滤栏 */}
      <Card bordered className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            className="flex-1"
            items={[
              { label: '全部记录', key: 'all' },
              { label: '成功', key: 'success' },
              { label: '失败', key: 'failed' },
            ]}
          />
          <Space wrap>
            <Input 
              placeholder="搜索通知 ID 或产品..." 
              prefix={<SearchOutlined />} 
              style={{ width: 240 }}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
            <Button icon={<ReloadOutlined />} onClick={() => { setSearchText(''); setActiveTab('all'); }}>刷新</Button>
          </Space>
        </div>
      </Card>

      {/* 列表数据 */}
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        pagination={{ 
          pageSize: 15,
          showTotal: (total) => `共 ${total} 条日志`,
          showSizeChanger: true
        }} 
        size="middle"
      />

      {/* 日志详情抽屉 */}
      <Drawer
        title={
          <Space>
            <InfoCircleOutlined />
            <span>Webhook 报文详情</span>
          </Space>
        }
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={window.innerWidth < 1200 ? '90%' : 800}
        extra={
          <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(selectedLog?.payload || '')}>复制请求体</Button>
        }
      >
        {selectedLog && (
          <div className="space-y-6">
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="通知 ID" span={2}>{selectedLog.id}</Descriptions.Item>
              <Descriptions.Item label="事件类型">
                <Tag color="blue">{selectedLog.event}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="接收时间">{selectedLog.time}</Descriptions.Item>
              <Descriptions.Item label="处理耗时">{selectedLog.latency} ms</Descriptions.Item>
              <Descriptions.Item label="业务结果">
                <Badge status={selectedLog.status === 'success' ? 'success' : 'error'} text={selectedLog.status === 'success' ? '处理成功' : '处理失败'} />
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left" plain>
              <Space><ClockCircleOutlined /> 请求载荷 (Payload)</Space>
            </Divider>
            <div className="relative group">
              <pre className="p-4 bg-gray-900 text-gray-100 rounded overflow-auto text-xs leading-relaxed max-h-[400px]">
                {selectedLog.payload}
              </pre>
              <Button 
                size="small" 
                icon={<CopyOutlined />} 
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(selectedLog.payload)}
              >
                复制
              </Button>
            </div>

            <Divider orientation="left" plain>
              <Space><CheckCircleOutlined /> 系统响应 (Response)</Space>
            </Divider>
            <div className="relative group">
              <pre className={`p-4 rounded overflow-auto text-xs leading-relaxed ${selectedLog.status === 'failed' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                {selectedLog.response}
              </pre>
            </div>
          </div>
        )}
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
