import { createFileRoute } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { EventCard } from './-components';

export const Route = createFileRoute('/')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="flex flex-col items-center px-10">
            <div className="relative flex w-5/6 flex-row items-center justify-center gap-18 py-5">
                <div className="justify-center">
                    <ArrowLeft className="relative inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-black p-3 transition duration-200 hover:cursor-pointer hover:bg-black/10" />
                </div>

                <div className="relative w-full">
                    <img
                        src="../../public/images/emxinhsayhi.png"
                        alt="emxinhsaybye"
                        className="h-auto w-full rounded-lg object-cover"
                    />
                    <button className="text-purple-800 hover:bg-purple-300 absolute right-4 bottom-4 rounded-full border-0 bg-white px-6 py-2.5 font-semibold transition-all duration-200 hover:scale-105 active:scale-95">
                        View Event
                    </button>
                </div>

                <div className="justify-center">
                    <ArrowRight className="relative inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-black p-3 transition duration-200 hover:cursor-pointer hover:bg-black/10" />
                </div>
            </div>

            <div className="mx-auto w-full max-w-7xl px-4 py-8">
                {/* Special Events Section */}
                <section className="mb-12">
                    <h2 className="mb-6 text-2xl font-bold">Special events</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <EventCard
                            image="/vietnamese-traditional-music-festival-with-lantern.jpg"
                            title="Hà Nội Những Tháng Năm Mùa Hạ Của Tôi 2025"
                            date="25 tháng 5 2025"
                            time="19:00 - 23:00"
                            location="Sân khấu Hòa Bình"
                            price="From 200.000 đ"
                            tags={['Concert', 'Theater']}
                        />
                        <EventCard
                            image="/pink-neon-concert-stage-with-performers.jpg"
                            title="Hà Nội 'SLAY IT' CONCERT - EP.2"
                            date="28 tháng 5 2025"
                            time="19:00 - 23:00"
                            location="Sân khấu Hòa Bình"
                            price="From 1.900.000 đ"
                            tags={['Music', 'Theater', 'Concert']}
                        />
                        <EventCard
                            image="/colorful-psychedelic-concert-poster-2025.jpg"
                            title="Hà Nội SOUNDSCAPE 2025"
                            date="20 tháng 5 2025"
                            time="19:00 - 23:00"
                            location="Vạn Phúc City"
                            price="From 699.000 đ"
                            tags={['Party', 'Concert']}
                        />
                    </div>
                </section>

                {/* Theaters & Arts Section */}
                <section>
                    <h2 className="mb-6 text-2xl font-bold">Theaters & arts</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <EventCard
                            image="/vietnamese-romantic-comedy-movie-poster.jpg"
                            title="Hà Nội Có Một Người Yêu Là Như Thế"
                            date="25 tháng 5 2025"
                            time="19:00 - 21:00"
                            location="Nhà hát Hòa Bình"
                            price="From 200.000 đ"
                            tags={['Concert', 'Theater']}
                        />
                        <EventCard
                            image="/pink-neon-concert-stage-with-performers.jpg"
                            title="Hà Nội 'SLAY IT' CONCERT - EP.2"
                            date="28 tháng 5 2025"
                            time="19:00 - 23:00"
                            location="Sân khấu Hòa Bình"
                            price="From 1.900.000 đ"
                            tags={['Music', 'Theater', 'Concert']}
                        />
                        <EventCard
                            image="/colorful-psychedelic-concert-poster-2025.jpg"
                            title="Hà Nội SOUNDSCAPE 2025"
                            date="20 tháng 5 2025"
                            time="19:00 - 23:00"
                            location="Vạn Phúc City"
                            price="From 699.000 đ"
                            tags={['Party', 'Concert']}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}
