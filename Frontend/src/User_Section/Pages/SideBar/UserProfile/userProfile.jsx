import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function UserProfile({ isCollapsed }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        // Add logout logic here
        console.log('Logging out...');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 w-full border-t border-gray-200 hover:bg-gray-50 transition-colors duration-200
                    ${isCollapsed ? 'flex justify-center' : 'flex items-center space-x-3'}`}
            >
                <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User avatar"
                    className="w-8 h-8 rounded-full"
                />
                {!isCollapsed && (
                    <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-700">John Doe</p>
                        <p className="text-xs text-gray-500">john@example.com</p>
                    </div>
                )}
            </button>

            {isOpen && (
                <div
                    className={`absolute bottom-full ${isCollapsed ? 'left-16' : 'left-0 right-0'} mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50`}
                >
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            navigate('/dashboard/profile');
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                        <User size={16} />
                        <span>Profile</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center space-x-2"
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default UserProfile;
