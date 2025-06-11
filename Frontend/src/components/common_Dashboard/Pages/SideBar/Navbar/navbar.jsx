/* eslint-disable react/prop-types */
import { NavLink } from 'react-router-dom';

function NavItem({ name, href, icon: Icon, isCollapsed }) {
  return (
    <NavLink 
      to={href} 
      className={({ isActive }) => 
        `relative flex items-center px-4 py-2 rounded-md transition-all duration-200 group
        ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
    >
      <Icon className={`w-5 h-5 ${!isCollapsed && 'mr-3'}`} />
      {isCollapsed ? (
        <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 z-50">
          {name}
        </span>
      ) : (
        <span>{name}</span>
      )}
    </NavLink>
  );
}

export default NavItem;
