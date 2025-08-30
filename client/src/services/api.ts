import axios from 'axios';

// API Configuration - Update this to match your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_ORIGIN = API_BASE_URL.replace(/\/$/, '').replace(/\/(api)(\/.*)?$/, '');

const toAbsoluteUrl = (url?: string | null) => {
  if (!url) return url as any;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return `${API_ORIGIN}${url}`;
  return `${API_ORIGIN}/${url}`;
};

// Small helper to notify app about auth changes
const emitAuthChanged = () => {
  try { window.dispatchEvent(new Event('authChanged')); } catch (_) {}
};

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      emitAuthChanged();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/*
 * Test Credentials for initial testing:
 * 
 * Regular User:
 * Email: user@example.com
 * Password: password123
 * 
 * Admin User:
 * Email: admin@example.com
 * Password: admin123
 */

// Auth API endpoints
export const authAPI = {
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const payload = res.data;
    const token = payload?.data?.token || payload?.token;
    const user = payload?.data?.user || payload?.user;
    if (token && user) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      emitAuthChanged();
    }
    return payload;
  },
  
  register: async (username: string, email: string, password: string) => {
    const res = await api.post('/auth/register', { username, email, password });
    const payload = res.data;
    const token = payload?.data?.token || payload?.token;
    const user = payload?.data?.user || payload?.user;
    if (token && user) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      emitAuthChanged();
    }
    return payload;
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    emitAuthChanged();
  },
};

// Anime API endpoints
export const animeAPI = {
  getList: async (params?: { page?: number; limit?: number; type?: string; category?: string; search?: string; }) => {
    const res = await api.get('/anime/list', { params });
    const payload = res.data; // { success, data: { animes, pagination } }
    const animes = (payload?.data?.animes || []).map((a: any) => ({
      ...a,
      thumbnailUrl: toAbsoluteUrl(a.thumbnailUrl),
      videoUrl: toAbsoluteUrl(a.videoUrl),
      pdfUrl: toAbsoluteUrl(a.pdfUrl),
    }));
    return { ...payload, data: { ...(payload?.data || {}), animes } };
  },
  
  getById: async (id: string) => {
    const res = await api.get(`/anime/${id}`);
    const payload = res.data; // { success, data: { anime } }
    const anime = payload?.data?.anime || payload?.data || payload;
    // Map helper fields expected by UI
    const fileUrl = anime?.type === 'video' ? toAbsoluteUrl(anime?.videoUrl) : toAbsoluteUrl(anime?.pdfUrl);
    const uploadedBy = anime?.creator?.username || anime?.uploadedBy || 'Unknown';
    const thumbnailUrl = toAbsoluteUrl(anime?.thumbnailUrl);
    return { ...anime, fileUrl, uploadedBy, thumbnailUrl };
  },
  
  search: async (query: string, type?: string, category?: string) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (type) params.append('type', type);
    if (category) params.append('category', category);
    const res = await api.get(`/anime/search?${params.toString()}`);
    const payload = res.data;
    const animes = (payload?.data?.animes || []).map((a: any) => ({
      ...a,
      thumbnailUrl: toAbsoluteUrl(a.thumbnailUrl),
      videoUrl: toAbsoluteUrl(a.videoUrl),
      pdfUrl: toAbsoluteUrl(a.pdfUrl),
    }));
    return { ...payload, data: { ...(payload?.data || {}), animes } };
  },
  
  upload: async (animeData: FormData) => {
    // Large uploads can take a while; override timeout just for this call
    const res = await api.post('/anime/upload', animeData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 5 * 60 * 1000, // 5 minutes
      // Keep connection alive for long uploads
      maxContentLength: Infinity as any,
      maxBodyLength: Infinity as any,
    });
    return res.data; // { success, data: { anime } }
  },
  
  update: async (id: string, animeData: any) => {
    // Check if animeData is FormData (has files) or plain object
    if (animeData instanceof FormData) {
      const res = await api.put(`/anime/${id}`, animeData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 5 * 60 * 1000, // 5 minutes for file uploads
        maxContentLength: Infinity as any,
        maxBodyLength: Infinity as any,
      });
      return res.data;
    } else {
      const res = await api.put(`/anime/${id}`, animeData);
      return res.data;
    }
  },
  
  delete: async (id: string) => {
    const res = await api.delete(`/anime/${id}`);
    return res.data;
  },
  
  getComments: async (id: string) => {
    const res = await api.get(`/anime/${id}/comments`);
    return res.data; // { success, data: { comments, pagination } }
  },
  
  addComment: async (id: string, comment: string) => {
    const res = await api.post(`/anime/${id}/comments`, { comment });
    return res.data; // { success, data: { comment } }
  },
  
  toggleFavorite: async (id: string) => {
    const res = await api.post(`/anime/${id}/favorite`);
    const data = res.data; // { success, data: { isFavorited } }
    return { isFavorite: data?.data?.isFavorited === true };
  },
  
  // Episodes
  getEpisodes: async (animeId: string) => {
    const res = await api.get(`/anime/${animeId}/episodes`);
    const payload = res.data;
    const episodes = (payload?.data?.episodes || []).map((ep: any) => ({
      ...ep,
      thumbnailUrl: toAbsoluteUrl(ep.thumbnailUrl),
      videoUrl: toAbsoluteUrl(ep.videoUrl),
      pdfUrl: toAbsoluteUrl(ep.pdfUrl),
    }));
    return { ...payload, data: { episodes } };
  },
  createEpisode: async (animeId: string, form: FormData) => {
    const res = await api.post(`/anime/${animeId}/episodes`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 5 * 60 * 1000,
      maxContentLength: Infinity as any,
      maxBodyLength: Infinity as any,
    });
    return res.data;
  },
  updateEpisode: async (id: string, form: FormData | any) => {
    const res = await api.put(`/anime/episodes/${id}`, form);
    return res.data;
  },
  deleteEpisode: async (id: string) => {
    const res = await api.delete(`/anime/episodes/${id}`);
    return res.data;
  },
};

