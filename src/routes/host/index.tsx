import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMe } from '@/hooks';
import {
    createOrganizationMutation,
    getAllOrganizationsOptions,
    getMyOrganizationsOptions,
    updateOrgStatusMutation,
} from '@/services/client/@tanstack/react-query.gen';
import type { MeData, Organization } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
    Building2,
    CheckCircle2,
    Clock,
    Image as ImageIcon,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Upload,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/host/')({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const { data: rawMeData, isLoading: isMeLoading } = useMe();
    const meData = rawMeData?.data as MeData;

    useEffect(() => {
        if (!isMeLoading && !meData) {
            toast.error('Please login to access this page');
            navigate({ to: '/' });
        }
    }, [meData, isMeLoading, navigate]);

    if (isMeLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!meData) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 px-5 py-10 md:px-10 lg:px-20">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-black md:text-5xl">
                        Organization Management
                    </h1>
                    <p className="mt-2 text-xl text-gray">
                        {meData.role === 'ADMIN'
                            ? 'Manage organization approval requests'
                            : 'Create and manage your organizations'}
                    </p>
                </div>

                {meData.role === 'ADMIN' ? <AdminPanel /> : <UserPanel />}
            </div>
        </div>
    );
}

function UserPanel() {
    const [isCreating, setIsCreating] = useState(false);
    const queryClient = useQueryClient();

    const { data: orgResponse, isLoading } = useQuery({
        ...getMyOrganizationsOptions(),
        refetchInterval: 5000,
    });

    const myOrganizations = orgResponse?.data as Organization[];

    return (
        <div className="space-y-8">
            {/* Create Organization Button */}
            <Card className="border-2 border-dashed border-primary/30 bg-white/50 p-8 transition-all duration-200 hover:border-primary/50 hover:bg-white/80">
                <button
                    className="group flex w-full items-center justify-center gap-3"
                    onClick={() => setIsCreating(true)}
                >
                    <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 transition-all duration-200 group-hover:scale-110 group-hover:bg-primary/20">
                        <Building2 className="size-8 text-primary" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-2xl font-bold text-black">
                            Create New Organization
                        </h3>
                        <p className="text-lg text-gray">
                            Start hosting events with your organization
                        </p>
                    </div>
                </button>
            </Card>

            {/* Create Organization Form */}
            {isCreating && (
                <CreateOrganizationForm
                    onClose={() => setIsCreating(false)}
                    onSuccess={() => {
                        setIsCreating(false);
                        queryClient.invalidateQueries({
                            queryKey: ['getMyOrganizations'],
                        });
                    }}
                />
            )}

            {/* My Organizations */}
            <div>
                <h2 className="mb-4 text-3xl font-bold text-black">
                    My Organizations
                </h2>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="size-8 animate-spin text-primary" />
                    </div>
                ) : myOrganizations && myOrganizations.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {myOrganizations.map((org) => (
                            <OrganizationCard
                                key={org.organizationId}
                                organization={org}
                            />
                        ))}
                    </div>
                ) : (
                    <Card className="bg-white/80 p-12 text-center">
                        <p className="text-xl text-gray">
                            No organizations yet. Create one to get started!
                        </p>
                    </Card>
                )}
            </div>
        </div>
    );
}

