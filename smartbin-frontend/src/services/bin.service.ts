import api from './api';
import { Reading } from './reading.service';

export interface Bin {
  _id: string;
  binId: string;
  name: string;
  location: string;
  heightCm: number;
  warningThreshold: number;
  criticalThreshold: number;
  latestReading: Reading | null;
}

export const binService = {
  getAll: async (): Promise<Bin[]> => {
    const { data } = await api.get<{ status: string; data: Bin[] }>('/bins');
    return data.data;
  },

  getById: async (binId: string): Promise<Bin> => {
    const { data } = await api.get<{ status: string; data: Bin }>(`/bins/${binId}`);
    return data.data;
  },
};
