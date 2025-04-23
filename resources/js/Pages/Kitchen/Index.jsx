import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import dayjs from 'dayjs';

export default function Kitchen({ orders, filters }) {
    const [localFilters, setLocalFilters] = useState({
        search: filters.search || '',
        per_page: filters.per_page || 5,
        sort: filters.sort || 'send_to_kitchen_at',
        direction: filters.direction || 'desc',
        status: filters.status || 'in-progress', // Add status filter
    });

    useEffect(() => {
        const channel = window.Echo.channel("OrderInProgressChannel")
            .listen(".OrderStatusUpdate", (event) => {
                const order = event.order;
                toast.info(`New Order Received : ${order.order_no}`);
                router.reload();
            });

        const completeChannel = window.Echo.channel("OrderCompleteChannel")
            .listen(".OrderStatusUpdate", (event) => {
                const order = event.order;
                toast.success(`Order completed: ${order.order_no}`);
                router.reload();
            });

        return () => {
            window.Echo.leave("OrderInProgressChannel");
            window.Echo.leave("OrderCompleteChannel");
        };
    }, []);

    const updateFilters = (newFilters) => {
        const updatedFilters = { ...localFilters, ...newFilters };
        setLocalFilters(updatedFilters);
        router.get(route('kitchen.index'), updatedFilters, {
            preserveState: true,
            replace: true,
            preserveScroll: true
        });
    };

    const completeOrder = (orderId) => {
        router.post(route('kitchen.complete', { order: orderId }),{},{
                onSuccess: () => {
                    router.reload();
                },
                onError: (errors) => {
                    console.error('Error processing order:', errors);
                    // Error notification will come from backend event
                }
            }
        );
    };

    const showOrder = (orderId) => {
        router.get(route('kitchen.show', { order: orderId}),{},{
                onSuccess: () => {
                    router.reload();
                },
                onError: (errors) => {
                    console.error('Error processing order:', errors);
                    // Error notification will come from backend event
                }
            }
        );
    };


    const formatTime = (date) => {
        return date ? dayjs(date).format('h:mm A') : 'Not sent yet';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Kitchen Orders
                </h2>
            }
        >
            <Head title="Kitchen Orders" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Search and Filter Controls */}
                            <div className="flex flex-col sm:flex-row items-end gap-4 mb-6">
                                <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4 flex-1">
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <label htmlFor="search-input"
                                               className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                            Search:
                                        </label>
                                        <input
                                            id="search-input"
                                            type="text"
                                            placeholder="Search orders..."
                                            value={localFilters.search}
                                            onChange={(e) => updateFilters({search: e.target.value})}
                                            className="px-4 py-2 border rounded-lg flex-1 min-w-0"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <label htmlFor="per-page-select"
                                               className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                            Show:
                                        </label>
                                        <select
                                            id="per-page-select"
                                            value={localFilters.per_page}
                                            onChange={(e) => updateFilters({per_page: e.target.value})}
                                            className="px-4 py-2 border rounded-lg w-24"
                                        >
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                            <option value="50">50</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <label htmlFor="status-select"
                                           className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        Status:
                                    </label>
                                    <select
                                        id="status-select"
                                        value={localFilters.status}
                                        onChange={(e) => updateFilters({status: e.target.value})}
                                        className="px-4 py-2 border rounded-lg w-36"
                                    >
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <label htmlFor="sort-select"
                                           className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        Sort by:
                                    </label>
                                    <select
                                        id="sort-select"
                                        value={localFilters.sort}
                                        onChange={(e) => updateFilters({sort: e.target.value})}
                                        className="px-4 py-2 border rounded-lg w-48"
                                    >
                                        <option value="order_no">Order Number</option>
                                        <option value="send_to_kitchen_at">Kitchen Time</option>
                                    </select>
                                    <select
                                        value={localFilters.direction}
                                        onChange={(e) => updateFilters({direction: e.target.value})}
                                        className="px-4 py-2 border rounded-lg w-24"
                                    >
                                        <option value="asc">Asc</option>
                                        <option value="desc">Desc</option>
                                    </select>
                                </div>
                            </div>

                            {/* Orders List */}
                            <div className="space-y-4">
                                {orders.data.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        No orders found
                                    </div>
                                ) : (
                                    orders.data.map((order) => (
                                        <div key={order.id} className="border rounded-lg overflow-hidden shadow-sm">
                                            <div
                                                className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b">
                                                {/* Order number + status pill */}
                                                <div className="flex items-center space-x-4">
                                                    <span className="font-medium text-gray-900">#{order.order_no}</span>

                                                    <span
                                                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                                            order.status
                                                        )}`}
                                                    >
                                                        {order.status.replace('-', ' ')}
                                                    </span>
                                                </div>

                                                {/* Time + action (only when in‑progress) */}
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-sm text-gray-500">
                                                        {order.send_to_kitchen_at}
                                                    </span>

                                                    <button
                                                        onClick={() => showOrder(order.id)}
                                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                    >
                                                        Show
                                                    </button>

                                                    {order.status === 'in-progress' && (
                                                        <button
                                                            onClick={() => completeOrder(order.id)}
                                                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-green border border-green-600 rounded-md shadow-sm hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                        >
                                                            Complete
                                                        </button>
                                                    )}
                                                </div>
                                            </div>


                                            <div className="p-4">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">Items</h3>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="font-medium">Total: LKR {order.total}</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {order.concessions.map((item) => (
                                                        <div key={item.id} className="border rounded p-3 flex">
                                                            {item.image_path && (
                                                                <div className="mr-3 flex-shrink-0">
                                                                    <img
                                                                        src={`/storage/${item.image_path}`}
                                                                        alt={item.name}
                                                                        className="h-16 w-16 object-cover rounded"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div className="flex-1">
                                                                <div className="flex justify-between">
                                                                    <span className="font-medium">{item.name}</span>
                                                                    <span
                                                                        className="text-gray-600">x{item.pivot.quantity}</span>
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    LKR {item.pivot.unit_price} each
                                                                </div>
                                                                <div className="mt-1 text-sm font-medium">
                                                                    Subtotal:
                                                                    LKR {item.pivot.quantity * item.pivot.unit_price}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Pagination */}
                            {orders.data.length > 0 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 px-4">
                                    <div className="text-sm text-gray-700 whitespace-nowrap">
                                        Showing {orders.from} to {orders.to} of {orders.total} orders
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {orders.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    if (link.url) {
                                                        const page = new URL(link.url).searchParams.get('page');
                                                        updateFilters({ page });
                                                    }
                                                }}
                                                className={`px-3 py-1 rounded text-sm ${link.active ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'} min-w-[2rem]`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
