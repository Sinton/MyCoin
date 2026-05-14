import React from 'react';
import { Card, Typography, Space, Tag, Avatar, Divider, Button, Popconfirm, Switch, Tooltip } from 'antd';
import { 
  EditOutlined, GlobalOutlined, ThunderboltOutlined, 
  CrownOutlined, RocketOutlined, CheckCircleFilled, 
  AppleFilled, AndroidFilled, DeleteOutlined,
  StopOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { Product } from '@/types';

const { Text, Title } = Typography;

interface SubscriptionCardProps {
  pkg: Product;
  featureLibrary: any[];
  onEdit: (pkg: Product) => void;
  onLocalize: (pkg: Product) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

const getCycleConfig = (cycle: string, t: any) => {
  switch(cycle) {
    case 'month': return { 
      icon: <ThunderboltOutlined />, 
      color: '#1677ff', 
      label: t('products.cycles.month'), 
      headerBg: '#e6f4ff',
      bodyBg: '#f0f7ff'
    };
    case 'year': return { 
      icon: <RocketOutlined />, 
      color: '#722ed1', 
      label: t('products.cycles.year'), 
      headerBg: '#f9f0ff',
      bodyBg: '#f6efff'
    };
    case 'forever': return { 
      icon: <CrownOutlined />, 
      color: '#fa8c16', 
      label: t('products.cycles.forever'), 
      headerBg: '#fff7e6',
      bodyBg: '#fff9f0'
    };
    default: return { 
      icon: <ThunderboltOutlined />, 
      color: '#bfbfbf', 
      label: cycle, 
      headerBg: '#f5f5f5',
      bodyBg: '#fafafa'
    };
  }
};

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ 
  pkg, 
  featureLibrary,
  onEdit, 
  onLocalize, 
  onDelete, 
  onStatusChange
}) => {
  const { t, i18n } = useTranslation();
  const cfg = getCycleConfig(pkg.interval, t);
  const isActive = pkg.status === 'active';
  const targetLang = i18n.language;

  // 根据状态决定所有颜色
  const themeColor = isActive ? cfg.color : '#bfbfbf';
  const textPrimary = isActive ? '#1f1f1f' : '#999';
  const textSecondary = isActive ? '#595959' : '#ccc';
  
  const BRAND_COLORS = {
    apple: '#000000', 
    google: '#3DDC84'
  };

  const CURRENCY_SYMBOLS: Record<string, string> = {
    'CNY': '¥',
    'USD': '$',
    'JPY': '¥',
    'KRW': '₩'
  };

  // --- 语言动态提取逻辑 ---
  let displayName = pkg.name;
  let displayDesc = pkg.description;
  
  if (pkg.locales) {
    const matchedLocale = pkg.locales.find((l: any) => l.lang === targetLang);
    if (matchedLocale) {
      displayName = matchedLocale.name;
      displayDesc = matchedLocale.description;
    }
  }

  const resolveFeature = (f: any) => {
    const key = typeof f === 'string' ? f : f.key;
    const libItem = featureLibrary?.find(item => item.key === key);
    let label = libItem?.name || key;
    if (libItem?.locales && libItem.locales[targetLang]) {
      label = libItem.locales[targetLang];
    }
    return { key, label };
  };

  const displayFeatures = (pkg.features || []).map(resolveFeature);

  return (
    <Card 
      hoverable={false}
      className={`overflow-hidden border-none shadow-sm ${isActive ? 'hover:shadow-xl hover:-translate-y-1 transform-gpu' : ''} transition-[transform,box-shadow] duration-300 ease-out rounded-2xl h-full flex flex-col relative will-change-transform ${!isActive ? 'scale-[0.98]' : 'scale-100'}`}
      style={{ width: 340 }}
      styles={{ body: { padding: 0, flex: 1, display: 'flex', flexDirection: 'column' } }}
    >
      {/* 已下架水印 */}
      {!isActive && (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="border-4 border-gray-400 text-gray-400 font-black text-4xl px-8 py-3 rounded-2xl transform -rotate-12 opacity-15 border-dashed tracking-[12px] pl-[20px]">
            {t('products.offline')}
          </div>
        </div>
      )}

      {/* 头部区域 */}
      <div style={{ backgroundColor: isActive ? cfg.headerBg : '#f0f0f0', padding: '24px' }} className="relative overflow-hidden transition-colors duration-500">
         <div className="flex justify-between items-start relative z-10">
            <Space direction="vertical" size={0} className="flex-1 pr-4">
               <Text style={{ color: themeColor, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 }}>
                 {cfg.label}{t('products.edit.title_suffix')}
               </Text>
               <Title level={4} style={{ margin: 0, marginTop: 4, letterSpacing: -0.5, color: textPrimary }} ellipsis={{ rows: 1 }}>
                 {displayName}
               </Title>
               <Text type="secondary" style={{ fontSize: 10, opacity: 0.6 }}>{pkg.id}</Text>
            </Space>
            
            <div className="flex flex-col items-center gap-2">
              <Avatar 
                shape="square" 
                size={40} 
                icon={isActive ? cfg.icon : <StopOutlined />} 
                style={{ backgroundColor: 'white', color: themeColor, borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
              />
              <Tooltip title={isActive ? t('products.actions.offline') : t('products.actions.online')}>
                <Popconfirm
                  title={isActive ? t('products.messages.confirm_offline') : t('products.messages.confirm_online')}
                  onConfirm={() => onStatusChange(pkg.id, isActive ? 'inactive' : 'active')}
                  okText={t('common.confirm')}
                  cancelText={t('common.cancel')}
                  placement="bottomRight"
                >
                  <Switch 
                    size="small" 
                    checked={isActive} 
                    style={{ backgroundColor: isActive ? '#52c41a' : '#bfbfbf', transform: 'scale(0.8)' }}
                  />
                </Popconfirm>
              </Tooltip>
            </div>
         </div>

         <div className="flex items-baseline gap-1 mt-6">
          <span style={{ fontSize: 18, color: themeColor, fontWeight: 600 }}>
            {t('products.edit.currency_symbol') || CURRENCY_SYMBOLS[pkg.currency] || '¥'}
          </span>
          <span style={{ fontSize: 32, color: themeColor, fontWeight: 700, letterSpacing: -1 }}>{pkg.price}</span>
          <Text type="secondary" style={{ marginLeft: 4, fontSize: 13 }}>
            / {t('products.edit.title_suffix')}
          </Text>
        </div>

         {React.cloneElement(cfg.icon as React.ReactElement, {
           style: { position: 'absolute', right: -20, bottom: -20, fontSize: 100, color: themeColor, opacity: 0.05, transform: 'rotate(-15deg)' }
         })}
      </div>

      {/* 主体内容 */}
      <div className="p-6 flex-1 flex flex-col transition-colors duration-500" style={{ backgroundColor: isActive ? cfg.bodyBg : '#f9f9f9' }}>
        <div 
          className="mb-6 transition-all duration-500" 
          style={{ 
            paddingLeft: 12, 
            borderLeft: `3px solid ${isActive ? `${themeColor}40` : '#e5e7eb'}`,
            minHeight: '40px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Text type="secondary" style={{ fontSize: 13, color: textSecondary, fontStyle: 'italic', lineHeight: '1.6' }}>
            {displayDesc || t('products.no_desc')}
          </Text>
        </div>

        <div className="flex gap-2 mb-6">
          <Tag 
            icon={<AppleFilled style={{ color: isActive && pkg.enableApple ? BRAND_COLORS.apple : '#d9d9d9', fontSize: 12 }} />} 
            style={{ 
              backgroundColor: isActive && pkg.enableApple ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.02)',
              color: isActive && pkg.enableApple ? '#000' : '#ccc',
              fontSize: 11
            }}
            className="flex-1 py-1.5 rounded-lg text-center m-0 border transition-all"
          >
             {pkg.enableApple ? 'App Store' : t('common.status.inactive')}
          </Tag>
          <Tag 
            icon={<AndroidFilled style={{ color: isActive && pkg.enableGoogle ? BRAND_COLORS.google : '#d9d9d9', fontSize: 12 }} />} 
            style={{ 
              backgroundColor: isActive && pkg.enableGoogle ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.02)',
              color: isActive && pkg.enableGoogle ? '#2d8c55' : '#ccc',
              fontSize: 11
            }}
            className="flex-1 py-1.5 rounded-lg text-center m-0 border transition-all"
          >
             {pkg.enableGoogle ? 'Play Store' : t('common.status.inactive')}
          </Tag>
        </div>

        <div className="flex-1">
          <div className="space-y-3 mb-6">
            {displayFeatures.map((f: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                 <CheckCircleFilled style={{ color: themeColor, fontSize: 14 }} />
                 <Text style={{ fontSize: 13, color: textSecondary }}>{f.label}</Text>
              </div>
            ))}
          </div>
        </div>

        <Divider style={{ margin: '16px 0', opacity: 0.3 }} />

        <div className="flex justify-between items-center">
          <Space size={8}>
             <Tooltip title={isActive ? t('products.messages.delete_before_offline') : t('common.delete')}>
               <Popconfirm
                 title={t('common.confirm') + '?'}
                 onConfirm={() => onDelete(pkg.id)}
                 okText={t('common.confirm')}
                 cancelText={t('common.cancel')}
                 okButtonProps={{ danger: true }}
                 disabled={isActive}
               >
                 <Button 
                   type="text" 
                   danger 
                   icon={<DeleteOutlined />} 
                   size="small"
                   disabled={isActive}
                   className="hover:bg-red-50"
                 />
               </Popconfirm>
             </Tooltip>
             <Button 
               type="text" 
               icon={<GlobalOutlined />} 
               size="small" 
               onClick={() => onLocalize(pkg)}
               className="text-gray-400 hover:text-blue-500"
             />
          </Space>
          
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => onEdit(pkg)}
            style={{ 
              backgroundColor: themeColor, 
              borderRadius: 8,
              boxShadow: isActive ? `0 4px 12px ${themeColor}33` : 'none',
              border: 'none'
            }}
          >
            {t('common.edit')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SubscriptionCard;
