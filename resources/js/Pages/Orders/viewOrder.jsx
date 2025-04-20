import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function ViewOrder({ auth, concession }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    View Concession Details
                </h2>
            }
        >
            <Head title={`View ${concession.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="space-y-6">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <div className="block w-full mt-1 p-2 bg-gray-100 rounded-md">
                                        {concession.name}
                                    </div>
                                </div>

                                {/* Description Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <div className="block w-full mt-1 p-2 bg-gray-100 rounded-md whitespace-pre-line">
                                        {concession.description || 'No description provided'}
                                    </div>
                                </div>

                                {/* Price Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Price
                                    </label>
                                    <div className="relative mt-1">
                                        <div
                                            className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">LKR</span>
                                        </div>
                                        <div className="block w-full pl-10 pr-12 p-2 bg-gray-100 rounded-md">
                                            {concession.price}
                                        </div>
                                    </div>
                                </div>

                                {/* Image Display */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Image
                                    </label>
                                    {concession.image_path ? (
                                        <div className="mt-2">
                                            <img
                                                src={`/storage/${concession.image_path}`}
                                                alt={concession.name}
                                                className="w-32 h-32 object-cover rounded-md"
                                                onError={(e) => {
                                                    e.target.src = '/storage/concessions/default.webp';
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="mt-1 p-2 text-gray-500">
                                            No image available
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Created
                                        </label>
                                        <div className="block w-full mt-1 p-2 bg-gray-100 rounded-md">
                                            <p>{concession.created_at}</p>
                                            <p className="text-sm text-gray-500">by {concession.created_by}</p>
                                        </div>
                                    </div>
                                    {concession.updated_by && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Last Updated
                                            </label>
                                            <div className="block w-full mt-1 p-2 bg-gray-100 rounded-md">
                                                <p>{concession.updated_at}</p>
                                                <p className="text-sm text-gray-500">by {concession.updated_by}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-end gap-4">
                                    <Link
                                        href={route('concessions.index')}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Back to List
                                    </Link>
                                    <Link
                                        href={route('concessions.edit', concession.id)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Edit
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
