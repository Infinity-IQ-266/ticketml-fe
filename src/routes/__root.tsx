import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { Header } from './-components';

const RootLayout = () => (
    <>
        <Header />
        <TanStackRouterDevtools />
        <ReactQueryDevtools />
        <Outlet />
    </>
);

export const Route = createRootRoute({ component: RootLayout });
