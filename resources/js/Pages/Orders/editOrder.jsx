import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function editOrder({ auth, concession }) {
    const { data, setData, post, processing, errors } = useForm({
        name: concession.name,
        description: concession.description,
        price: concession.price,
        image_path: null,
        _method: 'PUT',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('concessions.update', concession.id),{
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Concession
                </h2>
            }
        >
            <Head title="Edit Concession" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        autoFocus
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                {/* Description Field */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                </div>

                                {/* Price Field */}
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                        Price
                                    </label>
                                    <div className="relative mt-1 rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">LKR</span>
                                        </div>
                                        <input
                                            id="price"
                                            type="number"
                                            step="1"
                                            min="0"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            className="block w-full pl-10 pr-12 border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                                </div>

                                {/* Image Upload Field */}
                                <div>
                                    <label htmlFor="image_path" className="block text-sm font-medium text-gray-700">
                                        Image
                                    </label>
                                    {concession.image_path && (
                                        <div className="mb-2">
                                            <img
                                                src={`/storage/${concession.image_path}`}
                                                alt="Current concession"
                                                className="w-32 h-32 object-cover rounded"
                                            />
                                            <p className="text-sm text-gray-500 mt-1">Current image</p>
                                        </div>
                                    )}
                                    <input
                                        id="image_path"
                                        type="file"
                                        onChange={(e) => setData('image_path', e.target.files[0])}
                                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.image_path && <p className="mt-1 text-sm text-red-600">{errors.image_path}</p>}
                                </div>

                                {/* Form Actions */}
                                <div className="flex items-center justify-end gap-4">
                                    <Link
                                        href={route('concessions.index')}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {processing ? 'Updating...' : 'Update'}
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
