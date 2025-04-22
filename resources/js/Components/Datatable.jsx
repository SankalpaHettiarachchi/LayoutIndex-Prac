import DataTable from 'react-data-table-component';
import { router, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function CommonDataTable({
    data,
    columns,
    routeName,
    statusFilter,
    filters = {},
    createRoute = null
}) {
    const [localFilters, setLocalFilters] = useState({
        search: filters.search || '',
        per_page: filters.per_page || 5,
        sort: filters.sort || columns[0].field,
        direction: filters.direction || 'asc',
        preserveScroll: true,
        status: filters.status || '' // Add status filter
    });

    const updateFilters = (newFilters) => {
        setLocalFilters(prev => {
            const updatedFilters = { ...prev, ...newFilters };

            // Combine search and status for the actual filter
            const filterParams = {
                ...updatedFilters,
                search: updatedFilters.status ? `${updatedFilters.search} ${updatedFilters.status}` : updatedFilters.search
            };

            router.get(route(routeName),
                filterParams,
                { preserveState: true, replace: true, preserveScroll: true }
            );

            return updatedFilters;
        });
    };

    const handleSort = (column, sortDirection) => {
        updateFilters({
            sort: column.selector || column.field,
            direction: sortDirection,
            preserveScroll: true
        });
    };

    // Transform columns for react-data-table-component
    const transformedColumns = columns.map(column => ({
        name: <div className={column.className || ''}>{column.header}</div>,
        selector: row => column.field ? row[column.field] : null,
        sortable: column.sortable || false,
        cell: row => (
            <div className={column.className || ''}>
                {column.render ? column.render(row) : (column.field ? row[column.field] : null)}
            </div>
        ),
        grow: column.grow || 1,
        style: column.width ? { width: column.width, maxWidth: column.width } : {},
        wrap: true
    }));

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-end gap-4 mb-4">
                <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4 flex-1">
                    {/* Search Input */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <label htmlFor="search-input" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                            Search:
                        </label>
                        <input
                            id="search-input"
                            type="text"
                            placeholder="Type to search..."
                            value={localFilters.search.replace(/ status:\w+$/, '')} // Remove status part from display
                            onChange={(e) => updateFilters({
                                search: e.target.value,
                                status: localFilters.status // Maintain current status
                            })}
                            className="px-4 py-2 border rounded-lg flex-1 min-w-0"
                        />
                    </div>

                    {statusFilter && (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <label htmlFor="status-select"
                                   className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                Status:
                            </label>
                            <select
                                id="status-select"
                                value={localFilters.status}
                                onChange={(e) => updateFilters({
                                    status: e.target.value,
                                    search: localFilters.search.replace(/ status:\w+$/, '') // Maintain search without old status
                                })}
                                className="px-4 py-2 border rounded-lg w-36"
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    )}


                    {/* Per Page Selector */}
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
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                </div>

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

            {/* DataTable remains the same */}
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
