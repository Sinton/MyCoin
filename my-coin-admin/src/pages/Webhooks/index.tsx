import React from 'react';
import { 
  Table, Tag, Card, Typography, Space, Button, 
  Input, Row, Col, Tabs, Badge, App
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  SearchOutlined, ReloadOutlined, BugOutlined, 
  CheckCircleOutlined, HistoryOutlined
} from '@ant-design/icons';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import type { WebhookLog } from '@/types';
import { useWebhooks } from './hooks/useWebhooks';
import WebhookDetailDrawer from './components/WebhookDetailDrawer';

const { Text } = Typography;

const WebhookContent: React.FC = () => {
  const { 
    stats, filteredData, loading, filter, drawer, actions 
  } = useWebhooks();

  const columns: ColumnsType<WebhookLog> = [
    {
      title: '通知 ID',
      dataIndex: 'id',
      key: 'id',
      width: 180,
      render: (id) => <Text code className="text-xs font-mono">{id}</Text>,
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
      render: (text) => <Text type="secondary" className="text-xs">{text}</Text>
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
        <Text type={ms > 500 ? 'danger' : 'secondary'} className="text-xs">
          {ms}ms
        </Text>
      )
    },
    {
      title: '接收时间',
      dataIndex: 'time',
      key: 'time',
      width: 170,
      render: (t) => <Text type="secondary" className="text-xs">{t}</Text>
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => actions.showDetails(record)}>详情</Button>
      ),
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader 
        title="Webhook 事件监控"
        subtitle="全平台订阅回调事件实时追踪与排错"
        onExport={actions.handleExport}
        extra={
          <>
            <Button icon={<ReloadOutlined spin={loading.stats} />} onClick={() => actions.refetchStats()}>刷新</Button>
            <Button type="primary">报警配置</Button>
          </>
        }
      />

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={8}>
          <StatCard 
            title="24H 通知总量"
            value={stats?.total24h || 0}
            icon={<HistoryOutlined />}
            color="#1677ff"
            loading={loading.stats}
          />
        </Col>
        <Col xs={24} lg={8}>
          <StatCard 
            title="通知成功率"
            value={`${stats?.successRate || 0}%`}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
            loading={loading.stats}
          />
        </Col>
        <Col xs={24} lg={8}>
          <StatCard 
            title="异常告警"
            value={stats?.alertCount || 0}
            icon={<BugOutlined />}
            color="#ff4d4f"
            loading={loading.stats}
          />
        </Col>
      </Row>

      <Card 
        variant="outlined" 
        title={
          <Tabs 
            activeKey={filter.activeTab} 
            onChange={filter.setActiveTab}
            className="mb-[-16px]"
            items={[
              { label: '全部记录', key: 'all' },
              { label: '处理成功', key: 'success' },
              { label: '处理失败', key: 'failed' },
            ]}
          />
        }
        extra={
          <Space wrap>
            <Input 
              placeholder="搜索通知 ID / 产品..." 
              prefix={<SearchOutlined />} 
              style={{ width: 280 }}
              value={filter.searchText}
              onChange={e => filter.setSearchText(e.target.value)}
              allowClear
            />
            <Button 
              icon={<ReloadOutlined spin={loading.logsRefetching} />} 
              onClick={() => actions.refetchLogs()}
            >
              刷新列表
            </Button>
          </Space>
        }
      >
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          loading={loading.logs}
          size="middle"
          pagination={{ 
            pageSize: 15,
            showTotal: (total) => `共 ${total} 条日志`,
            showSizeChanger: true
          }} 
        />
      </Card>

      <WebhookDetailDrawer 
        open={drawer.open}
        onClose={() => drawer.setOpen(false)}
        selectedLog={drawer.selectedLog}
        onCopy={actions.copyToClipboard}
      />
    </div>
  );
};

const Webhooks: React.FC = () => (
  <App>
    <WebhookContent />
  </App>
);

export default Webhooks;
