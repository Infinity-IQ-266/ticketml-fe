import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface EventCardProps {
    id: number;
    image?: string;
    title: string;
    date: string;
    time: string;
    location: string;
    price: string;
    tags: string[];
}

export function EventCard({
    id,
    image,
    title,
    date,
    time,
    location,
    price,
    tags,
}: EventCardProps) {
    const navigate = useNavigate();
    return (
        <Card className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative">
                <img
                    src={image || '/placeholder.svg'}
                    alt={title}
                    className="h-48 w-full object-cover"
                />
            </div>
            <CardContent className="p-4">
                <div className="mb-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full !bg-secondary px-3 py-1 text-xs font-medium"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <h3 className="mb-3 line-clamp-2 text-base font-semibold">
                    {title}
                </h3>
                <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{location}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-base font-semibold">{price}</span>
                    <Button
                        variant="outline"
                        className="!bg-primary hover:bg-primary-darken!"
                        onClick={() =>
                            navigate({
                                to: '/event/$eventId',
                                params: { eventId: id.toString() },
                            })
                        }
                    >
                        View Events
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
