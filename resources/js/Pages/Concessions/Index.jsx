// Index page
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Dialog } from '@headlessui/react';

export default function Concessions({ concessions, filters }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [concessionToDelete, setConcessionToDelete] = useState(null);

    useEffect(() => {
        const channel = window.Echo.channel('ConcessionNotificationChannel')
            .listen('.ActionResponse', (event) => {
                event.type === 'success'
                    ? toast.success(event.message)
                    : toast.error(event.message);
            });

        return () => {
            window.Echo.leave('ConcessionNotificationChannel');
        };
    }, []);

    const handleDeleteClick = (concession) => {
        setConcessionToDelete(concession);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (concessionToDelete) {
            router.delete(route('concessions.destroy', concessionToDelete.id));
        }
        setIsDeleteModalOpen(false);
    };

    const columns = [
        {
            header: 'Image',
            field: 'image_path',
            sortable: false,
            render: (item) => (
                <div className="flex items-center">
                    {item.image_path ? (
                        <div className="mb-2">
                            <img
                                src={`/storage/${item.image_path}`}
                                alt="Concession image"
                                className="w-16 h-16 object-cover rounded"
                            />
                        </div>
                    ) : (
                        <span className="text-gray-400">No image</span>
                    )}
                </div>
            )
        },
        {
            header: 'Name',
            field: 'name',
            sortable: true
        },
        {
            header: 'Description',
            field: 'description',
            sortable: true
        },
        {
            header: 'Price',
            field: 'price',
            sortable: true,
            render: (item) => `LKR ${item.price}`
        },
        {
            header: 'Actions',
            sortable: false,
            render: (item) => (
                <div className="flex flex-wrap gap-2 justify-start">
                    <Link
                        href={route('concessions.show', item.id)}
                        className="text-indigo-600 hover:text-indigo-900 whitespace-nowrap"
                    >
                        View
                    </Link>
                    <Link
                        href={route('concessions.edit', item.id)}
                        className="text-green-600 hover:text-green-900 whitespace-nowrap"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={() => handleDeleteClick(item)}
                        className="text-red-600 hover:text-red-900 whitespace-nowrap"
                    >
                        Delete
                    </button>
                </div>
            ),
            grow: 0,
            minWidth: '150px'
        }
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Concessions
                </h2>
            }
        >
            <Head title="Concessions" />

            {/* Delete Confirmation Modal */}
            <Dialog
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
                        <Dialog.Title className="text-lg font-bold mb-4">
                            Confirm Deletion
                        </Dialog.Title>
                        <Dialog.Description className="mb-4">
                            Are you sure you want to delete "{concessionToDelete?.name}"? This action cannot be undone and will also remove all processing orders related to it.
                        </Dialog.Description>


                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <DataTable
                                data={concessions}
                                columns={columns}
                                routeName="concessions.index"
                                filters={filters}
                                createRoute="concessions.create"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
