import { request } from '@/utils/request';
import type { ApiResponse, Product, ProductStats } from '@/types';

export const getProducts = (): Promise<ApiResponse<Product[]>> => {
  return request({ url: '/products', method: 'GET' });
};

export const getProductStats = (): Promise<ApiResponse<ProductStats>> => {
  return request({ url: '/products/stats', method: 'GET' });
};

export const updateProductStatus = (id: string, status: 'active' | 'inactive'): Promise<ApiResponse<null>> => {
  return request({ 
    url: `/products/${id}/status`, 
    method: 'PUT',
    data: { status }
  });
};

export const updateProduct = (id: string, values: Partial<Product>): Promise<ApiResponse<null>> => {
  return request({ 
    url: `/products/${id}`, 
    method: 'PUT',
    data: values
  });
};

export const createProduct = (values: Partial<Product>): Promise<ApiResponse<null>> => {
  return request({ 
    url: '/products', 
    method: 'POST',
    data: values
  });
};

export const getFeatureLibrary = (): Promise<ApiResponse<any[]>> => {
  return request({ url: '/products/features', method: 'GET' });
};

export const updateFeatureLibrary = (library: any[]): Promise<ApiResponse<null>> => {
  return request({ 
    url: '/products/features', 
    method: 'POST',
    data: library
  });
};
