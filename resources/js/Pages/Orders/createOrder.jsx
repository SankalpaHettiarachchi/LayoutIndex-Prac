import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, useForm, Link, router} from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ConcessionDropdown from '@/Components/ConcessionDropdown';
import {toast} from "react-toastify";

export default function CreateOrder() {
    const [selectedItems, setSelectedItems] = useState([]);

    const { data, setData, post, processing, errors,reset } = useForm({
        concessions: [], // Initialize as empty array instead of null
        send_to_kitchen_at: ''
    });

    // Sync selectedItems with form data
    useEffect(() => {
        setData('concessions', selectedItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
        })));
    }, [selectedItems]);

    useEffect(() => {
        const channel = window.Echo.channel('OrderNotificationChannel')
            .listen('.ActionResponse', (event) => {
                event.type === 'success'
                    ? toast.success(event.message)
                    : toast.error(event.message);
            });

        return () => {
            window.Echo.leave('NotificationChannel');
        };
    }, []);

    const handleAddConcession = (concession) => {
        setSelectedItems(prev => {
            const existing = prev.find(item => item.id === concession.id);
            if (existing) {
                return prev.map(item =>
                    item.id === concession.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...concession, quantity: 1 }];
        });
    };

    const handleRemoveConcession = (id) => {
        setSelectedItems(prev => prev.filter(item => item.id !== id));
    };

    const handleQuantityChange = (id, quantity) => {
        setSelectedItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const selectedTime = new Date(data.send_to_kitchen_at);
        const now = new Date();

        if (selectedTime <= now) {
            alert('Please select a future time for sending to kitchen.');
            return;
        }

        post(route('orders.store'), {
            onError: (errors) => {
                console.error('Submission errors:', errors);
            },
            onSuccess: () => {
                reset();
                setSelectedItems([]);
                console.log('Submission successful');
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create New Order
                </h2>
            }
        >
            <Head title="Create Order"/>

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Concession Selection */}
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Left: Select Concessions */}
                                    <div className="min-h-[400px] lg:w-1/2 space-y-4">
                                        <h3 className="text-lg font-medium text-gray-900">Select Concessions</h3>
                                        <ConcessionDropdown onSelect={handleAddConcession}/>

                                        {/* Add Send to Kitchen Time input */}
                                        <div className="mt-4">
                                            <label htmlFor="send_to_kitchen_at"
                                                   className="block text-sm font-medium text-gray-700">
                                                Send to Kitchen Time
                                            </label>
                                            <input
                                                type="datetime-local"
                                                id="send_to_kitchen_at"
                                                name="send_to_kitchen_at"
                                                value={data.send_to_kitchen_at}
                                                onChange={(e) => setData('send_to_kitchen_at', e.target.value)}
                                                min={new Date().toISOString().slice(0, 16)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                            {errors.send_to_kitchen_at && (
                                                <p className="mt-1 text-sm text-red-600">{errors.send_to_kitchen_at}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Selected Items */}
                                    <div className="lg:w-1/2 space-y-4">
                                        <h4 className="font-medium text-lg">Selected Items</h4>
                                        {selectedItems.length > 0 ? (
                                            <>
                                            <div className="space-y-2 overflow-y-auto pr-2"
                                                     style={{maxHeight: '60vh'}}>
                                                    {selectedItems.map((item) => (
                                                        <div key={item.id}
                                                             className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                                            <div className="flex items-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveConcession(item.id)}
                                                                    className="text-red-600 hover:text-red-800 mr-2"
                                                                >
                                                                    X
                                                                </button>
                                                                {item.image_path && (
                                                                    <img
                                                                        src={`/storage/${item.image_path}`}
                                                                        alt={item.name}
                                                                        className="w-10 h-10 rounded-full object-cover mr-3"
                                                                    />
                                                                )}
                                                                <div>
                                                                    <div className="font-medium">{item.name}</div>
                                                                    <div className="text-sm text-gray-500">
                                                                        LKR {item.price} each
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-3">
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    value={item.quantity}
                                                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                                                    className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
                                                                />
                                                                <span className="font-medium">
                                                                    LKR {(item.price * item.quantity).toFixed(2)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div
                                                    className="flex justify-between items-center pt-2 border-t border-gray-200">
                                                    <span className="font-medium">Total:</span>
                                                    <span className="font-medium">
                                                        LKR {selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-gray-500">No items selected yet</p>
                                        )}
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                                    <Link
                                        href={route('orders.index')}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Back to Orders
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing || selectedItems.length === 0}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {processing ? 'Creating Order...' : 'Create Order'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
