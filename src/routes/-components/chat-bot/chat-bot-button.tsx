import { MessageCircle } from 'lucide-react';

interface ChatBotButtonProps {
    onClick: () => void;
}

export const ChatBotButton = ({ onClick }: ChatBotButtonProps) => {
    return (
        <button
            onClick={onClick}
            className="group fixed right-6 bottom-6 z-50 flex size-14 items-center justify-center rounded-full bg-primary shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
            aria-label="Open chat"
        >
            <MessageCircle className="size-7 text-black transition-transform duration-300 group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 flex size-3 items-center justify-center">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-red opacity-75" />
                <span className="relative inline-flex size-3 rounded-full bg-red" />
            </span>
        </button>
    );
};
