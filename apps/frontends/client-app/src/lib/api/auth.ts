import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

export const login = async (params: LoginParams) => {
  const { data } = await axios.post(`${API_URL}/auth/login`, params);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', data.data.accessToken);
    localStorage.setItem('refresh_token', data.data.refreshToken);
  }
  
  return data;
};

export const register = async (params: RegisterParams) => {
  const { data } = await axios.post(`${API_URL}/users/account`, {
    ...params,
    role: params.role || 'GUEST',
  });
  return data;
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export const getMe = async () => {
  const token = localStorage.getItem('access_token');
  const { data } = await axios.get(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
