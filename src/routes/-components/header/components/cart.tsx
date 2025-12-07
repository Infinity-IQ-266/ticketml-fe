import { ShoppingCart } from 'lucide-react';

export const Cart = () => {
    return (
        <button className="group relative inline-flex size-10 items-center justify-center rounded-full border-2 border-black bg-white shadow-sm transition-all duration-200 hover:border-primary hover:bg-primary/10 hover:shadow-md active:scale-95 md:size-14">
            <div className="absolute -top-2.5 -right-2.5 inline-flex size-5 items-center justify-center rounded-full bg-primary shadow-md md:size-7">
                <span className="absolute z-10 size-full animate-ping rounded-full bg-primary/50" />
                <p className="relative z-20 text-xs font-bold text-black md:text-sm">
                    6
                </p>
            </div>
            <ShoppingCart className="text-black transition-transform duration-200 group-hover:scale-110" />
        </button>
    );
};
