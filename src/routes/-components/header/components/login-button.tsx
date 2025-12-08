import { GoogleIcon } from '@/assets/icons';
import { BACKEND_URL } from '@/envs';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { type RefObject, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

export const LoginButton = () => {
    const [isShowingDropdown, setIsShowingDropdown] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useOnClickOutside(ref as RefObject<HTMLDivElement>, () =>
        setIsShowingDropdown(false),
    );
    return (
        <div className="relative inline-block" ref={ref}>
            <button
                className="inline-flex items-center justify-center rounded-full border border-gray-light bg-white px-5 py-2.5 shadow-sm transition-all duration-200 hover:border-primary hover:bg-primary/10 hover:shadow-md active:scale-95 md:px-6 md:py-3"
                type="button"
                onClick={() => setIsShowingDropdown((prev) => !prev)}
            >
                <p className="text-base font-semibold text-black md:text-xl">
                    Login
                </p>
                <ChevronDown
                    className={cn(
                        'ms-2 mt-0.5 size-4 text-black transition-all duration-200 md:ms-3 md:mt-1 md:size-5',
                        isShowingDropdown && 'rotate-180',
                    )}
                />
            </button>
            {isShowingDropdown && (
                <button
                    className="group animate-dropdown absolute -bottom-12 left-0 z-10 inline-flex origin-top items-center gap-2 rounded-lg border border-gray-light bg-white px-4 py-2.5 text-base font-medium text-nowrap shadow-lg transition-all duration-200 hover:border-primary/50 hover:shadow-xl active:scale-95 md:-bottom-14 md:rounded-full md:text-lg"
                    type="button"
                    onClick={() => {
                        window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;
                    }}
                >
                    <GoogleIcon className="size-5 transition-transform duration-200 group-hover:scale-110 md:size-6" />
                    <span className="font-semibold text-black">Google</span>
                </button>
            )}
        </div>
    );
};
