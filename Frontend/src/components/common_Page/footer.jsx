function Footer() {
    return (
        <footer className="bg-blue-900 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-between">
                    <div className="mb-8 md:mb-0">
                        <h2 className="text-2xl font-semibold mb-4">
                            Need help with anything?
                        </h2>
                        <div className="flex space-x-4">
                            <a href="#" className="bg-white text-blue-900 p-2 rounded-full hover:opacity-75">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 4.5c-.9.4-1.8.7-2.8.9a5 5 0 0 0 2.2-2.7c-1 .6-2 .9-3.1 1.1a5 5 0 0 0-8.6 4.6A14 14 0 0 1 1.7 3.1a5 5 0 0 0 1.5 6.6 5 5 0 0 1-2.2-.6v.1a5 5 0 0 0 4 4.9 5 5 0 0 1-2.2.1 5 5 0 0 0 4.7 3.5A10 10 0 0 1 0 20.5a14 14 0 0 0 7.5 2.2c9 0 14-7.5 14-14 0-.2 0-.4 0-.6A10 10 0 0 0 24 4.5z" />
                                </svg>
                            </a>
                            <a href="#" className="bg-white text-blue-900 p-2 rounded-full hover:opacity-75">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M16 8a6 6 0 0 0-6 6c0 3.4 2.6 6 6 6s6-2.6 6-6a6 6 0 0 0-6-6zM4 9v13h6V9H4zm3 2.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM20 6h-6v2h6V6z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full md:w-auto">
                        <div>
                            <h3 className="font-semibold mb-2">Home</h3>
                            <ul>
                                <li><a href="#" className="text-gray-300 hover:text-white">What is it</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white">How it works</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white">Why it’s important</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Company</h3>
                            <ul>
                                <li><a href="#" className="text-gray-300 hover:text-white">About</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white">Blog</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Legal</h3>
                            <ul>
                                <li><a href="#" className="text-gray-300 hover:text-white">Terms & Conditions</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white">Privacy & Policy</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Help</h3>
                            <ul>
                                <li><a href="#" className="text-gray-300 hover:text-white">FAQs</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start">
                        <span className="text-xl font-semibold">Code Fusion</span>
                    </div>
                    <div>
                        <p className="text-gray-300 font-bold mt-4">© 2024 Code Fusion. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
