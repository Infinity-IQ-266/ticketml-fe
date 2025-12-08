import { Button } from '@/components/ui/button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAllEventsOptions } from '@/services/client/@tanstack/react-query.gen';
import type { Event } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import Autoplay from 'embla-carousel-autoplay';
import {
    ChevronLeft,
    ChevronRight,
    Search,
    SlidersHorizontal,
} from 'lucide-react';
import { useRef, useState } from 'react';

import { ChatBotButton, ChatBotModal, EventCard } from './-components';

export const Route = createFileRoute('/')({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0); // API uses 0-based page indexing
    const [pageSize] = useState(9);

    // Applied filters (used in API query)
    const [appliedSearchTitle, setAppliedSearchTitle] = useState('');
    const [appliedSearchLocation, setAppliedSearchLocation] = useState('');
    const [appliedSortDirection, setAppliedSortDirection] = useState<
        'ASC' | 'DESC'
    >('DESC');
    const [appliedSortAttribute, setAppliedSortAttribute] =
        useState('createdAt');

    // Temporary filter state (only for the modal)
    const [tempSearchTitle, setTempSearchTitle] = useState('');
    const [tempSearchLocation, setTempSearchLocation] = useState('');
    const [tempSortDirection, setTempSortDirection] = useState<'ASC' | 'DESC'>(
        'DESC',
    );
    const [tempSortAttribute, setTempSortAttribute] = useState('createdAt');

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

    // Build query params using APPLIED filters only
    const queryParams: Record<string, string | number> = {
        page: currentPage,
        size: pageSize,
        direction: appliedSortDirection,
        attribute: appliedSortAttribute,
    };

    if (appliedSearchTitle.trim()) {
        queryParams.title = appliedSearchTitle.trim();
    }
    if (appliedSearchLocation.trim()) {
        queryParams.location = appliedSearchLocation.trim();
    }

    const { data: response } = useQuery({
        ...getAllEventsOptions({
            query: queryParams,
        }),
        staleTime: 5 * 60 * 1000,
    });

    const events = (response?.data as Event[]) ?? [];
    const pagedResult = response?.pagedResult as
        | {
              pageNumber: number;
              pageSize: number;
              totalElements: number;
              totalPages: number;
          }
        | undefined;

    const { data: featuredResponse } = useQuery({
        ...getAllEventsOptions({
            query: {
                page: 0,
                size: 5,
                direction: 'DESC',
                attribute: 'createdAt',
            },
        }),
        staleTime: 5 * 60 * 1000,
    });

    const featuredEvents = (featuredResponse?.data as Event[]) ?? [];

    const goToPage = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 600, behavior: 'smooth' });
    };

    const handleOpenFilters = () => {
        // Sync temp values with applied values when opening modal
        setTempSearchTitle(appliedSearchTitle);
        setTempSearchLocation(appliedSearchLocation);
        setTempSortDirection(appliedSortDirection);
        setTempSortAttribute(appliedSortAttribute);
        setIsFilterOpen(true);
    };

    const handleApplyFilters = () => {
        // Apply the temp values to actual filters
        setAppliedSearchTitle(tempSearchTitle);
        setAppliedSearchLocation(tempSearchLocation);
        setAppliedSortDirection(tempSortDirection);
        setAppliedSortAttribute(tempSortAttribute);
        setCurrentPage(0); // Reset to first page on filter change
        setIsFilterOpen(false);
    };

    const handleResetFilters = () => {
        setTempSearchTitle('');
        setTempSearchLocation('');
        setTempSortDirection('DESC');
        setTempSortAttribute('createdAt');
    };

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-gray-light/20">
            {/* Hero Carousel */}
            <section className="relative mx-auto w-full max-w-7xl px-4 py-8 md:px-16">
                {featuredEvents.length > 0 ? (
                    <Carousel
                        opts={{
                            align: 'start',
                            loop: true,
                        }}
                        plugins={[plugin.current]}
                        className="w-full"
                    >
                        <CarouselContent>
                            {featuredEvents.map((event) => (
                                <CarouselItem key={event.id}>
                                    <button
                                        onClick={() =>
                                            navigate({
                                                to: '/event/$eventId',
                                                params: {
                                                    eventId:
                                                        event.id.toString(),
                                                },
                                            })
                                        }
                                        className="group hover:shadow-3xl relative w-full overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 hover:scale-[1.02] focus:ring-4 focus:ring-primary/50 focus:outline-none"
                                    >
                                        <div className="relative h-[400px] w-full md:h-[500px]">
                                            <img
                                                src={
                                                    event.imageUrl ??
                                                    '/images/emxinhsayhi.png'
                                                }
                                                alt={event.title}
                                                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            {/* Subtle hover overlay */}
                                            <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/10" />
                                        </div>
                                    </button>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-4 size-12 border-2 border-white/20 bg-white/90 text-black shadow-xl transition-all hover:scale-110 hover:bg-white md:left-6" />
                        <CarouselNext className="right-4 size-12 border-2 border-white/20 bg-white/90 text-black shadow-xl transition-all hover:scale-110 hover:bg-white md:right-6" />
                    </Carousel>
                ) : (
                    <div className="flex h-[400px] items-center justify-center rounded-2xl bg-gray-light/20">
                        <p className="text-xl text-gray">No events available</p>
                    </div>
                )}
            </section>

            {/* All Events Section */}
            <section className="mx-auto w-full max-w-7xl px-4 py-12">
                {/* Header with Search and Filters */}
                <div className="mb-8 space-y-4">
                    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-black">
                                All Events
                            </h2>
                            {pagedResult && (
                                <div className="mt-1 text-sm text-gray">
                                    Showing{' '}
                                    {currentPage * pagedResult.pageSize + 1}-
                                    {Math.min(
                                        (currentPage + 1) *
                                            pagedResult.pageSize,
                                        pagedResult.totalElements,
                                    )}{' '}
                                    of {pagedResult.totalElements} events
                                </div>
                            )}
                        </div>

                        <Dialog
                            open={isFilterOpen}
                            onOpenChange={setIsFilterOpen}
                        >
                            <DialogTrigger asChild>
                                <button
                                    onClick={handleOpenFilters}
                                    className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-light bg-white px-4 py-2 font-semibold text-black transition-all hover:border-primary hover:bg-primary/10 active:scale-95"
                                >
                                    <SlidersHorizontal className="size-5" />
                                    Filters & Sort
                                </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>
                                        Search & Filter Events
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    {/* Search */}
                                    <div className="space-y-2">
                                        <Label htmlFor="search-title">
                                            Search by Title
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="search-title"
                                                placeholder="Event name..."
                                                value={tempSearchTitle}
                                                onChange={(e) =>
                                                    setTempSearchTitle(
                                                        e.target.value,
                                                    )
                                                }
                                                className="pr-10"
                                            />
                                            <Search className="absolute top-1/2 right-3 size-5 -translate-y-1/2 text-gray" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="search-location">
                                            Search by Location
                                        </Label>
                                        <Input
                                            id="search-location"
                                            placeholder="City or venue..."
                                            value={tempSearchLocation}
                                            onChange={(e) =>
                                                setTempSearchLocation(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    {/* Sort */}
                                    <div className="space-y-2">
                                        <Label htmlFor="sort-by">Sort By</Label>
                                        <select
                                            id="sort-by"
                                            value={tempSortAttribute}
                                            onChange={(e) =>
                                                setTempSortAttribute(
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border-2 border-gray-light px-3 py-2 text-black focus:border-primary focus:outline-none"
                                        >
                                            <option value="createdAt">
                                                Created Date
                                            </option>
                                            <option value="startDate">
                                                Event Date
                                            </option>
                                            <option value="title">Title</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="sort-direction">
                                            Order
                                        </Label>
                                        <select
                                            id="sort-direction"
                                            value={tempSortDirection}
                                            onChange={(e) =>
                                                setTempSortDirection(
                                                    e.target.value as
                                                        | 'ASC'
                                                        | 'DESC',
                                                )
                                            }
                                            className="w-full rounded-lg border-2 border-gray-light px-3 py-2 text-black focus:border-primary focus:outline-none"
                                        >
                                            <option value="DESC">
                                                Newest First
                                            </option>
                                            <option value="ASC">
                                                Oldest First
                                            </option>
                                        </select>
                                    </div>

                                    <div className="flex gap-2 pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={handleResetFilters}
                                            className="flex-1"
                                        >
                                            Reset
                                        </Button>
                                        <Button
                                            onClick={handleApplyFilters}
                                            className="flex-1 bg-primary text-black hover:bg-primary-darken"
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {events.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {events.map((event) => (
                                <EventCard
                                    key={event.id}
                                    id={event.id}
                                    image={
                                        event.imageUrl ??
                                        '/images/emxinhsayhi.png'
                                    }
                                    title={event.title}
                                    date={
                                        event.startDate
                                            ? new Date(
                                                  event.startDate,
                                              ).toLocaleDateString()
                                            : 'TBA'
                                    }
                                    location={event.location}
                                    price={`From: ${event.ticketTypes[0]?.price.toLocaleString()} đ`}
                                    tags={['Event']}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagedResult && pagedResult.totalPages > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    className="flex size-10 items-center justify-center rounded-lg border-2 border-gray-light bg-white text-black transition-all hover:bg-gray-light disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronLeft className="size-5" />
                                </button>

                                {Array.from(
                                    { length: pagedResult.totalPages },
                                    (_, i) => i,
                                ).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        className={`flex size-10 items-center justify-center rounded-lg border-2 font-semibold transition-all ${
                                            currentPage === page
                                                ? 'border-primary bg-primary text-black'
                                                : 'border-gray-light bg-white text-black hover:bg-gray-light'
                                        }`}
                                    >
                                        {page + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={
                                        currentPage ===
                                        pagedResult.totalPages - 1
                                    }
                                    className="flex size-10 items-center justify-center rounded-lg border-2 border-gray-light bg-white text-black transition-all hover:bg-gray-light disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronRight className="size-5" />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-light bg-gray-light/10">
                        <p className="text-xl text-gray">No events available</p>
                    </div>
                )}
            </section>

            {/* Chatbot Components */}
            {!isChatOpen && (
                <ChatBotButton onClick={() => setIsChatOpen(true)} />
            )}
            <ChatBotModal open={isChatOpen} onOpenChange={setIsChatOpen} />
        </div>
    );
}
