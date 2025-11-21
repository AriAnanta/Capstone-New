import { apiClient, unwrapData } from '@/api/client';
import { useAuthStore } from '@/store/authStore';

export const login = async (credentials) => {
    const data = await apiClient.post('/login', credentials).then(unwrapData);

    useAuthStore.getState().setAuth({
        token: data.token,
        user: data.user,
    });

    return data;
};

export const logout = async () => {
    try {
        await apiClient.post('/logout');
    } catch (error) {
        console.warn('Failed to call logout endpoint', error);
    } finally {
        useAuthStore.getState().logout();
    }
};
