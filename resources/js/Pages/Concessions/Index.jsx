// Index page
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
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
                        onClick={() => {
                            if (confirm('Are you sure you want to delete this concession?')) {
                                router.delete(route('concessions.destroy', item.id));
                            }
                        }}
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
