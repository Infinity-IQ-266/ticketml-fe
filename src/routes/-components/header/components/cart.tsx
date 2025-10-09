import { ShoppingCart } from 'lucide-react';

export const Cart = () => {
    return (
        <button className="relative inline-flex size-14 items-center justify-center rounded-full border-2 border-black transition duration-200 hover:cursor-pointer hover:bg-black/10">
            <div className="absolute -top-2 -right-2 inline-flex size-7 items-center justify-center rounded-full bg-primary">
                <span className="absolute z-10 size-full animate-ping rounded-full bg-primary/50" />
                <p className="z-0 font-medium">6</p>
            </div>
            <ShoppingCart className="text-black" />
        </button>
    );
};
