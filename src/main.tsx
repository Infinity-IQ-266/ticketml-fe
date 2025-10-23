import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

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
    const accessToken = localStorage.getItem('access_token');
    client.instance.interceptors.request.use((config) => {
        if (accessToken)
            config.headers.set('Authorization', `Bearer ${accessToken}`);
        return config;
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
