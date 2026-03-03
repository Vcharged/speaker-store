import axios from 'axios';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './auth';

const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as { _retry?: boolean };
    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true;
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken,
        });
        const tokens = refreshResponse.data.tokens;
        setTokens(tokens.accessToken, tokens.refreshToken);
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return api(original);
      } catch (refreshError) {
        clearTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
