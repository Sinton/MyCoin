import type { WebhookLog, WebhookStats } from '../types';

export const MOCK_WEBHOOK_STATS: WebhookStats = {
  total24h: 1284,
  successRate: 99.8,
  alertCount: 2
};

export const MOCK_WEBHOOK_LOGS: WebhookLog[] = [
  {
    key: '1',
    id: 'WH_88293848102',
    event: 'SUBSCRIBED',
    product: 'com.pro.month',
    status: 'success',
    time: '2024-05-11 14:05:33',
    latency: 145,
    payload: JSON.stringify({
      notification_type: "SUBSCRIBED",
      user_id: "U88421",
      purchase_date: "2024-05-11T06:05:33Z",
      original_transaction_id: "1000000123456",
      auto_renew_status: true
    }, null, 2),
    response: JSON.stringify({ code: 200, message: "Order created successfully" }, null, 2)
  },
  {
    key: '2',
    id: 'WH_88293848103',
    event: 'DID_RENEW',
    product: 'com.plus.year',
    status: 'success',
    time: '2024-05-11 14:02:11',
    latency: 89,
    payload: JSON.stringify({
      notification_type: "DID_RENEW",
      user_id: "U77210",
      expires_date: "2025-05-11T06:02:11Z",
      transaction_id: "1000000987654"
    }, null, 2),
    response: JSON.stringify({ code: 200, status: "Subscription extended" }, null, 2)
  },
  {
    key: '3',
    id: 'WH_88293848104',
    event: 'REFUND',
    product: 'com.pro.month',
    status: 'failed',
    time: '2024-05-11 13:50:00',
    latency: 1202,
    payload: JSON.stringify({
      notification_type: "REFUND",
      user_id: "U11202",
      refund_date: "2024-05-11T05:50:00Z",
      reason: "User requested"
    }, null, 2),
    response: JSON.stringify({ code: 500, error: "Database timeout during refund processing" }, null, 2)
  },
];
