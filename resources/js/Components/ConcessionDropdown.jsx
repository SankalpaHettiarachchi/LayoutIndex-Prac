// resources/js/Components/ConcessionDropdown.jsx
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function ConcessionDropdown({ onSelect }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [concessions, setConcessions] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef(null);
    const loaderRef = useRef(null);

    // Load initial concessions
    useEffect(() => {
        if (isOpen) {
            loadConcessions();
        }
    }, [isOpen]);

    // Load more concessions when scrolling
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMoreConcessions();
                }
            },
            { threshold: 0.1 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, searchTerm, isLoading]);

    const loadConcessions = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(route('orders.load-concessions'), {
                params: {
                    search: searchTerm,
                    per_page: 5
                }
            });
            setConcessions(response.data.data);
            setPage(1);
            setHasMore(response.data.next_page_url !== null);
        } catch (error) {
            console.error('Error loading concessions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadMoreConcessions = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(route('orders.load-concessions'), {
                params: {
                    search: searchTerm,
                    page: page + 1,
                    per_page: 5
                }
            });
            setConcessions(prev => [...prev, ...response.data.data]);
            setPage(prev => prev + 1);
            setHasMore(response.data.next_page_url !== null);
        } catch (error) {
            console.error('Error loading more concessions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className="flex items-center border border-gray-300 rounded-md shadow-sm cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <input
                    type="text"
                    placeholder="Search concessions..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    className="flex-1 px-4 py-2 border-none focus:ring-0"
                    onFocus={() => setIsOpen(true)}
                />
                <div className="px-2">
                    <svg
                        className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-auto">
                    {isLoading && concessions.length === 0 ? (
                        <div className="p-3 text-center text-gray-500">Loading...</div>
                    ) : concessions.length > 0 ? (
                        <>
                            {concessions.map((concession) => (
                                <div
                                    key={concession.id}
                                    className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => {
                                        onSelect(concession);
                                        setIsOpen(false);
                                    }}
                                >
                                    <div className="flex items-center">
                                        {concession.image_path && (
                                            <img
                                                src={`/storage/${concession.image_path}`}
                                                alt={concession.name}
                                                className="w-10 h-10 rounded-full object-cover mr-3"
                                            />
                                        )}
                                        <div>
                                            <div className="font-medium">{concession.name}</div>
                                            <div className="text-sm text-gray-500">LKR {concession.price}</div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="px-2 py-1 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700"
                                    >
                                        Add
                                    </button>
                                </div>
                            ))}
                            <div ref={loaderRef} className="p-3 text-center text-gray-500">
                                {isLoading ? 'Loading more...' : hasMore ? 'Scroll to load more' : 'No more concessions'}
                            </div>
                        </>
                    ) : (
                        <div className="p-3 text-center text-gray-500">
                            {searchTerm ? 'No concessions found' : 'Start typing to search concessions'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
