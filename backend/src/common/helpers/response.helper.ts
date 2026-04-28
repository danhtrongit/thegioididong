import { ApiResponse, PaginationMeta } from '../interfaces/api-response.interface.js';

export function successResponse<T>(
  data: T,
  message = 'Thao tác thành công',
  meta?: Record<string, any>,
): ApiResponse<T> {
  return { success: true, message, data, meta };
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = 'Lấy dữ liệu thành công',
): ApiResponse<T[]> {
  const totalPages = Math.ceil(total / limit);
  const meta: PaginationMeta = { page, limit, total, totalPages };
  return { success: true, message, data, meta };
}
