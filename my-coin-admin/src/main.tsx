import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider, App as AntdApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import ErrorBoundary from './components/common/ErrorBoundary'
import './index.css'

// 创建一个 client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    // `onUnhandledRequest: 'bypass'` 防止对本地图片等非 API 请求发出警告
    return worker.start({ onUnhandledRequest: 'bypass' })
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={zhCN}
        theme={{
          token: {
            colorPrimary:  '#1677ff',
            colorSuccess:  '#52c41a',
            colorWarning:  '#faad14',
            colorError:    '#ff4d4f',
            borderRadius:  6,
            borderRadiusLG: 8,
            borderRadiusSM: 4,
            fontFamily:    'Inter, system-ui, Helvetica, Arial, sans-serif',
            colorBgLayout: '#f5f5f5',
          },
        }}
      >
        <ErrorBoundary>
          <AntdApp>
            <App />
          </AntdApp>
        </ErrorBoundary>
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  )
})
