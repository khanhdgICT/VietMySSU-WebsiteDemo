import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — refresh token
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        Cookies.set('accessToken', data.accessToken, { expires: 1 });
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  },
);

// Auth
export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  setup2FA: () => api.get('/auth/2fa/setup'),
  enable2FA: (code: string) => api.post('/auth/2fa/enable', { code }),
  verify2FA: (code: string) => api.post('/auth/2fa/verify', { code }),
};

// Posts
export const postsApi = {
  getAll: (params?: object) => api.get('/posts', { params }),
  getBySlug: (slug: string) => api.get(`/posts/${slug}`),
  adminGetAll: (params?: object) => api.get('/admin/posts', { params }),
  getById: (id: string) => api.get(`/admin/posts/${id}`),
  create: (data: object) => api.post('/admin/posts', data),
  update: (id: string, data: object) => api.put(`/admin/posts/${id}`, data),
  delete: (id: string) => api.delete(`/admin/posts/${id}`),
};

// Jobs
export const jobsApi = {
  getAll: (params?: object) => api.get('/jobs', { params }),
  getBySlug: (slug: string) => api.get(`/jobs/${slug}`),
  apply: (id: string, data: object) => api.post(`/jobs/${id}/apply`, data),
  adminGetAll: (params?: object) => api.get('/admin/jobs', { params }),
  getById: (id: string) => api.get(`/admin/jobs/${id}`),
  getApplications: (params?: object) => api.get('/admin/jobs/applications', { params }),
  create: (data: object) => api.post('/admin/jobs', data),
  update: (id: string, data: object) => api.put(`/admin/jobs/${id}`, data),
  delete: (id: string) => api.delete(`/admin/jobs/${id}`),
};

// Contact
export const contactApi = {
  submit: (data: object) => api.post('/contact', data),
  adminGetAll: (params?: object) => api.get('/admin/contact', { params }),
  getStats: () => api.get('/admin/contact/stats'),
  updateStatus: (id: string, status: string, notes?: string) =>
    api.put(`/admin/contact/${id}/status`, { status, notes }),
  delete: (id: string) => api.delete(`/admin/contact/${id}`),
};

// Analytics
export const analyticsApi = {
  getDashboard: () => api.get('/admin/analytics/dashboard'),
  getContactChart: (days?: number) => api.get('/admin/analytics/contact-chart', { params: { days } }),
  getPostViewsChart: (days?: number) => api.get('/admin/analytics/post-views-chart', { params: { days } }),
  getRecentActivity: () => api.get('/admin/analytics/recent-activity'),
};

// Categories
export const categoriesApi = {
  getAll: (type?: string) => api.get('/categories', { params: { type } }),
};

// Menu
export const menuApi = {
  getHeader: () => api.get('/menu', { params: { location: 'header' } }),
  getFooter: () => api.get('/menu', { params: { location: 'footer' } }),
  getAll: () => api.get('/menu/all'),
  create: (data: object) => api.post('/menu', data),
  update: (id: string, data: object) => api.put(`/menu/${id}`, data),
  delete: (id: string) => api.delete(`/menu/${id}`),
};

// Users
export const usersApi = {
  getAll: (params?: object) => api.get('/admin/users', { params }),
  create: (data: object) => api.post('/admin/users', data),
  update: (id: string, data: object) => api.put(`/admin/users/${id}`, data),
  delete: (id: string) => api.delete(`/admin/users/${id}`),
};

// Roles
export const rolesApi = {
  getAll: () => api.get('/admin/roles'),
  getPermissions: () => api.get('/admin/roles/permissions'),
  create: (data: object) => api.post('/admin/roles', data),
  update: (id: string, data: object) => api.put(`/admin/roles/${id}`, data),
  delete: (id: string) => api.delete(`/admin/roles/${id}`),
};

// Audit logs
export const auditApi = {
  getAll: (params?: object) => api.get('/admin/audit-logs', { params }),
};

// Upload
export const uploadApi = {
  image: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

const BACKEND_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1').replace('/api/v1', '');
export function getImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BACKEND_BASE}${path}`;
}
