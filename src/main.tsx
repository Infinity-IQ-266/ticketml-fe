import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
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
        if (accessToken)
            config.headers.set('Authorization', `Bearer ${accessToken}`);
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
