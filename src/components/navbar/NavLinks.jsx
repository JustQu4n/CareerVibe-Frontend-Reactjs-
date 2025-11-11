/**
 * NavLinks Component
 * Displays navigation links based on user role
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
 * NavLinks component - Renders list of navigation links
 */
const NavLinks = ({ userRole }) => {
  // Determine which links to show based on user role
  const isRecruiter = userRole === 'employer' || userRole === 'Recruiter';
  const links = isRecruiter ? NAVIGATION_LINKS.RECRUITER : NAVIGATION_LINKS.JOBSEEKER;

  return (
    <>
      {links.map((link) => (
        <li key={link.to}>
          <NavLink to={link.to}>{link.label}</NavLink>
        </li>
      ))}
    </>
  );
};

NavLinks.propTypes = {
  userRole: PropTypes.string,
};

export default React.memo(NavLinks);
