import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { message } from 'antd';

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
      message.error(data.message || '业务处理失败');
      return Promise.reject(new Error(data.message || 'Error'));
    }
    
    return data; // 直接返回业务数据
  },
  (error: AxiosError) => {
    // 超出 2xx 范围的状态码都会触发该函数
    console.error('Response Error:', error);
    
    let errorMsg = '网络请求失败，请稍后重试';
    
    if (error.response) {
      // 请求已发出，且服务器响应了状态码，但状态代码超出了 2xx 的范围
      const status = error.response.status;
      switch (status) {
        case 400:
          errorMsg = '请求参数错误 (400)';
          break;
        case 401:
          errorMsg = '未授权，请重新登录 (401)';
          // 这里可以触发登出逻辑，例如：
          // localStorage.removeItem('mycoin_admin_token');
          // window.location.href = '/login';
          break;
        case 403:
          errorMsg = '拒绝访问 (403)';
          break;
        case 404:
          errorMsg = '请求的资源不存在 (404)';
          break;
        case 500:
          errorMsg = '服务器内部错误 (500)';
          break;
        case 502:
          errorMsg = '网关错误 (502)';
          break;
        case 503:
          errorMsg = '服务不可用 (503)';
          break;
        case 504:
          errorMsg = '网关超时 (504)';
          break;
        default:
          errorMsg = `请求失败 (${status})`;
      }
    } else if (error.request) {
      // 请求已经成功发起，但没有收到响应
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMsg = '请求超时，请检查网络连接';
      } else {
        errorMsg = '网络异常，未收到服务器响应';
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
