import React, { useState, useMemo } from 'react';
import { Layout, Menu, theme, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useIsFetching } from '@tanstack/react-query';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import NotificationCenter from '@/components/layout/NotificationCenter';
import { routes } from '@/routes/config';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // --- NProgress 全局进度条控制 ---
  const isFetching = useIsFetching();
  
  React.useEffect(() => {
    if (isFetching > 0) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [isFetching]);

  // 配置 NProgress
  React.useLayoutEffect(() => {
    NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.1 });
  }, []);

  // 根据路由配置动态生成菜单项
  const menuItems = useMemo(() => {
    return routes
      .filter(route => !route.hideInMenu)
      .map(route => ({
        key: route.path,
        icon: route.icon,
        label: route.label,
      }));
  }, []);

  return (
    <Layout className="min-h-screen">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="dark"
        className="fixed left-0 top-0 bottom-0 overflow-auto"
      >
        <div className="h-4" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout className="transition-all duration-200" style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header 
          className="p-0 flex justify-between items-center pr-6 sticky top-0 z-10 w-full" 
          style={{ background: colorBgContainer }}
        >
          <div className="flex items-center">
          </div>
          <div className="flex items-center gap-4">
            <NotificationCenter />
            <Divider type="vertical" style={{ height: 20 }} />
            <span className="text-gray-500 text-sm">管理员 (Admin)</span>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <UserOutlined className="text-gray-400" />
            </div>
          </div>
        </Header>
        <Content
          className="m-6 p-6 min-h-[280px]"
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
