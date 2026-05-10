import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            _hasHydrated: false,

            setAuth: (data) => set({
                user: data.user,
                accessToken: data.access,
                refreshToken: data.refresh,
            }),
            
            setUser: (user) => set({ user }),
            
            setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
            
            logout: () => set({
                user: null,
                accessToken: null,
                refreshToken: null,
            }),
            
            setHydrated: (state) => set({ _hasHydrated: state }),

            isLoggedIn: () => {
                // Don't allow access until store is hydrated
                if (!get()._hasHydrated) return false;
                return !!get().accessToken;
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Small delay to ensure hydration is complete
                    setTimeout(() => state.setHydrated(true), 50);
                }
            },
        }
    )
);

export { useAuthStore };