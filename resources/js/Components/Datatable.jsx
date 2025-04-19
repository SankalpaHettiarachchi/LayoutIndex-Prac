import { router, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function DataTable({
      data,
      columns,
      routeName,
      filters = {},
      withActions = true,
      editRoute = null,
      createRoute = null,
      deleteRoute = null,
      onDelete = null
  }) {
    const [localFilters, setLocalFilters] = useState({
        search: filters.search || '',
        per_page: filters.per_page || 10,
        sort: filters.sort || columns[0].field,
        direction: filters.direction || 'asc'
    });

    const updateFilters = (newFilters) => {
        setLocalFilters(prev => ({ ...prev, ...newFilters }));
        router.get(route(routeName),
            { ...localFilters, ...newFilters },
            { preserveState: true, replace: true }
        );
    };

    const handleSort = (field) => {
        const direction = localFilters.sort === field && localFilters.direction === 'asc'
            ? 'desc'
            : 'asc';
        updateFilters({ sort: field, direction });
    };

    return (
        <div className="space-y-4">
            {/* Search and Per Page Controls */}
            <div className="flex justify-between">
                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={localFilters.search}
                        onChange={(e) => updateFilters({ search: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>
                <select
                    value={localFilters.per_page}
                    onChange={(e) => updateFilters({ per_page: e.target.value })}
                    className="px-4 py-2 border rounded-lg"
                >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                </select>
                <Link
                    href={route(createRoute)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
                >
                    Create New
                </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.field}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => column.sortable && handleSort(column.field)}
                            >
                                <div className="flex items-center">
                                    {column.header}
                                    {column.sortable && localFilters.sort === column.field && (
                                        <span className="ml-1">
                                                {localFilters.direction === 'asc' ? '↑' : '↓'}
                                            </span>
                                    )}
                                </div>
                            </th>
                        ))}
                        {withActions && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        )}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {data.data.length > 0 ? (
                        data.data.map((item) => (
                            <tr key={item.id}>
                                {columns.map((column) => (
                                    <td key={`${item.id}-${column.field}`} className="px-6 py-4 whitespace-nowrap">
                                        {column.render
                                            ? column.render(item)
                                            : item[column.field]}
                                    </td>
                                ))}
                                {withActions && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        {editRoute && (
                                            <a
                                                href={route(editRoute, item.id)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Edit
                                            </a>
                                        )}
                                        {deleteRoute && (
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure?')) {
                                                        router.delete(route(deleteRoute, item.id));
                                                    }
                                                }}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(item)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length + (withActions ? 1 : 0)}
                                className="px-6 py-4 text-center text-gray-500"
                            >
                                No records found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {data.total > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing {data.from} to {data.to} of {data.total} entries
                    </div>
                    <div className="flex space-x-1">
                        {data.links.map((link, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (link.url) {
                                        router.get(link.url, localFilters, { preserveState: true });
                                    }
                                }}
                                className={`px-3 py-1 rounded ${link.active ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
