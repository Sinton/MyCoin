-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    apple_id TEXT UNIQUE,
    nickname TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    product_id TEXT UNIQUE NOT NULL,
    name TEXT,
    plan TEXT,
    type TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Entitlements Table
CREATE TABLE IF NOT EXISTS entitlements (
    id SERIAL PRIMARY KEY,
    product_id TEXT UNIQUE NOT NULL,
    plan TEXT,
    features JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Subscription Table
CREATE TABLE IF NOT EXISTS user_subscription (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    product_id TEXT NOT NULL,
    subscription_group_id TEXT,
    status TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    price DECIMAL(10, 2),
    currency TEXT,
    is_trial_consumed BOOLEAN DEFAULT FALSE,
    original_transaction_id TEXT UNIQUE,
    latest_transaction_id TEXT,
    auto_renew_status BOOLEAN DEFAULT TRUE,
    environment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Billing Logs Table
CREATE TABLE IF NOT EXISTS billing_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    transaction_id TEXT,
    product_id TEXT,
    price DECIMAL(10, 2),
    currency TEXT,
    refund_reason TEXT,
    event_type TEXT NOT NULL,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Webhook Events Table
CREATE TABLE IF NOT EXISTS webhook_events (
    id SERIAL PRIMARY KEY,
    notification_id TEXT UNIQUE NOT NULL,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster user lookup
CREATE INDEX IF NOT EXISTS idx_users_apple_id ON users(apple_id);
CREATE INDEX IF NOT EXISTS idx_user_subscription_user_id ON user_subscription(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_notification_id ON webhook_events(notification_id);
CREATE INDEX IF NOT EXISTS idx_billing_logs_user_id ON billing_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscription_status ON user_subscription(status);
