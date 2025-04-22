import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import { useEffect } from "react";
import { toast } from "react-toastify";
import CountdownTimer from '@/Components/CountdownTimer';
import dayjs from 'dayjs';

export default function Orders({ orders, filters }) {
    useEffect(() => {
        const inProgressChannel = window.Echo.channel("OrderInProgressChannel")
            .listen(".OrderStatusUpdate", (event) => {
                const order = event.order;
                toast.success(`Order sent to kitchen: ${order.order_no}`);
                router.reload();
            });

        const completeChannel = window.Echo.channel("OrderCompleteChannel")
            .listen(".OrderStatusUpdate", (event) => {
                const order = event.order;
                toast.info(`Order completed: ${order.order_no}`);
                router.reload();
            });

        const notificationChannel = window.Echo.channel('OrderNotificationChannel')
            .listen('.ActionResponse', (event) => {
                event.type === 'success'
                    ? toast.success(event.message)
                    : toast.error(event.message);
            });

        return () => {
            window.Echo.leave("OrderInProgressChannel");
            window.Echo.leave("OrderCompleteChannel");
            window.Echo.leave("OrderNotificationChannel");
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
            sortable: true,
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
            sortable: false
        },
        {
            header: 'Auto Send Countdown',
            field: 'countdown',
            render: (item) => {
                if (
                    item.status === 'in-progress' || // already sent
                    !item.send_to_kitchen_at ||     // no time set
                    dayjs(item.send_to_kitchen_at).isBefore(dayjs()) // time passed
                ) {
                    return <span className="text-gray-500">Already Sent</span>;
                }

                return <CountdownTimer targetTime={item.send_to_kitchen_at} />;
            }
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

                    {item.status !== 'in-progress' || item.status !== 'completed' &&  (
                        <button
                            onClick={() => sendOrder(item.id)}
                            className="text-green-600 hover:text-green-900 whitespace-nowrap"
                        >
                            Send
                        </button>
                    )}

                    {item.status !== 'in-progress' && (
                        <button
                            onClick={() => deleteOrder(item.id)}
                            className="text-red-600 hover:text-red-900 whitespace-nowrap"
                        >
                            Delete
                        </button>
                    )}
                </div>
            )
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
                                statusFilter={true}
                                createRoute="orders.create"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
