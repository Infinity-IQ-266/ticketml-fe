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
                className="inline-flex items-center justify-center rounded-full border-2 border-black bg-white px-6 py-3 shadow-sm transition-all duration-200 hover:cursor-pointer hover:border-primary hover:bg-primary/10 hover:shadow-md active:scale-95"
                type="button"
                onClick={() => setIsShowingDropdown((prev) => !prev)}
            >
                <p className="text-xl font-semibold text-black">Login</p>
                <ChevronDown
                    className={cn(
                        'ms-3 mt-1 text-black transition-all duration-200',
                        isShowingDropdown && 'rotate-180',
                    )}
                />
            </button>
            {isShowingDropdown && (
                <button
                    className="group animate-dropdown absolute -bottom-14 left-0 z-10 inline-flex origin-top transform items-center rounded-full border-2 border-black bg-white px-4 py-2.5 text-xl font-medium text-nowrap shadow-lg transition-all duration-300 ease-out hover:cursor-pointer hover:border-primary hover:bg-primary/10 hover:shadow-xl active:scale-95"
                    type="button"
                    onClick={() => {
                        console.log('Login with Google OAuth');
                        window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;
                    }}
                >
                    <p className="text-xl font-semibold text-black">Google</p>
                    <GoogleIcon className="ms-3 size-6 transition-transform duration-200 group-hover:scale-110" />
                </button>
            )}
        </div>
    );
};
