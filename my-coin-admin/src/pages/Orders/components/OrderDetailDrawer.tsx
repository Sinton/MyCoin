import React from 'react';
import { Drawer, Space, Typography, Row, Col, Tag, Badge, Button, Popconfirm, Empty } from 'antd';
import { InfoCircleOutlined, RollbackOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { type Order } from '@/types';

const { Text } = Typography;

interface OrderDetailDrawerProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  onRefund: (id: string) => void;
  refundLoading?: boolean;
}

const OrderDetailDrawer: React.FC<OrderDetailDrawerProps> = ({
  open,
  order,
  onClose,
  onRefund,
  refundLoading
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  // 动态获取产品名称
  const getProductName = () => {
    if (!order) return '';
    return order.productNames?.[currentLang] || order.product;
  };

  return (
    <Drawer
      title={<Space><InfoCircleOutlined className="text-blue-500" /> {t('orders.detail_title', { defaultValue: '业务详情' })}</Space>}
      placement="right"
      width={500}
      onClose={onClose}
      open={open}
      footer={
        <div className="flex justify-between items-center py-2 px-1">
          <Button onClick={onClose}>{t('common.cancel', { defaultValue: '返回列表' })}</Button>
          {order?.status === 'success' && (
            <Popconfirm 
              title={t('common.confirm') + '?'} 
              onConfirm={() => onRefund(order.id)}
            >
              <Button 
                danger 
                type="primary" 
                icon={<RollbackOutlined />} 
                loading={refundLoading}
              >
                {t('orders.actions.refund', { defaultValue: '申请退款' })}
              </Button>
            </Popconfirm>
          )}
        </div>
      }
    >
      {order ? (
        <div className="space-y-8">
          <section>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <Row gutter={24}>
                <Col span={14}>
                  <Text type="secondary" className="text-xs uppercase tracking-wider">{t('orders.columns.id')}</Text>
                  <div className="text-base font-mono font-bold mt-1">{order.id}</div>
                </Col>
                <Col span={10}>
                  <Text type="secondary" className="text-xs uppercase tracking-wider">{t('orders.columns.amount')}</Text>
                  <div className="text-xl font-bold text-red-600 mt-1">
                    {t('products.edit.currency_symbol')}{order.amount.toFixed(2)}
                  </div>
                </Col>
              </Row>
            </div>
          </section>
          <section className="px-2 space-y-5">
            <div className="flex justify-between items-center">
              <Text type="secondary">{t('orders.detail.user_name', { defaultValue: '用户姓名' })}</Text>
              <Text strong>{order.user.split(' ')[0]}</Text>
            </div>
            <div className="flex justify-between items-center">
              <Text type="secondary">{t('orders.detail.user_id', { defaultValue: '用户 ID (UID)' })}</Text>
              <Text code>{order.user.match(/\(ID: ([^)]+)\)/)?.[1]}</Text>
            </div>
            <div className="flex justify-between items-center">
              <Text type="secondary">{t('orders.columns.product')}</Text>
              <Tag color="blue" bordered={false}>{getProductName()}</Tag>
            </div>
            <div className="flex justify-between items-center">
              <Text type="secondary">{t('orders.columns.status')}</Text>
              <Badge 
                status={order.status === 'success' ? 'success' : order.status === 'refunded' ? 'error' : 'default'} 
                text={t(`common.status.${order.status}`)} 
              />
            </div>
            <div className="flex justify-between items-center">
              <Text type="secondary">{t('orders.columns.time')}</Text>
              <Text>{order.time}</Text>
            </div>
          </section>
        </div>
      ) : <Empty />}
    </Drawer>
  );
};

export default OrderDetailDrawer;
