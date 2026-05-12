import React from 'react';
import { Row, Col, Card, Space, Skeleton, Button } from 'antd';
import { LineChartOutlined, PieChartOutlined } from '@ant-design/icons';
import { Area, Pie } from '@ant-design/charts';

interface DashboardChartsProps {
  areaConfig: any;
  pieConfig: any;
  isTrendLoading: boolean;
  isDistLoading: boolean;
  onMoreData: () => void;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({
  areaConfig,
  pieConfig,
  isTrendLoading,
  isDistLoading,
  onMoreData
}) => {
  return (
    <Row gutter={[16, 16]} className="mb-6">
      <Col xs={24} lg={14}>
        <Card 
          title={<Space><LineChartOutlined /> 7日营收趋势分析</Space>} 
          variant="outlined"
          extra={<Button type="link" onClick={onMoreData} className="pr-0">更多数据</Button>}
          styles={{ header: { paddingRight: 12 } }} // 稍微收紧头部右侧内边距
        >
          {isTrendLoading ? <Skeleton active /> : <Area {...areaConfig} />}
        </Card>
      </Col>
      <Col xs={24} lg={10}>
        <Card 
          title={<Space><PieChartOutlined /> 订阅套餐占比</Space>} 
          variant="outlined"
        >
          {isDistLoading ? <Skeleton active /> : <Pie {...pieConfig} />}
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardCharts;
