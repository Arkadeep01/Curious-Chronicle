import { useAuthStore } from "../store/auth";

// Importing the axios library for making HTTP requests
import axios from "./axios";

// Importing jwt_decode to decode JSON Web Tokens
import jwt_decode from "jwt-decode";

// Importing the Cookies library to handle browser cookies
import Cookies from "js-cookie";

// Importing Swal (SweetAlert2) for displaying toast notifications
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

// Configuring global toast notifications using Swal.mixin
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

// Function to handle user login
export const login = async (email, password) => {
    try {
        // Making a POST request to obtain user tokens
        const { data, status } = await axios.post("user/token/", {
            email,
            password,
        });

        // If the request is successful (status code 200), set authentication user and display success toast
        if (status === 200) {
            setAuthUser(data.access, data.refresh);

            // Displaying a success toast notification
            Toast.fire({
                icon: "success",
                title: "Signed in successfully",
            });
        }

        // Returning data and error information
        return { data, error: null };
    } catch (error) {
        // Handling errors and returning data and error information
        return {
            data: null,
            error: error.response.data?.detail || "Something went wrong",
        };
    }
};

// Function to handle user registration
export const register = async (full_name, email, password, password2) => {
    try {
        // Making a POST request to register a new user
        const { data } = await axios.post("user/register/", {
            full_name,
            email,
            password,
            password2,
        });

        // Logging in the newly registered user and displaying success toast
        await login(email, password);

        // Displaying a success toast notification
        Toast.fire({
            icon: "success",
            title: "Signed Up Successfully",
        });

        // Returning data and error information
        return { data, error: null };
    } catch (error) {
        // Handling errors and returning data and error information
        return {
            data: null,
            error: error.response?.data || { message: "Something went wrong" },
        };
    }
};

// Function to handle user logout
export const logout = () => {
    // Removing access and refresh tokens from cookies, resetting user state, and displaying success toast
    clearAuthSession();

    // Displaying a success toast notification
    Toast.fire({
        icon: "success",
        title: "You have been logged out.",
    });
};

// Function to set the authenticated user on page load
export const setUser = async () => {
    // Retrieving access and refresh tokens from cookies
    const accessToken = Cookies.get(ACCESS_TOKEN_COOKIE);
    const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE);
    const storedRefreshToken = useAuthStore.getState().refreshToken;
    const sessionRefreshToken = refreshToken || storedRefreshToken;

    // A refresh token is enough to remember the browser session.
    if (!accessToken && !sessionRefreshToken) {
        clearAuthSession();
        return;
    }

    try {
        // If access token is expired, refresh it; otherwise, set the authenticated user
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

// Function to set the authenticated user and update user state
export const setAuthUser = (access_token, refresh_token) => {
    // Setting access and refresh tokens in cookies with expiration dates
    Cookies.set(ACCESS_TOKEN_COOKIE, access_token, {
        ...cookieOptions,
        expires: ACCESS_TOKEN_COOKIE_DAYS,
    });

    Cookies.set(REFRESH_TOKEN_COOKIE, refresh_token, {
        ...cookieOptions,
        expires: REFRESH_TOKEN_COOKIE_DAYS,
    });
    useAuthStore.getState().setTokens(access_token, refresh_token);

    // Decoding access token to get user information
    const user = jwt_decode(access_token) ?? null;

    // If user information is present, update user state; otherwise, set loading state to false
    if (user) {
        useAuthStore.getState().setUser(user);
    }
    useAuthStore.getState().setLoading(false);
};

// Function to refresh the access token using the refresh token
export const getRefreshToken = async (refreshToken) => {
    // Retrieving refresh token from cookies and making a POST request to refresh the access token
    const refresh_token = refreshToken || Cookies.get(REFRESH_TOKEN_COOKIE);
    const response = await axios.post("user/token/refresh/", {
        refresh: refresh_token,
    });

    // Returning the refreshed access token
    return response.data;
};

// Function to check if the access token is expired
export const isAccessTokenExpired = (accessToken) => {
    try {
        if (!accessToken) return true;

        // Decoding the access token and checking if it has expired
        const decodedToken = jwt_decode(accessToken);
        return decodedToken.exp < Date.now() / 1000;
    } catch (err) {
        // Returning true if the token is invalid or expired
        return true;
    }
};
