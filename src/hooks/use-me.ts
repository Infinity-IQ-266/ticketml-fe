import { client } from '@/services/client/client.gen';
import type { MeData } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useMe = () => {
    const token = localStorage.getItem('access_token');

    return useQuery({
        queryKey: ['me'],
        enabled: !!token,
        queryFn: async () => {
            const freshToken = localStorage.getItem('access_token');
            const res = await client.get({
                url: 'api/v1/users/me',
                headers: freshToken
                    ? { Authorization: `Bearer ${freshToken}` }
                    : {},
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (res.data as any)?.data as MeData;
        },
        staleTime: 60 * 60 * 1000, // 1 hour cache
    });
};
