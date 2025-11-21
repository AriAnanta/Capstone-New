import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './router';

const container = document.getElementById('app');

if (container) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: 1,
            },
        },
    });

    createRoot(container).render(
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <AppRouter />
            </QueryClientProvider>
        </React.StrictMode>,
    );
}
