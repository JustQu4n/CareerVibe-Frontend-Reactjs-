/**
 * NavLinks Component
 * Displays navigation links based on user role
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ChevronDown, Search, Sparkles } from 'lucide-react';
import { NAVIGATION_LINKS } from '@/constants/navbar.constants';

/**
 * Single navigation link component
 */
const NavLink = React.memo(({ to, children }) => (
  <Link to={to} className="nav-link text-sm md:text-base px-1 py-1">
    {children}
  </Link>
));

NavLink.displayName = 'NavLink';

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

/**
 * Dropdown menu item
 */
const DropdownLink = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Icon mapping for submenu items
  const getIcon = (label) => {
    switch (label) {
      case 'Browse':
        return <Search className="w-4 h-4" />;
      case 'Recommendations':
        return <Sparkles className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="nav-link text-sm md:text-base px-1 py-1 flex items-center gap-1"
      >
        {item.label}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
          {item.submenu.map((subItem) => (
            <Link
              key={subItem.to}
              to={subItem.to}
              className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
            >
              {getIcon(subItem.label)}
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

DropdownLink.propTypes = {
  item: PropTypes.shape({
    label: PropTypes.string.isRequired,
    submenu: PropTypes.arrayOf(
      PropTypes.shape({
        to: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

/**
 * NavLinks component - Renders list of navigation links
 */
const NavLinks = ({ userRole }) => {
  // Determine which links to show based on user role
  const isRecruiter = userRole === 'employer' || userRole === 'Recruiter';
  const links = isRecruiter ? NAVIGATION_LINKS.RECRUITER : NAVIGATION_LINKS.JOBSEEKER;

  return (
    <>
      {links.map((link, index) => (
        <li key={link.to || link.label + index}>
          {link.submenu ? (
            <DropdownLink item={link} />
          ) : (
            <NavLink to={link.to}>{link.label}</NavLink>
          )}
        </li>
      ))}
    </>
  );
};

NavLinks.propTypes = {
  userRole: PropTypes.string,
};

export default React.memo(NavLinks);
