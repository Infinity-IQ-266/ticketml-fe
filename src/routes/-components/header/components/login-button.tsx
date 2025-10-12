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
                className="inline-flex items-center justify-center rounded-4xl border-2 border-black px-5 py-3 transition duration-200 hover:cursor-pointer hover:bg-black/10"
                type="button"
                onClick={() => setIsShowingDropdown((prev) => !prev)}
            >
                <p className="text-xl font-medium">Login</p>
                <ChevronDown
                    className={cn(
                        'ms-3 mt-1 text-black transition duration-200',
                        isShowingDropdown && 'rotate-180',
                    )}
                />
            </button>
            {isShowingDropdown && (
                <button
                    className="group animate-dropdown absolute -bottom-14 left-0 z-10 inline-flex origin-top transform items-center rounded-4xl border-2 border-black bg-white px-3 py-2.5 text-xl font-medium text-nowrap transition-all duration-300 ease-out hover:cursor-pointer"
                    type="button"
                    onClick={() => {
                        console.log('Login with Google OAuth');
                        window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;
                    }}
                >
                    <div className="pointer-events-none absolute inset-0 rounded-4xl bg-black/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    <p className="text-xl font-medium">Google</p>
                    <GoogleIcon className="ms-3 size-6" />
                </button>
            )}
        </div>
    );
};
