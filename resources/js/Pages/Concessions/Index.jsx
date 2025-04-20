import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';

export default function Concessions({ concessions, filters }) {
    const columns = [
        {
            header: 'Image',
            field: 'image_path',
            sortable: true,
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
            render: (item) => `$${item.price}`
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
                                viewRoute="concessions.show"
                                editRoute="concessions.edit"
                                deleteRoute="concessions.destroy"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
