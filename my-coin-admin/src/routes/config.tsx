import { lazy, type ReactNode } from 'react';
import {
  DashboardOutlined,
  ShoppingOutlined,
  SettingOutlined,
  NotificationOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';

// 使用 React.lazy 实现组件懒加载，优化首屏加载速度
const Dashboard = lazy(() => import('@/pages/Dashboard/index'));
const Orders = lazy(() => import('@/pages/Orders/index'));
const Products = lazy(() => import('@/pages/Products/index'));
const Webhooks = lazy(() => import('@/pages/Webhooks/index'));
const Settings = lazy(() => import('@/pages/Settings/index'));
const Notifications = lazy(() => import('@/pages/Notifications/index'));

export interface RouteConfig {
  path: string;
  element: ReactNode;
  i18nKey: string;
  icon?: ReactNode;
  hideInMenu?: boolean;
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <Dashboard />,
    i18nKey: 'menu.dashboard',
    icon: <DashboardOutlined />,
  },
  {
    path: '/orders',
    element: <Orders />,
    i18nKey: 'menu.orders',
    icon: <ShoppingOutlined />,
  },
  {
    path: '/products',
    element: <Products />,
    i18nKey: 'menu.products',
    icon: <CreditCardOutlined />,
  },
  {
    path: '/webhooks',
    element: <Webhooks />,
    i18nKey: 'menu.webhooks',
    icon: <NotificationOutlined />,
  },
  {
    path: '/settings',
    element: <Settings />,
    i18nKey: 'menu.settings',
    icon: <SettingOutlined />,
  },
  {
    path: '/notifications',
    element: <Notifications />,
    i18nKey: 'menu.notifications',
    hideInMenu: true,
  },
];
