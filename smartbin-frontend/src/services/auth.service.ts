import api from './api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface Admin {
  id: string;
  name: string;
  username: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await api.post<{ status: string; data: LoginResponse }>(
      '/auth/login',
      payload,
    );
    return data.data;
  },
};
