import { lazy, type ReactNode } from 'react';
import {
  DashboardOutlined,
  ShoppingOutlined,
  SettingOutlined,
  NotificationOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';

// 使用 React.lazy 实现组件懒加载，优化首屏加载速度
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Orders = lazy(() => import('@/pages/Orders'));
const Products = lazy(() => import('@/pages/Products/index'));
const Webhooks = lazy(() => import('@/pages/Webhooks'));
const Settings = lazy(() => import('@/pages/Settings/index'));
const Notifications = lazy(() => import('@/pages/Notifications'));

export interface RouteConfig {
  path: string;
  element: ReactNode;
  label?: string;
  icon?: ReactNode;
  hideInMenu?: boolean;
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <Dashboard />,
    label: '仪表盘',
    icon: <DashboardOutlined />,
  },
  {
    path: '/orders',
    element: <Orders />,
    label: '订单管理',
    icon: <ShoppingOutlined />,
  },
  {
    path: '/products',
    element: <Products />,
    label: '订阅管理',
    icon: <CreditCardOutlined />,
  },
  {
    path: '/webhooks',
    element: <Webhooks />,
    label: 'Webhook日志',
    icon: <NotificationOutlined />,
  },
  {
    path: '/settings',
    element: <Settings />,
    label: '系统设置',
    icon: <SettingOutlined />,
  },
  {
    path: '/notifications',
    element: <Notifications />,
    label: '系统消息',
    hideInMenu: true, // 在侧边栏隐藏，可能通过顶部通知中心进入
  },
];
