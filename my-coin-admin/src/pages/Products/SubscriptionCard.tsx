import React from 'react';
import { Card, Typography, Space, Tag, Avatar, Divider, Button, Popconfirm, Switch, Tooltip } from 'antd';
import { 
  EditOutlined, GlobalOutlined, ThunderboltOutlined, 
  CrownOutlined, RocketOutlined, CheckCircleFilled, 
  AppleFilled, AndroidFilled, DeleteOutlined, DeleteFilled,
  StopOutlined
} from '@ant-design/icons';
import { useConfig } from '../../context/ConfigContext';
import type { Product } from '../../types';

const { Text, Title } = Typography;

interface SubscriptionCardProps {
  pkg: Product;
  onEdit: (pkg: Product) => void;
  onLocalize: (pkg: Product) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

const getCycleConfig = (cycle: string) => {
  switch(cycle) {
    case 'month': return { 
      icon: <ThunderboltOutlined />, 
      color: '#1677ff', 
      label: '月度', 
      headerBg: '#e6f4ff',
      bodyBg: '#f0f7ff'
    };
    case 'year': return { 
      icon: <RocketOutlined />, 
      color: '#faad14', 
      label: '年度', 
      headerBg: '#fffbe6',
      bodyBg: '#fffef0'
    };
    case 'forever': return { 
      icon: <CrownOutlined />, 
      color: '#722ed1', 
      label: '终身', 
      headerBg: '#f9f0ff',
      bodyBg: '#fcf9ff'
    };
    default: return { 
      icon: <RocketOutlined />, 
      color: '#595959', 
      label: '标准', 
      headerBg: '#f5f5f5',
      bodyBg: '#fafafa'
    };
  }
};

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ 
  pkg, 
  onEdit, 
  onLocalize, 
  onDelete, 
  onStatusChange
}) => {
  const { previewLang } = useConfig(); // 接入全局预览状态
  const cfg = getCycleConfig(pkg.cycle);
  const isActive = pkg.status === 'active';

  // 根据状态决定所有颜色
  const themeColor = isActive ? cfg.color : '#bfbfbf';
  const textPrimary = isActive ? '#1f1f1f' : '#999';
  const textSecondary = isActive ? '#595959' : '#ccc';
  
  const BRAND_COLORS = {
    apple: '#000000', 
    google: '#3DDC84'
  };

  // --- 增强的语言动态提取逻辑 ---
  let displayName = pkg.name;
  let displayDesc = pkg.description;
  let displayFeatures = pkg.features || [];

  if (previewLang !== 'master' && pkg.locales) {
    const matchedLocale = pkg.locales.find((l: any) => l.lang === previewLang);
    if (matchedLocale) {
      displayName = matchedLocale.name;
      displayDesc = matchedLocale.description;
      // 如果本地化数据中有 features，则使用本地化的，否则 fallback 到 master
      if (matchedLocale.features && matchedLocale.features.length > 0) {
        // 处理如果是字符串数组或对象数组的兼容性
        displayFeatures = matchedLocale.features.map((f: any) => 
          typeof f === 'string' ? { label: f, included: true } : f
        );
      }
    }
  }

  return (
    <Card 
      hoverable
      className={`overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl h-full flex flex-col relative ${!isActive ? 'scale-[0.98]' : 'scale-100'}`}
      styles={{ body: { padding: 0, flex: 1, display: 'flex', flexDirection: 'column' } }}
    >
      {/* 预览模式水印标签 */}
      {previewLang !== 'master' && isActive && (
        <div className="absolute top-0 right-0 z-50">
          <Tag 
            color="orange" 
            bordered={false} 
            className="m-0 rounded-tr-none rounded-bl-xl px-3 py-1 font-bold shadow-sm"
          >
            <Space size={4}><GlobalOutlined /> {previewLang.toUpperCase()} 预览</Space>
          </Tag>
        </div>
      )}

      {/* 已下架水印 */}
      {!isActive && (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="border-4 border-gray-400 text-gray-400 font-black text-4xl px-8 py-3 rounded-2xl transform -rotate-12 opacity-15 border-dashed tracking-[12px] pl-[20px]">
            已下架
          </div>
        </div>
      )}

      {/* 头部区域 */}
      <div style={{ backgroundColor: isActive ? cfg.headerBg : '#f0f0f0', padding: '20px 24px' }} className="relative overflow-hidden transition-colors duration-500">
         <div className="flex justify-between items-start relative z-10">
            <Space direction="vertical" size={0} className="flex-1 pr-4">
               <Text style={{ color: themeColor, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 }}>{cfg.label}套餐</Text>
               <Title level={4} style={{ margin: 0, marginTop: 4, letterSpacing: -0.5, color: textPrimary }} ellipsis={{ rows: 1 }}>{displayName}</Title>
               <Text type="secondary" style={{ fontSize: 10, opacity: 0.6 }}>{pkg.id}</Text>
            </Space>
            
            <div className="flex flex-col items-center gap-2">
              <Avatar 
                shape="square" 
                size={40} 
                icon={isActive ? cfg.icon : <StopOutlined />} 
                style={{ backgroundColor: 'white', color: themeColor, borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
              />
              <Tooltip title={isActive ? "点击下架" : "点击上架"}>
                <Switch 
                  size="small" 
                  checked={isActive} 
                  onChange={(checked) => onStatusChange(pkg.id, checked ? 'active' : 'inactive')}
                  style={{ backgroundColor: isActive ? '#52c41a' : '#bfbfbf', transform: 'scale(0.8)' }}
                />
              </Tooltip>
            </div>
         </div>
         {React.cloneElement(cfg.icon as React.ReactElement, {
           style: { position: 'absolute', right: -20, bottom: -20, fontSize: 100, color: themeColor, opacity: 0.05, transform: 'rotate(-15deg)' }
         })}
      </div>

      {/* 主体内容 */}
      <div className="p-6 flex-1 flex flex-col transition-colors duration-500" style={{ backgroundColor: isActive ? cfg.bodyBg : '#f9f9f9' }}>
        <div className="mb-4 bg-white/40 p-2 rounded border border-white/60 min-h-[44px]">
          <Text type="secondary" style={{ fontSize: 12, display: 'block', lineHeight: '1.4' }}>
            {displayDesc || '暂无描述信息'}
          </Text>
        </div>

        <div className="mb-6 flex items-baseline gap-1">
          <Text strong style={{ fontSize: 16, color: themeColor }}>{pkg.currency === 'CNY' ? '¥' : pkg.currency}</Text>
          <Text style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1, color: textPrimary }}>{pkg.price.toFixed(2)}</Text>
          <Text type="secondary" style={{ marginLeft: 4, fontSize: 13 }}>/ {pkg.cycle === 'month' ? '月' : pkg.cycle === 'year' ? '年' : '永久'}</Text>
        </div>

        <div className="flex gap-2 mb-6">
          <Tag 
            icon={<AppleFilled style={{ color: isActive && pkg.enableApple ? BRAND_COLORS.apple : '#d9d9d9', fontSize: 12 }} />} 
            style={{ 
              backgroundColor: isActive && pkg.enableApple ? '#ffffff' : 'rgba(0,0,0,0.02)',
              color: isActive && pkg.enableApple ? BRAND_COLORS.apple : '#ccc',
              fontSize: 11
            }}
            className="flex-1 py-1.5 rounded-lg text-center m-0 border transition-all"
          >
             {pkg.enableApple ? 'App Store' : '禁用'}
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
             {pkg.enableGoogle ? 'Play Store' : '禁用'}
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
             <Tooltip title={isActive ? "请先下架套餐后再删除" : "删除套餐"}>
               <Popconfirm
                 title="确定要删除此套餐吗？"
                 onConfirm={() => onDelete(pkg.id)}
                 okText="确定"
                 cancelText="取消"
                 okButtonProps={{ danger: true }}
                 disabled={isActive}
               >
                 <Button 
                   type="text" 
                   danger
                   disabled={isActive}
                   icon={isActive ? <DeleteOutlined /> : <DeleteFilled />} 
                   className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 ${!isActive ? 'bg-red-50 !text-red-500 scale-110 shadow-sm' : 'opacity-30'}`}
                 />
               </Popconfirm>
             </Tooltip>
             <Tooltip title="多语言配置">
                <Button 
                   type="text" 
                   icon={<GlobalOutlined />} 
                   className="text-gray-400 hover:text-blue-500 flex items-center justify-center w-9 h-9 rounded-xl hover:bg-blue-50" 
                   onClick={() => onLocalize(pkg)}
                />
             </Tooltip>
          </Space>
          
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            style={{ 
              borderRadius: 10, 
              backgroundColor: isActive ? cfg.color : '#d9d9d9',
              border: 'none',
              height: 36,
              padding: '0 20px',
              fontWeight: 600,
              boxShadow: isActive ? `0 4px 10px rgba(0,0,0, 0.1)` : 'none',
              color: isActive ? 'white' : '#999'
            }}
            onClick={() => onEdit(pkg)}
          >
            配置套餐
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SubscriptionCard;
