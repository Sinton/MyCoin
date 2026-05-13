import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { message } from 'antd';
import i18n from '@/i18n';

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  // baseURL 优先从环境变量获取
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 例如：注入 token
    const token = localStorage.getItem('mycoin_admin_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 2xx 范围内的状态码都会触发该函数
    const { data } = response;
    
    // 这里假设后端的标准返回格式是 { code: number, data: any, message: string }
    // 如果 code 不是 200，我们可以认为是业务错误
    if (data && data.code && data.code !== 200) {
      message.error(data.message || i18n.t('errors.business'));
      return Promise.reject(new Error(data.message || 'Error'));
    }
    
    return data; // 直接返回业务数据
  },
  (error: AxiosError) => {
    // 超出 2xx 范围的状态码都会触发该函数
    console.error('Response Error:', error);
    
    let errorMsg = i18n.t('errors.network');
    
    if (error.response) {
      // 请求已发出，且服务器响应了状态码，但状态代码超出了 2xx 的范围
      const status = error.response.status;
      switch (status) {
        case 400:
          errorMsg = i18n.t('errors.param');
          break;
        case 401:
          errorMsg = i18n.t('errors.unauthorized');
          break;
        case 403:
          errorMsg = i18n.t('errors.forbidden');
          break;
        case 404:
          errorMsg = i18n.t('errors.not_found');
          break;
        case 500:
          errorMsg = i18n.t('errors.server');
          break;
        default:
          errorMsg = `${i18n.t('errors.network')} (${status})`;
      }
    } else if (error.request) {
      // 请求已经成功发起，但没有收到响应
      // @ts-ignore
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMsg = i18n.t('errors.timeout');
      } else {
        errorMsg = i18n.t('errors.network');
      }
    } else {
      // 发送请求时出了点问题
      errorMsg = error.message;
    }

    message.error(errorMsg);
    
    return Promise.reject(error);
  }
);

/**
 * 封装核心的通用请求方法
 */
export const request = async <T = any>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await service.request<any, T>(config);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export default service;
