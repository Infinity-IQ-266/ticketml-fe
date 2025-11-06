import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { jwtDecode } from 'jwt-decode';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { BACKEND_URL } from './envs';
import './index.css';
import { routeTree } from './routeTree.gen';
import { client } from './services/client/client.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
    const queryClient = new QueryClient();

    //Query configs:

    client.instance.interceptors.request.use((config) => {
        const accessToken = localStorage.getItem('access_token');

        if (accessToken) {
            const { exp } = jwtDecode(accessToken);
            const now = Date.now() / 1000;
            if (exp && exp < now) {
                localStorage.removeItem('access_token');
            }
            config.headers.set('Authorization', `Bearer ${accessToken}`);
        }
        return config;
    });

    client.setConfig({
        baseURL: BACKEND_URL,
    });

    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </StrictMode>,
    );
}
