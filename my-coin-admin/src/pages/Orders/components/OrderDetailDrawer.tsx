import React from 'react';
import { Drawer, Space, Typography, Row, Col, Tag, Badge, Button, Popconfirm, Empty } from 'antd';
import { InfoCircleOutlined, RollbackOutlined } from '@ant-design/icons';
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
  return (
    <Drawer
      title={<Space><InfoCircleOutlined className="text-blue-500" /> 业务详情</Space>}
      placement="right"
      width={500}
      onClose={onClose}
      open={open}
      footer={
        <div className="flex justify-between items-center py-2 px-1">
          <Button onClick={onClose}>返回列表</Button>
          {order?.status === 'success' && (
            <Popconfirm 
              title="确认退款？" 
              onConfirm={() => onRefund(order.id)}
            >
              <Button 
                danger 
                type="primary" 
                icon={<RollbackOutlined />} 
                loading={refundLoading}
              >
                申请退款
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
                  <Text type="secondary" className="text-xs uppercase tracking-wider">订单编号</Text>
                  <div className="text-base font-mono font-bold mt-1">{order.id}</div>
                </Col>
                <Col span={10}>
                  <Text type="secondary" className="text-xs uppercase tracking-wider">实付金额</Text>
                  <div className="text-xl font-bold text-red-600 mt-1">¥{order.amount.toFixed(2)}</div>
                </Col>
              </Row>
            </div>
          </section>
          <section className="px-2 space-y-5">
            <div className="flex justify-between items-center">
              <Text type="secondary">用户姓名</Text>
              <Text strong>{order.user.split(' ')[0]}</Text>
            </div>
            <div className="flex justify-between items-center">
              <Text type="secondary">用户 ID (UID)</Text>
              <Text code>{order.user.match(/\(ID: ([^)]+)\)/)?.[1]}</Text>
            </div>
            <div className="flex justify-between items-center">
              <Text type="secondary">订阅产品</Text>
              <Tag color="blue" bordered={false}>{order.product}</Tag>
            </div>
            <div className="flex justify-between items-center">
              <Text type="secondary">支付状态</Text>
              <Badge 
                status={order.status === 'success' ? 'success' : 'default'} 
                text={order.status === 'success' ? '已支付' : '已退款'} 
              />
            </div>
            <div className="flex justify-between items-center">
              <Text type="secondary">下单时间</Text>
              <Text>{order.time}</Text>
            </div>
          </section>
        </div>
      ) : <Empty />}
    </Drawer>
  );
};

export default OrderDetailDrawer;
