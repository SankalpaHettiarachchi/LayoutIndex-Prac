import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Orders({ orders, filters }) {
    useEffect(() => {
        const channel = window.Echo.channel("OrderChannel")
            .listen(".Create", (event) => {
                console.log("Event received:", event);
                const order = event.order;
                const message = event.message;
                toast.success(`Sent to kitchen: ${order.order_no}`);
            });

        return () => {
            window.Echo.leave("OrderChannel");
        };
    }, []);

    const sendOrder = (orderId) => {
        router.post(route('orders.send', { order: orderId }), {}, {
            onSuccess: () => {
                // toast.success('Order sent to kitchen successfully');
                router.reload();
            },
            onError: (errors) => {
                toast.error('Failed to send order to kitchen');
                console.error('Error sending order:', errors);
            }
        });
    };

    const deleteOrder = (orderId) => {
        if (confirm('Are you sure you want to delete this order?')) {
            router.delete(route('orders.destroy', orderId), {
                onSuccess: () => {
                    // toast.success('Order deleted successfully');
                    router.reload();
                },
                onError: () => {
                    toast.error('Failed to delete order');
                }
            });
        }
    };

    const columns = [
        {
            header: 'Order No',
            field: 'order_no',
            sortable: true
        },
        {
            header: 'Send to Kitchen Time',
            field: 'send_to_kitchen_at',
            sortable: true,
            render: (item) => item.send_to_kitchen_at || 'Not sent yet'
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
        },
        {
            header: 'Actions',
            sortable: false,
            render: (item) => (
                <div className="flex flex-wrap gap-2 justify-start">
                    <Link
                        href={route('orders.show', item.id)}
                        className="text-indigo-600 hover:text-indigo-900 whitespace-nowrap"
                    >
                        View
                    </Link>
                    <button
                        onClick={() => sendOrder(item.id)}
                        className="text-green-600 hover:text-green-900 whitespace-nowrap"
                    >
                        Send to Kitchen
                    </button>
                    <button
                        onClick={() => deleteOrder(item.id)}
                        className="text-red-600 hover:text-red-900 whitespace-nowrap"
                    >
                        Delete
                    </button>
                </div>
            ),
            grow: 0,
            minWidth: '250px'
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
            <Head title="Orders" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <DataTable
                                data={orders}
                                columns={columns}
                                routeName="orders.index"
                                filters={filters}
                                createRoute="orders.create"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
