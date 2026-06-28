import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Request interceptor — attach token (single source of truth: auth store)
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle 401 + token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post('/refresh-token');
        const newToken = data.data.token;
        useAuthStore.getState().setToken(newToken);
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;

// ─── Auth API ──────────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) =>
    api.post('/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/login', data),
  logout: () => api.post('/logout'),
  me: () => api.get('/me'),
};

// ─── Products API ──────────────────────────────────────────
export const productsApi = {
  list: (params?: Record<string, unknown>) => api.get('/products', { params }),
  featured: () => api.get('/products/featured'),
  detail: (slug: string) => api.get(`/products/${slug}`),
};

// ─── Categories API ────────────────────────────────────────
export const categoriesApi = {
  list: () => api.get('/categories'),
  detail: (slug: string) => api.get(`/categories/${slug}`),
};

// ─── Cart API ──────────────────────────────────────────────
export const cartApi = {
  list: () => api.get('/cart'),
  add: (data: { product_id: number; product_variant_id?: number; quantity: number }) =>
    api.post('/cart', data),
  update: (cartId: number, quantity: number) =>
    api.put(`/cart/${cartId}`, { quantity }),
  remove: (cartId: number) => api.delete(`/cart/${cartId}`),
  clear: () => api.delete('/cart'),
};

// ─── Orders API ─────────────────────────────────────────────
export const ordersApi = {
  list: () => api.get('/orders'),
  create: (data: {
    shipping_name: string;
    shipping_email: string;
    shipping_phone: string;
    shipping_address: string;
    shipping_city: string;
    shipping_postal_code: string;
    notes?: string;
  }) => api.post('/orders', data),
};

// ─── Payment API ────────────────────────────────────────────
export const paymentApi = {
  checkout: (orderId: number) => api.post('/payments/checkout', { order_id: orderId }),
};
