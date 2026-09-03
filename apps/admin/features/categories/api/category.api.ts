import { apiClient } from '@/lib/api-client';
import { Category } from '../types/category.type';

export const categoryApi = {
  /**
   * Get all categories from backend
   */
  getCategories: async (): Promise<Category[]> => {
    return apiClient.get<Category[]>('/categories');
  },

  /**
   * Get category by ID
   */
  getCategoryById: async (id: number): Promise<Category> => {
    return apiClient.get<Category>(`/categories/${id}`);
  },
};