// User API endpoints
export const userAPI = {
  getFavorites: async () => {
    const res = await api.get('/favorites/user');
    const payload = res.data; // { success, data: { favorites, pagination } }
    const items = (payload?.data?.favorites || []).map((f: any) => {
      const a = f.anime || f;
      return {
        ...a,
        thumbnailUrl: toAbsoluteUrl(a.thumbnailUrl),
        videoUrl: toAbsoluteUrl(a.videoUrl),
        pdfUrl: toAbsoluteUrl(a.pdfUrl),
      };
    });
    return { ...payload, data: { ...(payload?.data || {}), favorites: items } };
  },
  
  getProfile: async () => {
    const res = await api.get('/user/profile');
    const payload = res.data; // { success, data: { profile, stats } } or similar
    const user = payload?.data?.user || payload?.data?.profile || payload;
    if (user) {
      user.avatarUrl = toAbsoluteUrl(user.avatarUrl);
    }
    return { ...payload, data: { ...(payload?.data || {}), user } };
  },
  
  updateProfile: async (profileData: any) => {
    // Check if profileData is FormData (has files) or plain object
    if (profileData instanceof FormData) {
      const res = await api.put('/user/profile', profileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 5 * 60 * 1000, // 5 minutes for file uploads
        maxContentLength: Infinity as any,
        maxBodyLength: Infinity as any,
      });
      return res.data;
    } else {
      const res = await api.put('/user/profile', profileData);
      return res.data;
    }
  },
};

// Admin API endpoints
export const adminAPI = {
  getUsers: async () => {
    const res = await api.get('/admin/users');
    const payload = res.data; // { success, data: { users, pagination } }
    return payload?.data?.users || [];
  },
  
  getUser: async (id: string) => {
    const res = await api.get(`/admin/users/${id}`);
    return res.data; // { success, data: { user, stats } }
  },
  
  updateUser: async (id: string, userData: any) => {
    const res = await api.put(`/admin/users/${id}`, userData);
    return res.data;
  },
  
  deleteUser: async (id: string) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },
  
  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data; // { success, data: { ... } }
  },
};

export default api;