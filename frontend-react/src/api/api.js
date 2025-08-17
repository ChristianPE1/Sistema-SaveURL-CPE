import axios from 'axios';
import { ACCESS_TOKEN } from './constants';

const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
});

const publicPaths = ['/login', '/register'];

const isPublicEndpoint = (url) => {
   if (!url) return false;
   // Para URLs relativas como '/login' que axios usa con baseURL
   return publicPaths.some(p => url.endsWith(p) || url.endsWith(p + '/'));
}

api.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      console.log('Request interceptor - Token:', token ? 'exists' : 'missing');
      console.log('Request interceptor - URL:', config.url);
      console.log('Request interceptor - Is public:', isPublicEndpoint(config.url));

      if (token && !isPublicEndpoint(config.url)) {
         config.headers.Authorization = `Bearer ${token}`;
         console.log('Token added to headers');
      } else {
         console.log('Token not added - either missing or public endpoint');
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

// Interceptor para responses - manejar errores de autenticación
api.interceptors.response.use(
   (response) => {
      return response;
   },
   (error) => {
      if (error.response?.status === 401) {
         // Token expirado o inválido
         localStorage.removeItem(ACCESS_TOKEN);
         // Opcional: redirigir a login
         // window.location.href = '/login';
      }
      return Promise.reject(error);
   }
);

export default api;
