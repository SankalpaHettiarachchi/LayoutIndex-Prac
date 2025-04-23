import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function ViewOrder({ auth, order }) {
    const calculateTotal = () => {
        return order.concessions.reduce((total, concession) => {
            return total + (concession.pivot.quantity * concession.pivot.unit_price);
        }, 0);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Order #{order.order_no}
                </h2>
            }
        >
            <Head title={`Order ${order.order_no}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="space-y-6">
                                {/* Order Information */}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Order Number
                                        </label>
                                        <div className="block w-full mt-1 p-2 bg-gray-100 rounded-md">
                                            {order.order_no}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Status
                                        </label>
                                        <div className="block w-full mt-1 p-2 bg-gray-100 rounded-md capitalize">
                                            {order.status.replace('_', ' ')}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Send to Kitchen At
                                        </label>
                                        <div className="block w-full mt-1 p-2 bg-gray-100 rounded-md">
                                            {new Date(order.send_to_kitchen_at).toLocaleString()}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Total Amount
                                        </label>
                                        <div className="block w-full mt-1 p-2 bg-gray-100 rounded-md">
                                            LKR {calculateTotal()}
                                        </div>
                                    </div>
                                </div>

                                {/* Concessions List */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Order Items
                                    </label>
                                    <div className="mt-4 space-y-4">
                                        {order.concessions.map((concession) => (
                                            <div key={concession.id} className="p-4 border rounded-md">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        {concession.image_path && (
                                                            <img
                                                                src={`/storage/${concession.image_path}`}
                                                                alt={concession.name}
                                                                className="w-16 h-16 object-cover rounded-md"
                                                                onError={(e) => {
                                                                    e.target.src = '/storage/concessions/default.webp';
                                                                }}
                                                            />
                                                        )}
                                                        <div>
                                                            <h3 className="font-medium">{concession.name}</h3>
                                                            <p className="text-sm text-gray-500">{concession.description}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p>LKR {concession.pivot.unit_price} × {concession.pivot.quantity}</p>
                                                        <p className="font-medium">
                                                            LKR {(concession.pivot.unit_price * concession.pivot.quantity)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Timestamps */}
                                <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Created
                                        </label>
                                        <div className="block w-full mt-1 p-2 bg-gray-100 rounded-md">
                                            <p>{order.created_at}</p>
                                            <p className="text-sm text-gray-500">by {order.creator?.name || 'System'}</p>
                                        </div>
                                    </div>
                                    {order.updater && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Last Updated
                                            </label>
                                            <div className="block w-full mt-1 p-2 bg-gray-100 rounded-md">
                                                <p>{order.updated_at}</p>
                                                <p className="text-sm text-gray-500">by {order.updater?.name}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-end gap-4 pt-6">
                                    <Link
                                        href={route('kitchen.index')}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Back to Kitchen
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
