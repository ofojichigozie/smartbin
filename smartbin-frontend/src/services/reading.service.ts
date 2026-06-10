import api from './api';

export interface Reading {
  _id: string;
  binId: string;
  distanceCm: number;
  fillPercentage: number;
  timestamp: string;
}

export const readingService = {
  getAll: async (binId?: string, limit?: number): Promise<Reading[]> => {
    const params: Record<string, string> = {};
    if (binId) params.binId = binId;
    if (limit) params.limit = String(limit);
    const { data } = await api.get<{ status: string; data: Reading[] }>('/readings', { params });
    return data.data;
  },

  getByBin: async (binId: string, limit?: number): Promise<Reading[]> => {
    const params = limit ? { limit: String(limit) } : {};
    const { data } = await api.get<{ status: string; data: Reading[] }>(`/readings/${binId}`, {
      params,
    });
    return data.data;
  },

  delete: async (id: string): Promise<Reading> => {
    const { data } = await api.delete<{ status: string; data: Reading }>(`/readings/${id}`);
    return data.data;
  },
};
