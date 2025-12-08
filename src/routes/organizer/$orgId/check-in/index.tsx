import { cn } from '@/lib/utils';
import { Link, createFileRoute } from '@tanstack/react-router';
import {
    AlertCircle,
    ArrowLeft,
    Camera,
    CheckCircle2,
    RefreshCw,
    SwitchCamera,
    XCircle,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const Route = createFileRoute('/organizer/$orgId/check-in/')({
    component: RouteComponent,
});

type ScanStatus = 'idle' | 'scanning' | 'success' | 'error' | 'already-used';

interface ScanResult {
    status: ScanStatus;
    message: string;
    ticketInfo?: {
        eventName: string;
        ticketType: string;
        holderName: string;
    };
}

function RouteComponent() {
    const { orgId } = Route.useParams();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>(
        'environment',
    );
    const [scanResult, setScanResult] = useState<ScanResult>({
        status: 'idle',
        message: 'Point camera at QR code to check in',
    });
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, [facingMode]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facingMode },
                audio: false,
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setHasPermission(true);
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            setHasPermission(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
        }
    };

    const switchCamera = () => {
        stopCamera();
        setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
    };

    const simulateScan = (type: ScanStatus) => {
        setIsScanning(true);
        setScanResult({ status: 'scanning', message: 'Processing...' });

        setTimeout(() => {
            setIsScanning(false);
            switch (type) {
                case 'success':
                    setScanResult({
                        status: 'success',
                        message: 'Check-in successful!',
                        ticketInfo: {
                            eventName: 'Tech Summit 2025',
                            ticketType: 'VIP',
                            holderName: 'John Doe',
                        },
                    });
                    break;
                case 'already-used':
                    setScanResult({
                        status: 'already-used',
                        message: 'This ticket has already been used',
                        ticketInfo: {
                            eventName: 'Tech Summit 2025',
                            ticketType: 'Regular',
                            holderName: 'Jane Smith',
                        },
                    });
                    break;
                case 'error':
                    setScanResult({
                        status: 'error',
                        message: 'Invalid QR code or wrong event',
                    });
                    break;
            }

            // Reset after 3 seconds
            setTimeout(() => {
                setScanResult({
                    status: 'idle',
                    message: 'Point camera at QR code to check in',
                });
            }, 3000);
        }, 1000);
    };

    const getStatusIcon = () => {
        switch (scanResult.status) {
            case 'scanning':
                return (
                    <RefreshCw className="size-16 animate-spin text-blue md:size-20" />
                );
            case 'success':
                return (
                    <CheckCircle2 className="size-16 text-green md:size-20" />
                );
            case 'already-used':
                return <AlertCircle className="size-16 text-red md:size-20" />;
            case 'error':
                return <XCircle className="size-16 text-red md:size-20" />;
            default:
                return <Camera className="size-16 text-gray md:size-20" />;
        }
    };

    const getStatusColor = () => {
        switch (scanResult.status) {
            case 'scanning':
                return 'bg-blue/10 border-blue';
            case 'success':
                return 'bg-green/10 border-green';
            case 'already-used':
            case 'error':
                return 'bg-red/10 border-red';
            default:
                return 'bg-gray-light/10 border-gray-light';
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-gray-light/20 px-5 py-5 md:px-10 md:py-10">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <Link
                    to="/organizer/$orgId"
                    params={{ orgId }}
                    className="flex items-center gap-2 text-black transition-colors hover:text-primary-darken"
                >
                    <ArrowLeft className="size-6" />
                    <span className="text-lg font-semibold">Back</span>
                </Link>
                <h1 className="text-2xl font-bold text-black md:text-3xl">
                    Ticket Check-In
                </h1>
                <div className="w-20" /> {/* Spacer for centering */}
            </div>

            <div className="mx-auto w-full max-w-4xl space-y-6">
                {/* Camera Section */}
                <div className="overflow-hidden rounded-2xl border-2 border-black bg-white shadow-lg">
                    <div className="relative aspect-square w-full bg-black md:aspect-video">
                        {hasPermission === false ? (
                            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                                <Camera className="mb-4 size-16 text-gray-light" />
                                <p className="text-lg font-semibold text-white">
                                    Camera permission denied
                                </p>
                                <p className="mt-2 text-sm text-gray-light">
                                    Please allow camera access to scan QR codes
                                </p>
                                <button
                                    onClick={startCamera}
                                    className="mt-4 rounded-lg bg-primary px-6 py-3 font-semibold text-black transition-all hover:bg-primary-darken"
                                >
                                    Request Permission
                                </button>
                            </div>
                        ) : (
                            <>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="h-full w-full object-cover"
                                />
                                {/* QR Scanner Overlay */}
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                    <div className="relative size-48 md:size-64 lg:size-80">
                                        {/* Corner borders */}
                                        <div className="absolute top-0 left-0 h-12 w-12 border-t-4 border-l-4 border-primary md:h-16 md:w-16" />
                                        <div className="absolute top-0 right-0 h-12 w-12 border-t-4 border-r-4 border-primary md:h-16 md:w-16" />
                                        <div className="absolute bottom-0 left-0 h-12 w-12 border-b-4 border-l-4 border-primary md:h-16 md:w-16" />
                                        <div className="absolute right-0 bottom-0 h-12 w-12 border-r-4 border-b-4 border-primary md:h-16 md:w-16" />

                                        {/* Scanning line animation */}
                                        {isScanning && (
                                            <div className="absolute inset-x-0 top-0 h-1 animate-pulse bg-primary" />
                                        )}
                                    </div>
                                </div>

                                {/* Camera Controls */}
                                <button
                                    onClick={switchCamera}
                                    className="absolute top-4 right-4 rounded-full bg-black/50 p-3 backdrop-blur-sm transition-all hover:bg-black/70"
                                    aria-label="Switch Camera"
                                >
                                    <SwitchCamera className="size-6 text-white" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Status Display */}
                <div
                    className={cn(
                        'rounded-2xl border-2 p-6 transition-all duration-300 md:p-8',
                        getStatusColor(),
                    )}
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4">{getStatusIcon()}</div>
                        <p
                            className={cn(
                                'text-xl font-bold md:text-2xl',
                                scanResult.status === 'success'
                                    ? 'text-green'
                                    : scanResult.status === 'error' ||
                                        scanResult.status === 'already-used'
                                      ? 'text-red'
                                      : 'text-black',
                            )}
                        >
                            {scanResult.message}
                        </p>

                        {/* Ticket Information */}
                        {scanResult.ticketInfo && (
                            <div className="mt-4 w-full space-y-2 rounded-xl bg-white/50 p-4 text-left">
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray">
                                        Event:
                                    </span>
                                    <span className="font-bold text-black">
                                        {scanResult.ticketInfo.eventName}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray">
                                        Type:
                                    </span>
                                    <span className="font-bold text-black">
                                        {scanResult.ticketInfo.ticketType}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray">
                                        Holder:
                                    </span>
                                    <span className="font-bold text-black">
                                        {scanResult.ticketInfo.holderName}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Demo Buttons - Remove these when integrating real scanning */}
                <div className="rounded-2xl border-2 border-dashed border-gray-light bg-white p-6">
                    <p className="mb-4 text-center text-sm font-semibold text-gray">
                        Demo Controls (Remove when API is integrated)
                    </p>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <button
                            onClick={() => simulateScan('success')}
                            className="rounded-lg bg-green px-4 py-3 font-semibold text-white transition-all hover:bg-green-darken"
                        >
                            Simulate Success
                        </button>
                        <button
                            onClick={() => simulateScan('already-used')}
                            className="rounded-lg bg-red px-4 py-3 font-semibold text-white transition-all hover:bg-red/80"
                        >
                            Simulate Used
                        </button>
                        <button
                            onClick={() => simulateScan('error')}
                            className="rounded-lg bg-gray px-4 py-3 font-semibold text-white transition-all hover:bg-gray/80"
                        >
                            Simulate Error
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
