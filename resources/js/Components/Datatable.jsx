import DataTable from 'react-data-table-component';
import { router, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function CommonDataTable({
      data,
      columns,
      routeName,
      filters = {},
      withActions = true,
      editRoute = null,
      createRoute = null,
      viewRoute = null,
      deleteRoute = null,
      onDelete = null
}) {
    const [localFilters, setLocalFilters] = useState({
        search: filters.search || '',
        per_page: filters.per_page || 5,
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

    const handleSort = (column, sortDirection) => {
        updateFilters({
            sort: column.selector || column.field,
            direction: sortDirection
        });
    };

    // Transform columns for react-data-table-component
    const transformedColumns = [
        ...columns.map(column => ({
            name: column.header,
            selector: row => column.field ? row[column.field] : null,
            sortable: column.sortable || false,
            cell: row => column.render ? column.render(row) : (column.field ? row[column.field] : null),
            grow: column.grow || 1, // Allow columns to grow as needed
        })),
        ...(withActions ? [{
            name: 'Actions',
            cell: row => (
                <div className="flex flex-wrap gap-2 justify-start">
                    {viewRoute && (
                        <Link
                            href={route(viewRoute, row.id)}
                            className="text-indigo-600 hover:text-indigo-900 whitespace-nowrap"
                        >
                            View
                        </Link>
                    )}
                    {editRoute && (
                        <Link
                            href={route(editRoute, row.id)}
                            className="text-green-600 hover:text-green-900 whitespace-nowrap"
                        >
                            Edit
                        </Link>
                    )}
                    {deleteRoute && (
                        <button
                            onClick={() => {
                                if (confirm('Are you sure?')) {
                                    router.delete(route(deleteRoute, row.id));
                                }
                            }}
                            className="text-red-600 hover:text-red-900 whitespace-nowrap"
                        >
                            Delete
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(row)}
                            className="text-red-600 hover:text-red-900 whitespace-nowrap"
                        >
                            Delete
                        </button>
                    )}
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            minWidth: '150px', // Minimum width for actions column
            grow: 0, // Don't grow this column
            right: true, // Align to right
        }] : [])
    ];

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-end gap-4 mb-4">
                {/* Search and Per Page controls - will grow to fill space */}
                <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4 flex-1">
                    {/* Search Input with Inline Label */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <label htmlFor="search-input" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                            Search:
                        </label>
                        <input
                            id="search-input"
                            type="text"
                            placeholder="Type to search..."
                            value={localFilters.search}
                            onChange={(e) => updateFilters({search: e.target.value})}
                            className="px-4 py-2 border rounded-lg flex-1 min-w-0"
                        />
                    </div>

                    {/* Per Page Selector with Inline Label */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <label htmlFor="per-page-select"
                               className="text-sm font-medium text-gray-700 whitespace-nowrap">
                            Show:
                        </label>
                        <select
                            id="per-page-select"
                            value={localFilters.per_page}
                            onChange={(e) => updateFilters({per_page: e.target.value})}
                            className="px-4 py-2 border rounded-lg"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                </div>

                {/* Create New Button - forced to end */}
                {createRoute && (
                    <div className="w-full sm:w-auto">
                        <Link
                            href={route(createRoute)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap w-full sm:w-auto text-center block"
                        >
                            Create New
                        </Link>
                    </div>
                )}
            </div>

            <DataTable
                columns={transformedColumns}
                data={data.data}
                defaultSortFieldId={localFilters.sort}
                defaultSortAsc={localFilters.direction === 'asc'}
                onSort={handleSort}
                noDataComponent={
                    <div className="py-4 text-center text-gray-500">
                        No records found
                    </div>
                }
                className="border rounded-lg overflow-hidden"
                pagination
                paginationServer
                paginationTotalRows={data.total}
                paginationPerPage={localFilters.per_page}
                paginationComponentOptions={{noRowsPerPage: true}}
                paginationComponent={() => (
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4 px-4">
                        <div className="text-sm text-gray-700 whitespace-nowrap">
                            Showing {data.from} to {data.to} of {data.total} entries
                        </div>
                        <div className="flex flex-wrap justify-center gap-1">
                            {data.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        if (link.url) {
                                            const page = new URL(link.url).searchParams.get('page');
                                            updateFilters({page});
                                        }
                                    }}
                                    className={`px-3 py-1 rounded text-sm ${link.active ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'} min-w-[2rem]`}
                                    dangerouslySetInnerHTML={{__html: link.label}}
                                />
                            ))}
                        </div>
                    </div>
                )}
            />
        </div>
    );
}
