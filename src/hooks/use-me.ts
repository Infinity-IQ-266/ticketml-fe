import { getCurrentUserOptions } from '@/services/client/@tanstack/react-query.gen';
import { useQuery } from '@tanstack/react-query';

export const useMe = () => {
    return useQuery({
        ...getCurrentUserOptions(),
        staleTime: 60 * 60 * 1000,
    });
};
