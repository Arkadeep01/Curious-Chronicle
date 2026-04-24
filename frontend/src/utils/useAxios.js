import axios from 'axios';
import { getRefreshToken, isAccessTokenExpired, setAuthUser } from './auth'; 
import { API_BASE_URL } from './constants';
import Cookies from 'js-cookie';

// Define a custom Axios instance creator function
const useAxios = () => {

    // CREATE AXIOS INSTANCE
    const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
    });

    // REQUEST INTERCEPTOR
    axiosInstance.interceptors.request.use(
        async (req) => {

            // Always get the latest tokens (avoid stale closure)
            let accessToken = Cookies.get('access_token');
            let refreshToken = Cookies.get('refresh_token');

            // CHECK TOKEN EXPIRY
            if (accessToken && !isAccessTokenExpired(accessToken)) {
                
                req.headers.Authorization = `Bearer ${accessToken}`;        // Attach valid access token
                return req;
            }

            // REFRESH TOKEN FLOW
            if (refreshToken) {
                try {
                    const response = await getRefreshToken(refreshToken);
                    setAuthUser(response.access, response.refresh || refreshToken);               // Update stored tokens
                    req.headers.Authorization = `Bearer ${response.access}`;          // Attach new access token to request
                    return req;
                } catch (error) {
                    console.error('Token refresh failed:', error);

                    // Optional: clear auth & redirect
                    Cookies.remove('access_token');
                    Cookies.remove('refresh_token');
                    window.location.href = '/login';

                    return Promise.reject(error);
                }
            }
            return req;
        },
        (error) => Promise.reject(error)
    );

    // RESPONSE INTERCEPTOR (GLOBAL ERROR HANDLING)
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {

            // If unauthorized → force logout
            if (error.response?.status === 401) {
                Cookies.remove('access_token');
                Cookies.remove('refresh_token');

                window.location.href = '/login';
            }

            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export default useAxios;
