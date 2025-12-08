import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import { Calendar, MapPin } from 'lucide-react';

interface EventCardProps {
    id: number;
    image?: string;
    title: string;
    date: string;
    location: string;
    price: string;
    tags: string[];
}

export function EventCard({
    id,
    image,
    title,
    date,
    location,
    price,
    tags,
}: EventCardProps) {
    const navigate = useNavigate();
    return (
        <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="relative h-48 flex-shrink-0 overflow-hidden">
                <img
                    src={image || '/placeholder.svg'}
                    alt={title}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <CardContent className="flex flex-1 flex-col p-5">
                {/* Tags - Fixed height */}
                <div className="mb-3 flex min-h-[28px] flex-wrap gap-2">
                    {tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-darken"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Title - Fixed height with 2 lines */}
                <h3 className="mb-3 line-clamp-2 h-12 text-lg leading-6 font-bold text-black">
                    {title}
                </h3>

                {/* Details - Fixed spacing */}
                <div className="mb-4 flex-1 space-y-2 text-sm text-gray">
                    <div className="flex items-start gap-2">
                        <Calendar className="mt-0.5 size-4 flex-shrink-0 text-primary" />
                        <span className="line-clamp-1">{date}</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 size-4 flex-shrink-0 text-green" />
                        <span className="line-clamp-1">{location}</span>
                    </div>
                </div>

                {/* Footer - Always at bottom */}
                <div className="mt-auto border-t border-gray-light pt-4">
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-lg font-bold text-primary-darken">
                            {price}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-primary font-semibold text-black transition-all hover:scale-105 hover:bg-primary-darken"
                            onClick={() =>
                                navigate({
                                    to: '/event/$eventId',
                                    params: { eventId: id.toString() },
                                })
                            }
                        >
                            View Details
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
