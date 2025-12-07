import { UserIcon } from '@/assets/icons';
import { useMe } from '@/hooks';
import { cn } from '@/lib/utils';
import type { MeData } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { ChevronDown } from 'lucide-react';
import { type RefObject, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

export const UserAvatar = () => {
    const [isShowingDropdown, setIsShowingDropdown] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { data: rawMeData } = useMe();
    const meData = rawMeData?.data as MeData;

    // const { data: orgResponse } = useQuery({
    //     ...getMyOrganizationsOptions(),
    //     staleTime: 60 * 60 * 1000,
    // });

    useOnClickOutside(ref as RefObject<HTMLDivElement>, () =>
        setIsShowingDropdown(false),
    );

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        queryClient.removeQueries();
        navigate({ to: '/' });
    };
    return (
        <div
            className="relative w-fit rounded-full border-2 border-black bg-white shadow-md"
            ref={ref}
        >
            <button
                className="group inline-flex items-center justify-center rounded-full transition-all duration-200 hover:cursor-pointer hover:bg-primary/10"
                type="button"
                title="User Avatar"
                onClick={() => {
                    setIsShowingDropdown((prev) => !prev);
                }}
            >
                <div className="-ml-[2px] inline-flex size-14 items-center justify-center rounded-full border-2 border-black bg-gradient-to-br from-primary/20 to-secondary/20">
                    <UserIcon className="aspect-[34/38] h-auto w-8" />
                </div>
                <div className="inline-flex items-center justify-center px-3">
                    <p className="max-w-28 truncate text-xl font-bold text-nowrap text-black">
                        {meData?.fullName}
                    </p>
                    <ChevronDown
                        className={cn(
                            'ms-2 mt-1 text-black transition-all duration-200',
                            isShowingDropdown && 'rotate-180',
                        )}
                    />
                </div>
            </button>
            <div
                className={cn(
                    'absolute top-full left-0 mt-3 flex w-full transform flex-col items-center overflow-hidden rounded-2xl border-2 border-black bg-white text-xl font-medium text-nowrap shadow-xl transition-all duration-300',
                    isShowingDropdown
                        ? 'animate-dropdown origin-top opacity-100 ease-out'
                        : 'animate-dropdown-reverse pointer-events-none origin-bottom opacity-0 ease-in',
                )}
            >
                <button
                    className="z-10 inline-flex w-full items-center justify-center px-4 py-3 text-xl font-medium text-nowrap transition-all duration-200 hover:cursor-pointer hover:bg-primary/10"
                    type="button"
                    onClick={() => console.log('Switch to Organizer account')}
                >
                    <p className="truncate text-xl font-bold text-gray">
                        NTPMM Orgz
                    </p>
                </button>
                <hr className="w-full border-t border-gray-light" />

                <button
                    className="z-10 inline-flex w-full items-center justify-center px-4 py-3 text-xl font-medium text-nowrap transition-all duration-200 hover:cursor-pointer hover:bg-primary/10"
                    onClick={() => console.log('Login with Google OAuth')}
                >
                    <p className="truncate text-xl font-bold text-gray">
                        GENFEST Orgz
                    </p>
                </button>

                <hr className="w-full border-t border-gray-light" />

                <button
                    className="z-10 inline-flex w-full items-center justify-center px-4 py-3 text-xl font-medium text-nowrap transition-all duration-200 hover:cursor-pointer hover:bg-red/10"
                    type="button"
                    onClick={handleLogout}
                >
                    <p className="text-xl font-bold text-red">Log out</p>
                </button>
            </div>
        </div>
    );
};
