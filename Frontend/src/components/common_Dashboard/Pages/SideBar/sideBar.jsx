import { useState } from 'react';
import { Home, BarChart2, Users, Settings, HelpCircle, Menu, X, ChevronRight, ChevronLeft } from 'lucide-react';
import Navbar from './Navbar/navbar';
import UserProfile from './UserProfile/userProfile';
import { Link } from 'react-router-dom';
import getToken from '../../../../hooks/role.js';


const navigation = [
    { name: 'Dashboard', icon: Home, href: '/dashboard' },
    { name: 'Current Interview', icon: BarChart2, href: '/dashboard/current_interview' },
    { name: 'All Interviews', icon: Users, href: '/dashboard/all-interview' },
    { name: 'All Meetings', icon: Settings, href: '/dashboard/meetings' },
    { name: 'Billing', icon: HelpCircle, href: '/dashboard/billings' },
];

const tokenData = getToken();

const usernavigation = [
    { name: 'Dashboard', icon: Home, href: '/user/dashboard' },
    {name: 'All Interviews', icon: Users, href: '/user/dashboard/all-interview'},
    { name: 'Billing', icon: HelpCircle, href: '/user/dashboard/billings' },
]

function Sidebar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);
    
    return (
        <>
            
            <button onClick={toggleMobileSidebar} className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700" aria-label="Toggle Menu">
                {isMobileOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>

           
            {isMobileOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={toggleMobileSidebar}/>)}

           
            <aside className={`fixed top-0 left-0 z-40 h-full bg-white border-r border-gray-200 
                transition-all duration-300 ease-in-out
                ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} 
                lg:translate-x-0 ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}`}>
                <div className="flex flex-col h-full">
                    
                    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                        {(!isCollapsed || isMobileOpen) && (<Link to='/'><h1 className="text-xl font-bold text-gray-800">CodeFusion</h1></Link>)}
                        <button onClick={toggleCollapse} className="p-1.5 rounded-lg hover:bg-gray-100 focus:outline-none hidden lg:block" aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}>
                            {isCollapsed ? (<ChevronRight className="w-5 h-5 text-gray-500"/>) : (<ChevronLeft className="w-5 h-5 text-gray-500"/>)}
                        </button>
                    </div>
                    <nav className="flex-1 p-4 space-y-1">
                        {tokenData.role === 'CANDIDATE' ? usernavigation.map((item) => (
                            <Navbar key={item.name} name={item.name} href={item.href} icon={item.icon} isCollapsed={isCollapsed && !isMobileOpen}/>
                        ))
                        :
                        navigation.map((item) => (
                            <Navbar key={item.name} name={item.name} href={item.href} icon={item.icon} isCollapsed={isCollapsed && !isMobileOpen}/>
                        ))}
                    </nav>
                    <UserProfile isCollapsed={isCollapsed && !isMobileOpen}/>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
