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
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import type { WebhookLog } from '@/types';
import { useWebhooks } from './hooks/useWebhooks';
import WebhookDetailDrawer from './components/WebhookDetailDrawer';

const { Text } = Typography;

const WebhookContent: React.FC = () => {
  const { t } = useTranslation();
  const { 
    stats, filteredData, loading, filter, drawer, actions 
  } = useWebhooks();

  const columns: ColumnsType<WebhookLog> = [
    {
      title: t('webhooks.columns.id'),
      dataIndex: 'id',
      key: 'id',
      width: 180,
      render: (id) => <Text code className="text-xs font-mono">{id}</Text>,
    },
    {
      title: t('webhooks.columns.event'),
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
      title: t('webhooks.columns.product'),
      dataIndex: 'product',
      key: 'product',
      render: (text) => <Text type="secondary" className="text-xs">{text}</Text>
    },
    {
      title: t('webhooks.columns.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === 'success' ? 'success' : 'error'} 
          text={status === 'success' ? t('common.status.success') : t('common.status.error')} 
        />
      ),
    },
    {
      title: t('webhooks.columns.latency'),
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
      title: t('webhooks.columns.time'),
      dataIndex: 'time',
      key: 'time',
      width: 170,
      render: (t_str) => <Text type="secondary" className="text-xs">{t_str}</Text>
    },
    {
      title: t('orders.columns.action'),
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => actions.showDetails(record)}>{t('common.more')}</Button>
      ),
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader 
        title={t('webhooks.title')}
        subtitle={t('webhooks.subtitle')}
        onExport={actions.handleExport}
        extra={
          <>
            <Button icon={<ReloadOutlined spin={loading.stats} />} onClick={() => actions.refetchStats()}>{t('common.refresh')}</Button>
            <Button type="primary">{t('menu.settings')}</Button>
          </>
        }
      />

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={8}>
          <StatCard 
            title={t('webhooks.stats.total_24h')}
            value={stats?.total24h || 0}
            icon={<HistoryOutlined />}
            color="#1677ff"
            loading={loading.stats}
          />
        </Col>
        <Col xs={24} lg={8}>
          <StatCard 
            title={t('webhooks.stats.success_rate')}
            value={`${stats?.successRate || 0}%`}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
            loading={loading.stats}
          />
        </Col>
        <Col xs={24} lg={8}>
          <StatCard 
            title={t('webhooks.stats.alerts')}
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
              { label: t('webhooks.tabs.all'), key: 'all' },
              { label: t('webhooks.tabs.success'), key: 'success' },
              { label: t('webhooks.tabs.failed'), key: 'failed' },
            ]}
          />
        }
        extra={
          <Space wrap>
            <Input 
              placeholder={t('webhooks.search_placeholder')} 
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
              {t('common.refresh')}
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
            showTotal: (total) => `${t('common.total')} ${total}`,
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
