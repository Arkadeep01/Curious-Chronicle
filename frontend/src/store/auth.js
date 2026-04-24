import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

// Create the Zustand store using middleware (persist + devtools)
const useAuthStore = create(
    devtools(
        persist(
            (set, get) => ({
                // ================================
                // STATE VARIABLES
                // ================================

                user: null,               // Store authenticated user data
                accessToken: null,        // Store JWT access token (used for API requests)
                refreshToken: null,       // Store refresh token (used to get new access token)
                loading: false,           // Loading state (useful for async auth operations)


                // ================================
                // ACTIONS (STATE MUTATORS)
                // ================================

                // Set authentication data after login/register
                setAuth: (data) => {
                    set({
                        user: data.user,
                        accessToken: data.access,
                        refreshToken: data.refresh,
                    });
                },
                setUser: (user) => set({ user }),
                setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),

                // Clear all authentication data (logout)
                logout: () => {
                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                    });
                },
                setLoading: (loading) => set({ loading }),      // Update loading state

                // Check if user is logged in (based on access token)
                isLoggedIn: () => !!get().accessToken,
            }),
            {
                // ================================
                // PERSIST CONFIGURATION
                // ================================

                name: 'auth-storage',               // Name of the key in localStorage

                // Only persist specific parts of the state
                partialize: (state) => ({
                    user: state.user,
                    accessToken: state.accessToken,
                    refreshToken: state.refreshToken,
                }),
            }
        ),
        {
            // ================================
            // DEVTOOLS CONFIGURATION
            // ================================
            
            name: 'AuthStore',                // Name shown in Redux DevTools
            enabled: import.meta.env.DEV,     // Enable devtools only in development mode
        }
    )
);

export { useAuthStore };
