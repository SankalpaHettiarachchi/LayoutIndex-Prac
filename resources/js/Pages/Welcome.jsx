import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                <img
                    id="background"
                    className="absolute -left-20 top-0 max-w-[877px]"
                    src="https://laravel.com/assets/img/welcome/background.svg"
                    onError={handleImageError}
                />
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
                            <div className="flex lg:col-start-2 lg:justify-center">
                                {/* Restaurant Logo/Name */}
                                <h1 className="text-4xl font-bold text-[#FF2D20]">ABC RESTAURANT</h1>
                            </div>
                            <nav className="-mx-3 flex flex-1 justify-end">
                                {auth.user ? (
                                    <div className="flex flex-col items-end space-y-2">
                                        <Link
                                            href={route('concessions.index')}
                                            className="group flex items-center rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Staff Portal
                                            <svg
                                                className="ml-1 h-4 w-4 shrink-0 stroke-[#FF2D20] transition-transform group-hover:translate-x-1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                                                />
                                            </svg>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-end space-y-2">
                                        <Link
                                            href={route('login')}
                                            className="group flex items-center rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Log in
                                            <svg
                                                className="ml-1 h-4 w-4 shrink-0 stroke-[#FF2D20] transition-transform group-hover:translate-x-1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                                                />
                                            </svg>
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="group flex items-center rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Register
                                            <svg
                                                className="ml-1 h-4 w-4 shrink-0 stroke-[#FF2D20] transition-transform group-hover:translate-x-1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                                                />
                                            </svg>
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </header>

                        <main className="mt-6">
                            <div className="flex flex-col items-center justify-center py-20">
                                <h2 className="text-5xl font-bold text-center text-gray-800 dark:text-white mb-6">
                                    Welcome to ABC
                                </h2>
                                <p className="text-xl text-center text-gray-600 dark:text-gray-300 max-w-2xl">
                                    Experience the finest cuisine in town with our exquisite menu and exceptional
                                    service
                                </p>
                            </div>
                        </main>

                        <footer className="py-16 text-center text-sm text-black dark:text-white/70">
                            © {new Date().getFullYear()} ABC Restaurant. All rights reserved.(Education Purpose Only)
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
