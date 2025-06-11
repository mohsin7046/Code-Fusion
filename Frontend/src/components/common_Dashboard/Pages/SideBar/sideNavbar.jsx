const Navbar = () => {
    return (
        <nav className="bg-white shadow-md px-4 py-3 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="relative w-full max-w-xs">
                    <input
                        type="text"
                        className="bg-gray-100 text-gray-600 rounded-full pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Search"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg
                            className="w-5 h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10.5 3a7.5 7.5 0 105.625 12.374l4.968 4.968a1 1 0 001.414-1.414l-4.968-4.968A7.5 7.5 0 0010.5 3zM5 10.5a5.5 5.5 0 1111 0 5.5 5.5 0 01-11 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </span>
                </div>

                <button className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-gray-200">
                    <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 2.25v1.5m7.5-1.5v1.5m-10.5 3h13.5m-14.25 0A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25V8.25a2.25 2.25 0 00-2.25-2.25m-13.5 0V3.75m13.5 1.5V3.75"
                        />
                    </svg>
                </button>
            </div>

            <div className="flex items-center gap-4">
                <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full">
                    <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341A6.002 6.002 0 006 11v3.159c0 .417-.166.818-.447 1.111L4.25 17h5m6 0a3 3 0 11-6 0m6 0H9"
                        />
                    </svg>
                </button>

                <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="User Profile"
                    className="w-8 h-8 rounded-full object-cover"
                />

                <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full">
                    <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 12a.75.75 0 110-1.5.75.75 0 010 1.5zm5.25 0a.75.75 0 110-1.5.75.75 0 010 1.5zm5.25 0a.75.75 0 110-1.5.75.75 0 010 1.5z"
                        />
                    </svg>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
