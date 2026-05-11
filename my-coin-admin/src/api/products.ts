import type { ApiResponse, Product, ProductStats } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 获取产品列表
 */
export const getProducts = async (): Promise<ApiResponse<Product[]>> => {
  await sleep(600);
  const { LIVE_PRODUCTS } = await import('../mock/products');
  return { code: 200, data: LIVE_PRODUCTS, message: 'success' };
};

/**
 * 获取产品统计
 */
export const getProductStats = async (): Promise<ApiResponse<ProductStats>> => {
  await sleep(400);
  const { getLiveStats } = await import('../mock/products');
  return { code: 200, data: getLiveStats(), message: 'success' };
};

/**
 * 更新产品状态 (上架/下架)
 */
export const updateProductStatus = async (id: string, status: 'active' | 'inactive'): Promise<ApiResponse<null>> => {
  await sleep(500);
  const { updateLiveProductStatus } = await import('../mock/products');
  updateLiveProductStatus(id, status);
  return { code: 200, data: null, message: status === 'active' ? '套餐已成功上架' : '套餐已成功下架' };
};

/**
 * 更新产品配置
 */
export const updateProduct = async (id: string, values: Partial<Product>): Promise<ApiResponse<null>> => {
  await sleep(800);
  console.log(`Product ${id} updated:`, values);
  return { code: 200, data: null, message: '产品配置更新成功' };
};

/**
 * 获取权益素材库
 */
export const getFeatureLibrary = async (): Promise<ApiResponse<any[]>> => {
  await sleep(400);
  const { MOCK_FEATURE_LIBRARY } = await import('../mock/products');
  return { code: 200, data: MOCK_FEATURE_LIBRARY, message: 'success' };
};

/**
 * 更新权益素材库
 */
export const updateFeatureLibrary = async (library: any[]): Promise<ApiResponse<null>> => {
  await sleep(600);
  console.log('Feature Library updated:', library);
  return { code: 200, data: null, message: '素材库更新成功' };
};
