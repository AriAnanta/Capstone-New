import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            role: null,
            user: null,
            setAuth: ({ token, user }) =>
                set({
                    token,
                    user,
                    role: user?.role ?? null,
                }),
            setUser: (user) => 
                set((state) => ({
                    user,
                    role: user?.role ?? state.role,
                })),
            logout: () => set({ token: null, role: null, user: null }),
        }),
        {
            name: 'pta-auth-store',
            partialize: (state) => ({ token: state.token, role: state.role, user: state.user }),
        },
    ),
);
