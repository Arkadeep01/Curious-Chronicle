import axios from 'axios';
import Cookies from 'js-cookie';
import { getRefreshToken, clearAuthSession, isAccessTokenExpired } from './auth';

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";

const apiInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1/',
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

apiInstance.interceptors.request.use(
    (config) => {
        const accessToken = Cookies.get(ACCESS_TOKEN_COOKIE);
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE);
                if (!refreshToken) {
                    clearAuthSession();
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                const response = await getRefreshToken(refreshToken);
                
                Cookies.set(ACCESS_TOKEN_COOKIE, response.access, {
                    expires: 1,
                    sameSite: 'Lax',
                    secure: import.meta.env.PROD,
                    path: '/',
                });
                Cookies.set(REFRESH_TOKEN_COOKIE, response.refresh || refreshToken, {
                    expires: 50,
                    sameSite: 'Lax',
                    secure: import.meta.env.PROD,
                    path: '/',
                });

                originalRequest.headers.Authorization = `Bearer ${response.access}`;
                return apiInstance(originalRequest);
            } catch (refreshError) {
                clearAuthSession();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiInstance;