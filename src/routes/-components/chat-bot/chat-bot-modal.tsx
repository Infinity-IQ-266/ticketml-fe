import { cn } from '@/lib/utils';
import { handleChatMessageMutation } from '@/services/client/@tanstack/react-query.gen';
import { useMutation } from '@tanstack/react-query';
import { Bot, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatBotModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface ChatResponseData {
    reply: string;
}

export const ChatBotModal = ({ open, onOpenChange }: ChatBotModalProps) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi! 👋 I'm your TicketML assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const chatMutation = useMutation(handleChatMessageMutation());

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const messageText = inputMessage.trim();

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            text: messageText,
            sender: 'user',
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            // Call the API
            const response = await chatMutation.mutateAsync({
                body: {
                    message: messageText,
                },
            });

            // Add bot response
            const responseData = response.data as ChatResponseData | undefined;
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text:
                    responseData?.reply ||
                    "I'm sorry, I couldn't process your request.",
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch {
            // Add error message
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I'm having trouble connecting right now. Please try again later.",
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    if (!open) return null;

    return (
        <div
            className={cn(
                'fixed right-6 bottom-6 z-50 flex h-[600px] max-h-[calc(100vh-3rem)] w-[400px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-gray-light bg-white shadow-2xl transition-all duration-300',
                open
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none translate-y-4 opacity-0',
            )}
        >
            {/* Header */}
            <div className="border-b border-gray-light bg-gradient-to-r from-primary/10 to-secondary/10 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/20">
                            <Bot className="size-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-black">
                                TicketML Assistant
                            </h3>
                            <p className="text-xs text-gray">
                                Always here to help
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="rounded-lg p-1.5 transition-all duration-200 hover:bg-gray-light/50 active:scale-95"
                        aria-label="Close chat"
                    >
                        <X className="size-5 text-gray" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-gray-light/10 to-gray-light/30 p-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            'animate-fadeIn flex',
                            message.sender === 'user'
                                ? 'justify-end'
                                : 'justify-start',
                        )}
                    >
                        <div
                            className={cn(
                                'group max-w-[85%] rounded-2xl px-4 py-3 text-sm transition-all duration-200 hover:shadow-lg',
                                message.sender === 'user'
                                    ? 'bg-gradient-to-br from-primary to-primary/80 text-black shadow-md'
                                    : 'border-2 border-gray-light bg-white text-black shadow-md',
                            )}
                        >
                            {message.sender === 'bot' ? (
                                <div className="prose prose-sm prose-headings:font-bold prose-headings:text-black prose-p:text-black prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-black prose-code:rounded prose-code:bg-gray-light/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-black prose-pre:bg-gray-light/50 prose-ul:text-black prose-ol:text-black prose-li:text-black max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {message.text}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <p className="font-medium break-words whitespace-pre-wrap">
                                    {message.text}
                                </p>
                            )}
                            <p
                                className={cn(
                                    'mt-2 text-xs font-medium',
                                    message.sender === 'user'
                                        ? 'text-black/70'
                                        : 'text-gray/70',
                                )}
                            >
                                {message.timestamp.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="animate-fadeIn flex justify-start">
                        <div className="max-w-[85%] rounded-2xl border-2 border-gray-light bg-white px-4 py-3 shadow-md">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></span>
                                    <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></span>
                                    <span className="size-2 animate-bounce rounded-full bg-primary"></span>
                                </div>
                                <span className="text-sm text-gray">
                                    Typing...
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t-2 border-gray-light bg-white p-4">
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={
                            isLoading
                                ? 'Bot is typing...'
                                : 'Type your message...'
                        }
                        disabled={isLoading}
                        className="flex-1 rounded-xl border-2 border-gray-light bg-white px-4 py-3 text-sm font-medium text-black transition-all duration-200 placeholder:text-gray focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-black shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                        aria-label="Send message"
                    >
                        <Send className="size-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
