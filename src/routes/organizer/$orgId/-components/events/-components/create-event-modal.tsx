import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    createEventMutation,
    updateEventMutation,
} from '@/services/client/@tanstack/react-query.gen';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Image, MapPin, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface TicketTypeForm {
    id?: string;
    type: string;
    price: number;
    totalQuantity: number;
    ticketTypeStatus: 'ACTIVE' | 'SOLD_OUT' | 'CANCELED';
}

interface EventFormData {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    bannerImage: File | null;
    ticketTypes: TicketTypeForm[];
}

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    orgId: string;
    eventToEdit?: {
        id: string;
        title: string;
        description: string;
        startDate: string;
        endDate: string;
        location: string;
    } | null;
}

const initialTicketType: TicketTypeForm = {
    type: '',
    price: 0,
    totalQuantity: 0,
    ticketTypeStatus: 'ACTIVE',
};

export const CreateEventModal = ({
    isOpen,
    onClose,
    orgId,
    eventToEdit,
}: CreateEventModalProps) => {
    const queryClient = useQueryClient();
    const isEditMode = !!eventToEdit;

    const [formData, setFormData] = useState<EventFormData>({
        title: eventToEdit?.title ?? '',
        description: eventToEdit?.description ?? '',
        startDate: eventToEdit?.startDate ?? '',
        endDate: eventToEdit?.endDate ?? '',
        location: eventToEdit?.location ?? '',
        bannerImage: null,
        ticketTypes: isEditMode
            ? []
            : [{ ...initialTicketType, id: crypto.randomUUID() }],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Create event mutation
    const createEvent = useMutation(createEventMutation());

    // Update event mutation
    const updateEvent = useMutation(updateEventMutation());

    // Handle successful event creation
    const handleCreateSuccess = async () => {
        toast.success('Event created successfully!');

        // Invalidate and refetch all related queries
        await Promise.all([
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const key = query.queryKey[0] as {
                        _id?: string;
                        path?: { orgId?: number };
                    };
                    return (
                        key?._id === 'getEventsByOrganization' ||
                        key?._id === 'getDashboard' ||
                        key?._id === 'getAllEvents'
                    );
                },
            }),
            queryClient.refetchQueries({
                predicate: (query) => {
                    const key = query.queryKey[0] as {
                        _id?: string;
                        path?: { orgId?: number };
                    };
                    return (
                        key?._id === 'getEventsByOrganization' &&
                        key?.path?.orgId === Number(orgId)
                    );
                },
            }),
        ]);

        handleClose();
    };

    // Handle successful event update
    const handleUpdateSuccess = async () => {
        toast.success('Event updated successfully!');

        // Invalidate and refetch all related queries
        await Promise.all([
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const key = query.queryKey[0] as {
                        _id?: string;
                        path?: { orgId?: number; eventId?: number };
                    };
                    return (
                        key?._id === 'getEventsByOrganization' ||
                        key?._id === 'getEventById' ||
                        key?._id === 'getDashboard'
                    );
                },
            }),
            queryClient.refetchQueries({
                predicate: (query) => {
                    const key = query.queryKey[0] as {
                        _id?: string;
                        path?: { orgId?: number; eventId?: number };
                    };
                    const isEventsByOrg =
                        key?._id === 'getEventsByOrganization' &&
                        key?.path?.orgId === Number(orgId);
                    const isEventById =
                        key?._id === 'getEventById' &&
                        eventToEdit !== null &&
                        eventToEdit !== undefined &&
                        key?.path?.eventId === Number(eventToEdit.id);
                    return isEventsByOrg || isEventById;
                },
            }),
        ]);

        handleClose();
    };

    const handleClose = () => {
        setFormData({
            title: '',
            description: '',
            startDate: '',
            endDate: '',
            location: '',
            bannerImage: null,
            ticketTypes: [{ ...initialTicketType, id: crypto.randomUUID() }],
        });
        setErrors({});
        onClose();
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Event title is required';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required';
        }

        if (!formData.endDate) {
            newErrors.endDate = 'End date is required';
        }

        if (formData.startDate && formData.endDate) {
            if (new Date(formData.startDate) > new Date(formData.endDate)) {
                newErrors.endDate = 'End date must be after start date';
            }
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }

        if (!isEditMode) {
            if (formData.ticketTypes.length === 0) {
                newErrors.ticketTypes = 'At least one ticket type is required';
            }

            formData.ticketTypes.forEach((ticket, index) => {
                if (!ticket.type.trim()) {
                    newErrors[`ticketType_${index}_type`] =
                        'Ticket type name is required';
                }
                if (ticket.price <= 0) {
                    newErrors[`ticketType_${index}_price`] =
                        'Price must be greater than 0';
                }
                if (ticket.totalQuantity <= 0) {
                    newErrors[`ticketType_${index}_quantity`] =
                        'Quantity must be greater than 0';
                }
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        try {
            if (isEditMode) {
                // Update event (only basic fields, no ticket types)
                await updateEvent.mutateAsync({
                    path: { eventId: Number(eventToEdit.id) },
                    body: {
                        title: formData.title,
                        description: formData.description,
                        startDate: formData.startDate,
                        endDate: formData.endDate,
                        location: formData.location,
                        ...(formData.bannerImage && {
                            bannerImage: formData.bannerImage,
                        }),
                    },
                });
                await handleUpdateSuccess();
            } else {
                // Create event with ticket types
                // Build the body with flattened ticketTypes for multipart/form-data
                type FlattenedEventRequest = Record<
                    string,
                    string | number | File
                > & {
                    title: string;
                    description: string;
                    startDate: string;
                    endDate: string;
                    location: string;
                    bannerImage?: File;
                };

                const requestBody: FlattenedEventRequest = {
                    title: formData.title,
                    description: formData.description,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    location: formData.location,
                };

                // Add banner image if provided
                if (formData.bannerImage) {
                    requestBody.bannerImage = formData.bannerImage;
                }

                // Flatten ticketTypes array into individual fields
                formData.ticketTypes.forEach((tt, index) => {
                    requestBody[`ticketTypes[${index}].type`] = tt.type;
                    requestBody[`ticketTypes[${index}].price`] = tt.price;
                    requestBody[`ticketTypes[${index}].totalQuantity`] =
                        tt.totalQuantity;
                    requestBody[`ticketTypes[${index}].ticketTypeStatus`] =
                        tt.ticketTypeStatus;
                });

                await createEvent.mutateAsync({
                    path: { orgId: Number(orgId) },
                    body: requestBody as unknown as Parameters<
                        typeof createEvent.mutateAsync
                    >[0]['body'],
                });
                await handleCreateSuccess();
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : isEditMode
                      ? 'Failed to update event'
                      : 'Failed to create event';
            toast.error(errorMessage);
        }
    };

    const addTicketType = () => {
        setFormData({
            ...formData,
            ticketTypes: [
                ...formData.ticketTypes,
                { ...initialTicketType, id: crypto.randomUUID() },
            ],
        });
    };

    const removeTicketType = (index: number) => {
        if (formData.ticketTypes.length === 1) {
            toast.error('At least one ticket type is required');
            return;
        }
        setFormData({
            ...formData,
            ticketTypes: formData.ticketTypes.filter((_, i) => i !== index),
        });
    };

    const updateTicketType = (
        index: number,
        field: keyof TicketTypeForm,
        value: string | number,
    ) => {
        const updatedTicketTypes = [...formData.ticketTypes];
        updatedTicketTypes[index] = {
            ...updatedTicketTypes[index],
            [field]: value,
        };
        setFormData({ ...formData, ticketTypes: updatedTicketTypes });
    };

    const isLoading = createEvent.isPending || updateEvent.isPending;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {isEditMode ? 'Edit Event' : 'Create New Event'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? 'Update your event details below'
                            : 'Fill in the details to create your event. You can add multiple ticket types.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Event Title */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="title"
                            className="text-base font-semibold"
                        >
                            Event Title *
                        </Label>
                        <Input
                            id="title"
                            placeholder="e.g., Tech Conference 2025"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                            className={errors.title ? 'border-red' : ''}
                        />
                        {errors.title && (
                            <p className="text-sm text-red">{errors.title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="description"
                            className="text-base font-semibold"
                        >
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Describe your event..."
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            rows={4}
                        />
                    </div>

                    {/* Banner Image */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="bannerImage"
                            className="flex items-center gap-2 text-base font-semibold"
                        >
                            <Image className="size-5" />
                            Event Banner Image
                        </Label>
                        <div className="space-y-2">
                            <Input
                                id="bannerImage"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setFormData({
                                            ...formData,
                                            bannerImage: file,
                                        });
                                    }
                                }}
                                className={
                                    errors.bannerImage ? 'border-red' : ''
                                }
                            />
                            {formData.bannerImage && (
                                <div className="flex items-center gap-2 rounded-lg border border-gray-light bg-gray-light/20 p-2">
                                    <Image className="size-4 text-gray" />
                                    <span className="flex-1 truncate text-sm text-gray">
                                        {formData.bannerImage.name}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                bannerImage: null,
                                            })
                                        }
                                        className="size-6 p-0"
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>
                            )}
                            {errors.bannerImage && (
                                <p className="text-sm text-red">
                                    {errors.bannerImage}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label
                                htmlFor="startDate"
                                className="text-base font-semibold"
                            >
                                Start Date *
                            </Label>
                            <div className="relative">
                                <Calendar className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray" />
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            startDate: e.target.value,
                                        })
                                    }
                                    className={`pl-10 ${errors.startDate ? 'border-red' : ''}`}
                                />
                            </div>
                            {errors.startDate && (
                                <p className="text-sm text-red">
                                    {errors.startDate}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="endDate"
                                className="text-base font-semibold"
                            >
                                End Date *
                            </Label>
                            <div className="relative">
                                <Calendar className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray" />
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            endDate: e.target.value,
                                        })
                                    }
                                    className={`pl-10 ${errors.endDate ? 'border-red' : ''}`}
                                />
                            </div>
                            {errors.endDate && (
                                <p className="text-sm text-red">
                                    {errors.endDate}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="location"
                            className="text-base font-semibold"
                        >
                            Location *
                        </Label>
                        <div className="relative">
                            <MapPin className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray" />
                            <Input
                                id="location"
                                placeholder="e.g., Convention Center, District 1, HCMC"
                                value={formData.location}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        location: e.target.value,
                                    })
                                }
                                className={`pl-10 ${errors.location ? 'border-red' : ''}`}
                            />
                        </div>
                        {errors.location && (
                            <p className="text-sm text-red">
                                {errors.location}
                            </p>
                        )}
                    </div>

                    {/* Ticket Types Section - Only for Create Mode */}
                    {!isEditMode && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-base font-semibold">
                                    Ticket Types *
                                </Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addTicketType}
                                    className="gap-2"
                                >
                                    <Plus className="size-4" />
                                    Add Ticket Type
                                </Button>
                            </div>

                            {errors.ticketTypes && (
                                <p className="text-sm text-red">
                                    {errors.ticketTypes}
                                </p>
                            )}

                            <div className="space-y-4">
                                {formData.ticketTypes.map((ticket, index) => (
                                    <div
                                        key={ticket.id ?? index}
                                        className="rounded-lg border-2 border-gray-light bg-gray-light/5 p-4"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <h4 className="font-semibold text-black">
                                                Ticket Type {index + 1}
                                            </h4>
                                            {formData.ticketTypes.length >
                                                1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        removeTicketType(index)
                                                    }
                                                    className="text-red hover:bg-red/10 hover:text-red"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2 md:col-span-2">
                                                <Label className="text-sm font-medium">
                                                    Type Name *
                                                </Label>
                                                <Input
                                                    placeholder="e.g., VIP, Standard, Early Bird"
                                                    value={ticket.type}
                                                    onChange={(e) =>
                                                        updateTicketType(
                                                            index,
                                                            'type',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={
                                                        errors[
                                                            `ticketType_${index}_type`
                                                        ]
                                                            ? 'border-red'
                                                            : ''
                                                    }
                                                />
                                                {errors[
                                                    `ticketType_${index}_type`
                                                ] && (
                                                    <p className="text-sm text-red">
                                                        {
                                                            errors[
                                                                `ticketType_${index}_type`
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">
                                                    Price (VND) *
                                                </Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    value={
                                                        ticket.price === 0
                                                            ? ''
                                                            : ticket.price
                                                    }
                                                    onChange={(e) =>
                                                        updateTicketType(
                                                            index,
                                                            'price',
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    className={
                                                        errors[
                                                            `ticketType_${index}_price`
                                                        ]
                                                            ? 'border-red'
                                                            : ''
                                                    }
                                                />
                                                {errors[
                                                    `ticketType_${index}_price`
                                                ] && (
                                                    <p className="text-sm text-red">
                                                        {
                                                            errors[
                                                                `ticketType_${index}_price`
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">
                                                    Quantity *
                                                </Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    value={
                                                        ticket.totalQuantity ===
                                                        0
                                                            ? ''
                                                            : ticket.totalQuantity
                                                    }
                                                    onChange={(e) =>
                                                        updateTicketType(
                                                            index,
                                                            'totalQuantity',
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    className={
                                                        errors[
                                                            `ticketType_${index}_quantity`
                                                        ]
                                                            ? 'border-red'
                                                            : ''
                                                    }
                                                />
                                                {errors[
                                                    `ticketType_${index}_quantity`
                                                ] && (
                                                    <p className="text-sm text-red">
                                                        {
                                                            errors[
                                                                `ticketType_${index}_quantity`
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            <X className="mr-2 size-4" />
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-primary hover:bg-primary-darken"
                        >
                            {isLoading ? (
                                <>
                                    <div className="mr-2 size-4 animate-spin rounded-full border-2 border-gray-light border-t-black"></div>
                                    {isEditMode ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                <>
                                    {isEditMode
                                        ? 'Update Event'
                                        : 'Create Event'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
