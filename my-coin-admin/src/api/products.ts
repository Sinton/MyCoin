import type { ApiResponse, Product, ProductStats, ProductStatus } from '../types';
import { MOCK_PRODUCTS, MOCK_PRODUCT_STATS } from '../mock/products';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 获取产品列表
 */
export const getProducts = async (): Promise<ApiResponse<Product[]>> => {
  await sleep(700);
  return { code: 200, data: MOCK_PRODUCTS, message: 'success' };
};

/**
 * 获取产品核心指标
 */
export const getProductStats = async (): Promise<ApiResponse<ProductStats>> => {
  await sleep(400);
  return { code: 200, data: MOCK_PRODUCT_STATS, message: 'success' };
};

/**
 * 更新产品状态 (上架/下架)
 */
export const updateProductStatus = async (id: string, status: ProductStatus): Promise<ApiResponse<null>> => {
  await sleep(800);
  console.log(`Product ${id} status updated to ${status}`);
  return { code: 200, data: null, message: `产品已成功${status === 'active' ? '上架' : '下架'}` };
};

/**
 * 更新产品基本信息 (Mock)
 */
export const updateProduct = async (id: string, values: Partial<Product>): Promise<ApiResponse<null>> => {
  await sleep(1000);
  console.log(`Product ${id} updated:`, values);
  return { code: 200, data: null, message: '产品配置更新成功' };
};
