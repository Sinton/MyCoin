import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Spin } from 'antd';
import MainLayout from '@/layouts/MainLayout';
import { routes } from '@/routes/config';

// 全局加载状态组件
const PageLoader = () => (
  <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
    <Spin size="large" />
    <span className="text-gray-400">页面加载中...</span>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {routes.map((route) => (
            <Route
              key={route.path}
              index={route.path === '/'}
              path={route.path === '/' ? undefined : route.path.replace(/^\//, '')}
              element={
                <Suspense fallback={<PageLoader />}>
                  {route.element}
                </Suspense>
              }
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
