import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';

export default function Orders({ orders, filters }) {
    const columns = [
        {
            header: 'Order No',
            field: 'order_no',
            sortable: true
        },
        {
            header: 'Send to Kitchen Time',
            field: 'send_to_kitchen_at',
            sortable: true
        },
        {
            header: 'Total',
            field: 'total',
            render: (item) => `LKR ${item.total}`,
            sortable: true
        },
        {
            header: 'Status',
            field: 'status',
            sortable: true
        }
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Orders
                </h2>
            }
        >
            <Head title="Concessions" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <DataTable
                                data={orders}
                                columns={columns}
                                routeName="concessions.index"
                                filters={filters}
                                createRoute="orders.create"
                                viewRoute="orders.show"
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
