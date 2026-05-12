import { http, HttpResponse } from 'msw';

// 导入现有的 Mock 数据
import { 
  MOCK_DASHBOARD_STATS, MOCK_REVENUE_TREND, MOCK_PRODUCT_DIST, MOCK_RECENT_ACTIVITY 
} from './data/dashboard';
import { MOCK_ORDERS, MOCK_ORDER_STATS } from './data/orders';
import { LIVE_PRODUCTS, getLiveStats, MOCK_FEATURE_LIBRARY } from './data/products';
import { MOCK_WEBHOOK_LOGS, MOCK_WEBHOOK_STATS } from './data/webhooks';
import { LIVE_NOTIFICATIONS } from './data/notifications';
import { MOCK_SETTINGS } from './data/settings';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const handlers = [
  // --- Dashboard ---
  http.get(`${API_BASE}/dashboard/stats`, () => {
    return HttpResponse.json({ code: 200, data: MOCK_DASHBOARD_STATS, message: 'success' });
  }),
  http.get(`${API_BASE}/dashboard/revenue`, () => {
    return HttpResponse.json({ code: 200, data: MOCK_REVENUE_TREND, message: 'success' });
  }),
  http.get(`${API_BASE}/dashboard/distribution`, () => {
    return HttpResponse.json({ code: 200, data: MOCK_PRODUCT_DIST, message: 'success' });
  }),
  http.get(`${API_BASE}/dashboard/activity`, () => {
    return HttpResponse.json({ code: 200, data: MOCK_RECENT_ACTIVITY, message: 'success' });
  }),

  // --- Orders ---
  http.get(`${API_BASE}/orders`, () => {
    return HttpResponse.json({ code: 200, data: MOCK_ORDERS, message: 'success' });
  }),
  http.get(`${API_BASE}/orders/stats`, () => {
    return HttpResponse.json({ code: 200, data: MOCK_ORDER_STATS, message: 'success' });
  }),
  http.put(`${API_BASE}/orders/:id/status`, async ({ params, request }) => {
    const { id } = params;
    const { status } = await request.json() as any;
    
    // 模拟服务端状态更新
    const order = MOCK_ORDERS.find(o => o.id === id);
    if (order) order.status = status;

    return HttpResponse.json({ code: 200, data: null, message: '订单状态已更新' });
  }),

  // --- Products ---
  http.get(`${API_BASE}/products`, () => {
    return HttpResponse.json({ code: 200, data: LIVE_PRODUCTS, message: 'success' });
  }),
  http.get(`${API_BASE}/products/stats`, () => {
    return HttpResponse.json({ code: 200, data: getLiveStats(), message: 'success' });
  }),
  http.put(`${API_BASE}/products/:id/status`, async ({ params, request }) => {
    const { id } = params;
    const { status } = await request.json() as any;
    
    const product = LIVE_PRODUCTS.find(p => p.id === id);
    if (product) product.status = status;

    return HttpResponse.json({ code: 200, data: null, message: '套餐状态已更新' });
  }),
  http.put(`${API_BASE}/products/:id`, async ({ params, request }) => {
    const { id } = params;
    const values = await request.json() as any;
    const product = LIVE_PRODUCTS.find(p => p.id === id);
    if (product) {
      Object.assign(product, values);
    }
    return HttpResponse.json({ code: 200, data: null, message: '产品配置更新成功' });
  }),
  http.get(`${API_BASE}/products/features`, () => {
    return HttpResponse.json({ code: 200, data: MOCK_FEATURE_LIBRARY, message: 'success' });
  }),
  http.post(`${API_BASE}/products/features`, async ({ request }) => {
    const body = await request.json() as any[];
    // 直接覆盖现有的 MOCK_FEATURE_LIBRARY 以模拟保存
    MOCK_FEATURE_LIBRARY.splice(0, MOCK_FEATURE_LIBRARY.length, ...body);
    return HttpResponse.json({ code: 200, data: null, message: '权益库已保存' });
  }),

  // --- Webhooks ---
  http.get(`${API_BASE}/webhooks/logs`, () => {
    return HttpResponse.json({ code: 200, data: MOCK_WEBHOOK_LOGS, message: 'success' });
  }),
  http.get(`${API_BASE}/webhooks/stats`, () => {
    return HttpResponse.json({ code: 200, data: MOCK_WEBHOOK_STATS, message: 'success' });
  }),

  // --- Settings ---
  http.get(`${API_BASE}/settings`, () => {
    return HttpResponse.json({ code: 200, data: MOCK_SETTINGS, message: 'success' });
  }),
  http.put(`${API_BASE}/settings`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ code: 200, data: body, message: 'Settings updated' });
  }),
  http.post(`${API_BASE}/settings/reset-secret`, () => {
    return HttpResponse.json({ 
      code: 200, 
      data: { newSecret: `sk_live_${Math.random().toString(36).substring(7)}` }, 
      message: 'Secret reset success' 
    });
  }),

  // --- Notifications ---
  http.get(`${API_BASE}/notifications`, () => {
    return HttpResponse.json({ code: 200, data: LIVE_NOTIFICATIONS, message: 'success' });
  }),
  http.get(`${API_BASE}/notifications/stats`, () => {
    return HttpResponse.json({ code: 200, data: { unread: LIVE_NOTIFICATIONS.filter(n => !n.read).length }, message: 'success' });
  }),
  http.put(`${API_BASE}/notifications/:id/read`, ({ params }) => {
    const { id } = params;
    const notif = LIVE_NOTIFICATIONS.find(n => n.id === id);
    if (notif) notif.read = true;
    return HttpResponse.json({ code: 200, data: null, message: 'success' });
  }),
  http.put(`${API_BASE}/notifications/read-all`, () => {
    LIVE_NOTIFICATIONS.forEach(n => n.read = true);
    return HttpResponse.json({ code: 200, data: null, message: 'success' });
  }),
];
