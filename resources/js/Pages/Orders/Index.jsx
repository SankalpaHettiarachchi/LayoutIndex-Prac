import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import {useEffect, useState} from "react";
import { toast } from "react-toastify";
import CountdownTimer from '@/Components/CountdownTimer';
import { Dialog } from '@headlessui/react';
import dayjs from 'dayjs';
import {OrderStatus} from "@/Components/Constants.jsx";

export default function Orders({ orders, filters }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [orderToSend, setOrderToSend] = useState(null);

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

        const pending = window.Echo.channel("OrderPending")
            .listen(".OrderStatusUpdate", (event) => {
                const order = event.order;
                toast.error(`Order sent failed: ${order.order_no}`);
                router.reload();
            });

        return () => {
            window.Echo.leave("OrderInProgressChannel");
            window.Echo.leave("OrderCompleteChannel");
            window.Echo.leave("OrderNotificationChannel");
            window.Echo.leave("OrderPending");
        };
    }, []);

    const handleDeleteClick = (order) => {
        setOrderToDelete(order);
        setIsDeleteModalOpen(true);
    };

    const sendOrder = (order) => {
        setOrderToSend(order);
        setIsSendModalOpen(true);
    };

    const confirmDelete = () => {
        if (orderToDelete) {
            router.delete(route('orders.destroy', orderToDelete.id));  // Use orderToDelete.id
        }
        setIsDeleteModalOpen(false);
    };

    const confirmSend = () => {
        if (orderToSend) {
            router.post(route('orders.send', { order: orderToSend.id }), {}, {
                onSuccess: () => router.reload(),
                onError: (errors) => {
                    toast.error('Failed to send order to kitchen');
                    console.error('Error sending order:', errors);
                }
            });
        }
        setIsSendModalOpen(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case OrderStatus.IN_PROGRESS:
                return 'bg-yellow-100 text-yellow-800';
            case OrderStatus.COMPLETED:
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
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
                    item.status === OrderStatus.IN_PROGRESS ||
                    item.status === OrderStatus.COMPLETED ||
                    !item.send_to_kitchen_at ||
                    dayjs(item.send_to_kitchen_at).isBefore(dayjs())
                ) {
                    return <span className="text-gray-500">Already Sent</span>;
                }

                return <CountdownTimer targetTime={item.send_to_kitchen_at} />;
            }
        },
        {
            header: 'Status',
            field: 'status',
            sortable: true,
            render: (item) => {
                const statusColor = getStatusColor(item.status); // Get dynamic status color
                return (
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColor}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                );
            }
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

                    {item.status !== 'in-progress' && item.status !== 'completed' && (
                        <button
                            onClick={() => sendOrder(item)}
                            className="text-green-600 hover:text-green-900 whitespace-nowrap"
                        >
                            Send
                        </button>
                    )}

                    {item.status !== 'in-progress' && (
                        <button
                            onClick={() => handleDeleteClick(item)}
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
                            Are you sure you want to delete order "{orderToDelete?.order_no}"? This action cannot be undone!
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

            <Dialog
                open={isSendModalOpen}
                onClose={() => setIsSendModalOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
                        <Dialog.Title className="text-lg font-bold mb-4">
                            Confirm Send to Kitchen
                        </Dialog.Title>
                        <Dialog.Description className="mb-4">
                            Are you sure you want to send order "{orderToSend?.order_no}" to the kitchen?
                        </Dialog.Description>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsSendModalOpen(false)}
                                className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSend}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Confirm Send
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
