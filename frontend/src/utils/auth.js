import { useAuthStore } from "../store/auth";
import axios from "./axios";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";
const ACCESS_TOKEN_COOKIE_DAYS = 1;
const REFRESH_TOKEN_COOKIE_DAYS = 50;

const cookieOptions = {
    sameSite: "Lax",
    secure: import.meta.env.PROD,
    path: "/",
};

const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
});

export const clearAuthSession = () => {
    Cookies.remove(ACCESS_TOKEN_COOKIE, { path: "/" });
    Cookies.remove(REFRESH_TOKEN_COOKIE, { path: "/" });
    useAuthStore.getState().logout();
};

export const login = async (email, password) => {
    try {
        const { data, status } = await axios.post("user/token/", {
            email,
            password,
        });

        if (status === 200) {
            setAuthUser(data.access, data.refresh);
            Toast.fire({
                icon: "success",
                title: "Signed in successfully",
            });
        }

        return { data, error: null };
    } catch (error) {
        return {
            data: null,
            error: error.response?.data?.detail || "Something went wrong",
        };
    }
};

export const register = async (full_name, email, password, password2) => {
    try {
        const { data } = await axios.post("user/register/", {
            full_name,
            email,
            password,
            password2,
        });

        await login(email, password);

        Toast.fire({
            icon: "success",
            title: "Signed Up Successfully",
        });

        return { data, error: null };
    } catch (error) {
        return {
            data: null,
            error: error.response?.data || { message: "Something went wrong" },
        };
    }
};

export const logout = () => {
    clearAuthSession();
    Toast.fire({
        icon: "success",
        title: "You have been logged out.",
    });
};

export const setUser = async () => {
    const accessToken = Cookies.get(ACCESS_TOKEN_COOKIE);
    const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE);
    const storedRefreshToken = useAuthStore.getState().refreshToken;
    const sessionRefreshToken = refreshToken || storedRefreshToken;

    if (!accessToken && !sessionRefreshToken) {
        clearAuthSession();
        return;
    }

    try {
        if (!accessToken || isAccessTokenExpired(accessToken)) {
            const response = await getRefreshToken(sessionRefreshToken);
            setAuthUser(response.access, response.refresh || sessionRefreshToken);
        } else {
            setAuthUser(accessToken, sessionRefreshToken);
        }
    } catch (error) {
        console.error("Error setting user:", error);
        clearAuthSession();
    }
};

export const setAuthUser = (access_token, refresh_token) => {
    Cookies.set(ACCESS_TOKEN_COOKIE, access_token, {
        ...cookieOptions,
        expires: ACCESS_TOKEN_COOKIE_DAYS,
    });

    Cookies.set(REFRESH_TOKEN_COOKIE, refresh_token, {
        ...cookieOptions,
        expires: REFRESH_TOKEN_COOKIE_DAYS,
    });
    useAuthStore.getState().setTokens(access_token, refresh_token);

    const user = jwt_decode(access_token) ?? null;

    if (user) {
        useAuthStore.getState().setUser(user);
    }
};

export const getRefreshToken = async (refreshToken) => {
    const refresh_token = refreshToken || Cookies.get(REFRESH_TOKEN_COOKIE);
    const response = await axios.post("user/token/refresh/", {
        refresh: refresh_token,
    });
    return response.data;
};

export const isAccessTokenExpired = (accessToken) => {
    try {
        if (!accessToken) return true;
        const decodedToken = jwt_decode(accessToken);
        return decodedToken.exp < Date.now() / 1000;
    } catch (err) {
        return true;
    }
};