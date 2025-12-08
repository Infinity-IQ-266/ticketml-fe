import { cn } from '@/lib/utils';
import { checkInTicketMutation } from '@/services/client/@tanstack/react-query.gen';
import { useMutation } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import { BrowserQRCodeReader } from '@zxing/browser';
import {
    AlertCircle,
    ArrowLeft,
    Camera,
    CheckCircle2,
    RefreshCw,
    RotateCw,
    SwitchCamera,
    XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute(
    '/organizer/$orgId/event/$eventId/check-in/',
)({
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
    const { orgId, eventId } = Route.useParams();
    const videoRef = useRef<HTMLVideoElement>(null);
    const codeReaderRef = useRef<BrowserQRCodeReader | null>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>(
        'environment',
    );
    const [scanResult, setScanResult] = useState<ScanResult>({
        status: 'idle',
        message: 'Point camera at QR code to check in',
    });
    const [isScanning, setIsScanning] = useState(false);
    const [lastScannedCode, setLastScannedCode] = useState<string>('');
    const scanCooldownRef = useRef<boolean>(false);

    // Check-in mutation
    const checkInMutation = useMutation(checkInTicketMutation());

    // Handle check-in API call
    const handleCheckIn = useCallback(
        async (qrCode: string) => {
            // Prevent duplicate scans
            if (scanCooldownRef.current || qrCode === lastScannedCode) {
                return;
            }

            scanCooldownRef.current = true;
            setLastScannedCode(qrCode);
            setIsScanning(true);
            setScanResult({ status: 'scanning', message: 'Processing...' });

            try {
                const response = await checkInMutation.mutateAsync({
                    path: { eventId: Number(eventId) },
                    body: { qrCode },
                });

                const data = response.data as
                    | {
                          status?: string;
                          message?: string;
                          ticketDetails?: {
                              userName?: string;
                              ticketType?: string;
                              checkInTime?: string;
                          } | null;
                      }
                    | undefined;

                // Check the status from the response
                const backendStatus = data?.status;
                const backendMessage = data?.message || 'Unknown response';

                if (backendStatus === 'SUCCESS') {
                    setScanResult({
                        status: 'success',
                        message: backendMessage,
                        ticketInfo: data?.ticketDetails
                            ? {
                                  eventName:
                                      data.ticketDetails.userName || 'N/A',
                                  ticketType:
                                      data.ticketDetails.ticketType || 'N/A',
                                  holderName:
                                      data.ticketDetails.checkInTime || 'N/A',
                              }
                            : undefined,
                    });
                    toast.success(backendMessage);
                } else if (backendStatus === 'ALREADY_CHECKED_IN') {
                    setScanResult({
                        status: 'already-used',
                        message: backendMessage,
                    });
                    toast.error(backendMessage);
                } else if (backendStatus === 'WRONG_EVENT') {
                    setScanResult({
                        status: 'error',
                        message: backendMessage,
                    });
                    toast.error(backendMessage);
                } else {
                    setScanResult({
                        status: 'error',
                        message: backendMessage,
                    });
                    toast.error(backendMessage);
                }
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : 'Check-in failed';

                setScanResult({
                    status: 'error',
                    message: errorMessage,
                });
                toast.error(errorMessage);
            } finally {
                setIsScanning(false);

                // Reset after 3 seconds
                setTimeout(() => {
                    setScanResult({
                        status: 'idle',
                        message: 'Point camera at QR code to check in',
                    });
                    scanCooldownRef.current = false;
                }, 3000);
            }
        },
        [checkInMutation, eventId, lastScannedCode],
    );

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facingMode },
                audio: false,
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setHasPermission(true);

                // Initialize QR code reader
                if (!codeReaderRef.current) {
                    codeReaderRef.current = new BrowserQRCodeReader();
                }

                // Start continuous QR code scanning with callback
                codeReaderRef.current.decodeFromVideoElement(
                    videoRef.current,
                    (result, error) => {
                        if (result) {
                            handleCheckIn(result.getText());
                        }
                        if (error && !(error.name === 'NotFoundException')) {
                            console.error('QR scanning error:', error);
                        }
                    },
                );
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            setHasPermission(false);
        }
    }, [facingMode, handleCheckIn]);

    const stopCamera = useCallback(() => {
        // Stop video stream
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }

        // Reset QR code reader
        codeReaderRef.current = null;
    }, []);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, [startCamera, stopCamera]);

    const switchCamera = () => {
        stopCamera();
        setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
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
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button
                                        onClick={() => {
                                            stopCamera();
                                            setTimeout(
                                                () => startCamera(),
                                                100,
                                            );
                                        }}
                                        className="rounded-full bg-black/50 p-3 backdrop-blur-sm transition-all hover:bg-black/70 active:scale-95"
                                        aria-label="Reload Camera"
                                        title="Reload Camera"
                                    >
                                        <RotateCw className="size-6 text-white" />
                                    </button>
                                    <button
                                        onClick={switchCamera}
                                        className="rounded-full bg-black/50 p-3 backdrop-blur-sm transition-all hover:bg-black/70 active:scale-95"
                                        aria-label="Switch Camera"
                                        title="Switch Camera"
                                    >
                                        <SwitchCamera className="size-6 text-white" />
                                    </button>
                                </div>
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

                        {/* Ticket Information - Only show for SUCCESS */}
                        {scanResult.status === 'success' &&
                            scanResult.ticketInfo && (
                                <div className="mt-4 w-full space-y-2 rounded-xl bg-white/50 p-4 text-left">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray">
                                            User Name:
                                        </span>
                                        <span className="font-bold text-black">
                                            {scanResult.ticketInfo.eventName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray">
                                            Ticket Type:
                                        </span>
                                        <span className="font-bold text-black">
                                            {scanResult.ticketInfo.ticketType}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray">
                                            Check-in Time:
                                        </span>
                                        <span className="font-bold text-black">
                                            {scanResult.ticketInfo.holderName}
                                        </span>
                                    </div>
                                </div>
                            )}

                        {/* Reset Button - Show when not idle or scanning */}
                        {(scanResult.status === 'success' ||
                            scanResult.status === 'error' ||
                            scanResult.status === 'already-used') && (
                            <button
                                onClick={() => {
                                    setScanResult({
                                        status: 'idle',
                                        message:
                                            'Point camera at QR code to check in',
                                    });
                                    scanCooldownRef.current = false;
                                    setLastScannedCode('');
                                }}
                                className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-black transition-all hover:scale-105 hover:bg-primary-darken active:scale-95"
                            >
                                <RefreshCw className="size-5" />
                                Scan Another Ticket
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
