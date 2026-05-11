# MyCoin iOS Subscription Backend - API Documentation

本文档旨在为 iOS 客户端开发人员提供对接参考。后端采用 **Apple StoreKit 2** 协议，通过服务端验证确保订阅权益的安全性和跨设备一致性。

---

## 1. 基础信息

*   **API Base URL**: `http://<server-ip>:8080/v1`
*   **认证方式**: 请求头携带 `Authorization: Bearer <accessToken>`
*   **数据格式**: `Content-Type: application/json`
*   **统一响应格式**:
    ```json
    {
      "code": 200,      // 200 为成功，其他为业务错误码
      "msg": "success",  // 错误描述
      "data": { ... }    // 业务数据
    }
    ```

---

## 2. 基础与运维 (Infrastructure)

### 2.1 健康检查 (Health Check)
*   **Endpoint**: `GET /health`
*   **Auth**: 不需要
*   **Response**:
    ```json
    {
      "code": 200,
      "msg": "success",
      "data": { "status": "ok" }
    }
    ```

---

## 3. 身份验证 (Authentication)

### 3.1 Apple 登录 / 注册
*   **Endpoint**: `POST /auth/apple`
*   **Auth**: 不需要
*   **Description**: 客户端获取 Apple 返回的 `identityToken` 后传给后端，后端完成验签并返回 JWT。如果用户不存在则自动创建。
*   **Request**:
    ```json
    {
      "identityToken": "eyJhbGciOiJSUzI1NiIs..."
    }
    ```
*   **Response**:
    ```json
    {
      "code": 200,
      "data": {
        "accessToken": "jwt_access_token",
        "refreshToken": "jwt_refresh_token",
        "user": {
          "id": 1,
          "apple_id": "000123.abc..."
        }
      }
    }
    ```

---

## 4. 订阅业务 (IAP & Subscription)

### 4.1 获取可销售产品列表
*   **Endpoint**: `GET /iap/products`
*   **Auth**: 不需要
*   **Description**: 获取后端配置的有效产品 ID。建议在 App 启动或进入内购页前调用。
*   **Response**:
    ```json
    {
      "code": 200,
      "data": [
        {
          "product_id": "com.mycoin.pro_monthly",
          "name": "Pro 会员 (月付)",
          "plan": "pro",
          "sort_order": 1
        }
      ]
    }
    ```

### 4.2 验证并同步订阅 (Verify Transaction)
*   **Endpoint**: `POST /iap/verify`
*   **Auth**: **需要**
*   **Description**: 客户端完成支付（或执行 Restore）后，将 `transactionId` 传给后端同步权益。
*   **Request**:
    ```json
    {
      "transaction_id": "2000000543210"
    }
    ```
*   **Response**:
    ```json
    {
      "code": 200,
      "data": {
        "user_id": 1,
        "product_id": "com.mycoin.pro_monthly",
        "status": "active",
        "end_time": "2026-06-11T12:00:00Z",
        "original_transaction_id": "2000000543210",
        "environment": "sandbox"
      }
    }
    ```

### 4.3 获取当前用户订阅权益 (Entitlements)
*   **Endpoint**: `GET /user/subscription`
*   **Auth**: **需要**
*   **Description**: 核心接口。返回当前用户的订阅详情及功能开关。建议每次启动 App 时调用。
*   **Response**:
    ```json
    {
      "code": 200,
      "data": {
        "product_id": "com.mycoin.pro_monthly",
        "status": "active",
        "end_time": "2026-06-11T12:00:00Z",
        "features": {
          "max_storage": "10GB",
          "premium_charts": true,
          "no_ads": true
        }
      }
    }
    ```

---

## 5. Webhook (Apple Notifications)

### 5.1 苹果服务器回调
*   **Endpoint**: `POST /iap/apple/notify`
*   **Auth**: 不需要 (由后端验证 Apple 签名)
*   **Description**: 此 URL 需配置在 App Store Connect 的后台。处理退款、续费状态变化、账单问题等。
*   **Note**: 客户端无需直接调用此接口。

---

## 6. 业务错误码 (Business Error Codes)

| 错误码  | 含义             | 处理建议                 |
| :------ | :--------------- | :----------------------- |
| `200`   | 成功             | 正常处理                 |
| `40100` | 未授权/Token无效 | 引导用户重新登录         |
| `40102` | Apple 验证失败   | 提示支付校验未通过       |
| `40401` | 产品/订阅不存在  | 检查产品 ID 是否配置正确 |
| `50000` | 内部服务器错误   | 稍后重试                 |
| `50001` | 数据库异常       | 联系管理员               |
| `50002` | Apple 服务不可用 | 提示 Apple 服务暂时故障  |

---

## 7. iOS 对接建议 (Best Practices)

1.  **监听更新**: 必须在全局范围内（如 `AppDelegate`）监听 `Transaction.updates`，确保即使用户关闭 App 也能在下次启动时同步 Webhook 错过的更新。
2.  **静默登录**: 每次启动 App 时，先检查本地 JWT 是否过期，若未过期则直接调用 `/user/subscription` 刷新权益。
3.  **信任服务端**: 所有的 UI 逻辑（如是否展示广告、是否开启高级功能）都应由 `/user/subscription` 返回的 `features` 字段决定。
