import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';

export default function Concessions({ concessions, filters }) {
    const columns = [
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