function CreateOrganizationForm({
    onClose,
    onSuccess,
}: {
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [logo, setLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const createOrg = useMutation({
        ...createOrganizationMutation(),
        onSuccess() {
            toast.success('Organization created! Waiting for admin approval.');
            onSuccess();
        },
        onError() {
            toast.error('Failed to create organization');
        },
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogo(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !phoneNumber || !address) {
            toast.error('Please fill in all required fields');
            return;
        }

        createOrg.mutate({
            body: {
                name,
                description,
                email,
                phoneNumber,
                address,
                logo: logo || undefined,
            },
        });
    };

    return (
        <Card className="border-primary/20 bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-3xl font-bold text-black">
                    Create Organization
                </h3>
                <button
                    onClick={onClose}
                    className="rounded-lg p-2 transition-all duration-200 hover:bg-gray-light/50"
                >
                    <XCircle className="size-6 text-gray" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Logo Upload */}
                <div>
                    <Label className="text-lg font-semibold">
                        Organization Logo
                    </Label>
                    <div className="mt-2 flex items-center gap-4">
                        {logoPreview ? (
                            <img
                                src={logoPreview}
                                alt="Logo preview"
                                className="size-24 rounded-lg border-2 border-gray-light object-cover"
                            />
                        ) : (
                            <div className="flex size-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-light bg-gray-light/20">
                                <ImageIcon className="size-8 text-gray" />
                            </div>
                        )}
                        <label className="cursor-pointer">
                            <div className="flex items-center gap-2 rounded-lg border border-primary bg-primary/10 px-4 py-2 transition-all duration-200 hover:bg-primary/20">
                                <Upload className="size-5 text-primary" />
                                <span className="font-semibold text-primary">
                                    Upload Logo
                                </span>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {/* Name */}
                <div>
                    <Label htmlFor="name" className="text-lg font-semibold">
                        Organization Name *
                    </Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter organization name"
                        required
                        className="mt-2"
                    />
                </div>

                {/* Description */}
                <div>
                    <Label
                        htmlFor="description"
                        className="text-lg font-semibold"
                    >
                        Description
                    </Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your organization"
                        rows={4}
                        className="mt-2"
                    />
                </div>

                {/* Email */}
                <div>
                    <Label htmlFor="email" className="text-lg font-semibold">
                        Email *
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="organization@example.com"
                        required
                        className="mt-2"
                    />
                </div>

                {/* Phone */}
                <div>
                    <Label
                        htmlFor="phoneNumber"
                        className="text-lg font-semibold"
                    >
                        Phone Number *
                    </Label>
                    <Input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="0999888777"
                        required
                        className="mt-2"
                    />
                </div>

                {/* Address */}
                <div>
                    <Label htmlFor="address" className="text-lg font-semibold">
                        Address *
                    </Label>
                    <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Hanoi, Vietnam"
                        required
                        className="mt-2"
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                        disabled={createOrg.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1"
                        disabled={createOrg.isPending}
                    >
                        {createOrg.isPending ? (
                            <>
                                <Loader2 className="mr-2 size-5 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Organization'
                        )}
                    </Button>
                </div>
            </form>
        </Card>
    );
}

function OrganizationCard({ organization }: { organization: Organization }) {
    const navigate = useNavigate();

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'ACTIVE':
                return (
                    <div className="bg-green-100 text-green-700 flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold">
                        <CheckCircle2 className="size-4" />
                        Active
                    </div>
                );
            case 'PENDING':
                return (
                    <div className="bg-yellow-100 text-yellow-700 flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold">
                        <Clock className="size-4" />
                        Pending
                    </div>
                );
            case 'INACTIVE':
                return (
                    <div className="bg-red-100 text-red-700 flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold">
                        <XCircle className="size-4" />
                        Inactive
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Card className="group overflow-hidden bg-white transition-all duration-200 hover:shadow-lg">
            <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        {organization.logoUrl ? (
                            <img
                                src={organization.logoUrl}
                                alt={organization.name}
                                className="size-16 rounded-lg border-2 border-gray-light object-cover"
                            />
                        ) : (
                            <div className="flex size-16 items-center justify-center rounded-lg bg-primary/10">
                                <Building2 className="size-8 text-primary" />
                            </div>
                        )}
                        <div>
                            <h3 className="text-2xl font-bold text-black">
                                {organization.name}
                            </h3>
                            {getStatusBadge(organization.status)}
                        </div>
                    </div>
                </div>

                {organization.description && (
                    <p className="mb-4 line-clamp-2 text-lg text-gray">
                        {organization.description}
                    </p>
                )}

                <div className="space-y-2 border-t border-gray-light pt-4">
                    {organization.email && (
                        <div className="flex items-center gap-2 text-gray">
                            <Mail className="size-5" />
                            <span>{organization.email}</span>
                        </div>
                    )}
                    {organization.phoneNumber && (
                        <div className="flex items-center gap-2 text-gray">
                            <Phone className="size-5" />
                            <span>{organization.phoneNumber}</span>
                        </div>
                    )}
                    {organization.address && (
                        <div className="flex items-center gap-2 text-gray">
                            <MapPin className="size-5" />
                            <span>{organization.address}</span>
                        </div>
                    )}
                </div>

                <Button
                    className="mt-6 w-full"
                    onClick={() => {
                        navigate({
                            to: '/organizer/$orgId',
                            params: { orgId: organization.organizationId },
                        });
                    }}
                >
                    Manage Organization
                </Button>
            </div>
        </Card>
    );
}

function AdminPanel() {
    const [statusFilter, setStatusFilter] = useState<
        'PENDING' | 'ACTIVE' | 'INACTIVE' | undefined
    >('PENDING');
    const [page, setPage] = useState(0);
    const queryClient = useQueryClient();

    const { data: orgResponse, isLoading } = useQuery({
        ...getAllOrganizationsOptions({
            query: {
                status: statusFilter,
                page,
                size: 10,
            },
        }),
        refetchInterval: 5000,
    });

    const organizations = orgResponse?.data as Organization[];
    const pagedResult = orgResponse?.pagedResult;

    const updateStatus = useMutation({
        ...updateOrgStatusMutation(),
        onSuccess() {
            toast.success('Organization status updated');
            queryClient.invalidateQueries({
                queryKey: ['getAllOrganizations'],
            });
        },
        onError() {
            toast.error('Failed to update status');
        },
    });

    const handleStatusUpdate = (
        orgId: string,
        status: 'ACTIVE' | 'INACTIVE',
    ) => {
        updateStatus.mutate({
            path: { orgId: Number.parseInt(orgId) },
            body: { status },
        });
    };

    return (
        <div className="space-y-6">
            {/* Filter Tabs */}
            <Card className="bg-white p-4">
                <div className="flex gap-2">
                    {[
                        { value: 'PENDING' as const, label: 'Pending' },
                        { value: 'ACTIVE' as const, label: 'Active' },
                        { value: 'INACTIVE' as const, label: 'Inactive' },
                        { value: undefined, label: 'All' },
                    ].map((filter) => (
                        <button
                            key={filter.label}
                            onClick={() => {
                                setStatusFilter(filter.value);
                                setPage(0);
                            }}
                            className={`rounded-lg px-6 py-3 text-lg font-semibold transition-all duration-200 ${
                                statusFilter === filter.value
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-light/50 text-gray hover:bg-gray-light'
                            }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </Card>

            {/* Organizations List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="size-8 animate-spin text-primary" />
                </div>
            ) : organizations && organizations.length > 0 ? (
                <>
                    <div className="grid gap-6">
                        {organizations.map((org) => (
                            <Card
                                key={org.organizationId}
                                className="bg-white p-6"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        {org.logoUrl ? (
                                            <img
                                                src={org.logoUrl}
                                                alt={org.name}
                                                className="size-20 rounded-lg border-2 border-gray-light object-cover"
                                            />
                                        ) : (
                                            <div className="flex size-20 items-center justify-center rounded-lg bg-primary/10">
                                                <Building2 className="size-10 text-primary" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-black">
                                                {org.name}
                                            </h3>
                                            {org.description && (
                                                <p className="mt-2 text-lg text-gray">
                                                    {org.description}
                                                </p>
                                            )}
                                            <div className="mt-4 space-y-1">
                                                {org.email && (
                                                    <div className="flex items-center gap-2 text-gray">
                                                        <Mail className="size-4" />
                                                        <span>{org.email}</span>
                                                    </div>
                                                )}
                                                {org.phoneNumber && (
                                                    <div className="flex items-center gap-2 text-gray">
                                                        <Phone className="size-4" />
                                                        <span>
                                                            {org.phoneNumber}
                                                        </span>
                                                    </div>
                                                )}
                                                {org.address && (
                                                    <div className="flex items-center gap-2 text-gray">
                                                        <MapPin className="size-4" />
                                                        <span>
                                                            {org.address}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {statusFilter === 'PENDING' && (
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        org.organizationId,
                                                        'ACTIVE',
                                                    )
                                                }
                                                disabled={
                                                    updateStatus.isPending
                                                }
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <CheckCircle2 className="mr-2 size-5" />
                                                Approve
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        org.organizationId,
                                                        'INACTIVE',
                                                    )
                                                }
                                                disabled={
                                                    updateStatus.isPending
                                                }
                                                variant="outline"
                                                className="border-red-600 text-red-600 hover:bg-red-50"
                                            >
                                                <XCircle className="mr-2 size-5" />
                                                Reject
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagedResult &&
                        pagedResult.totalPages &&
                        pagedResult.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                <Button
                                    onClick={() =>
                                        setPage((p) => Math.max(0, p - 1))
                                    }
                                    disabled={page === 0}
                                    variant="outline"
                                >
                                    Previous
                                </Button>
                                <span className="text-lg text-gray">
                                    Page {page + 1} of {pagedResult.totalPages}
                                </span>
                                <Button
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={
                                        page + 1 >=
                                        (pagedResult.totalPages || 0)
                                    }
                                    variant="outline"
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                </>
            ) : (
                <Card className="bg-white/80 p-12 text-center">
                    <p className="text-xl text-gray">
                        No organizations found with this status.
                    </p>
                </Card>
            )}
        </div>
    );
}
