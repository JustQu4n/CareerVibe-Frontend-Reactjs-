/**
 * MobileMenu Component
 * Mobile navigation panel with user info and links
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import NavLinks from './NavLinks';
import { DEFAULT_AVATAR } from '@/constants/navbar.constants';

const MobileMenu = ({ 
  isOpen, 
  user, 
  onLogout, 
  isLoggingOut,
  onNavigateToProfile,
}) => {
  if (!isOpen) return null;

  // Get user data if logged in
  const userData = user?.jobseeker || user?.employer || {};
  const avatarUrl = userData.avatar || DEFAULT_AVATAR;
  const fullName = userData.full_name || 'User';

  return (
    <div className="md:hidden bg-white border-t border-gray-100 mobile-panel">
      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* Navigation Links */}
        <ul className="flex flex-col gap-3">
          <NavLinks userRole={user?.role} />
        </ul>

        {/* Auth Buttons or User Info */}
        {!user ? (
          <div className="flex gap-2">
            <Link to="/login" className="flex-1">
              <Button variant="outline" className="w-full">
                Login
              </Button>
            </Link>
            <Link to="/register" className="flex-1">
              <Button className="w-full bg-indigo-600 text-white">
                Register
              </Button>
            </Link>
          </div>
        ) : (
          <div className="pt-2">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage 
                  src={avatarUrl} 
                  alt={`${fullName}'s profile`}
                />
              </Avatar>
              <div>
                <div className="font-semibold">{fullName}</div>
                <div className="text-xs text-muted-foreground">
                  {user.email}
                </div>
              </div>
            </div>

            {/* Mobile Menu Actions */}
            <div className="mt-3 flex flex-col gap-2">
              <Button 
                variant="link" 
                onClick={onNavigateToProfile}
              >
                Profile
              </Button>
              <Button 
                variant="link" 
                onClick={onLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    role: PropTypes.string,
    jobseeker: PropTypes.shape({
      full_name: PropTypes.string,
      avatar: PropTypes.string,
    }),
    employer: PropTypes.shape({
      full_name: PropTypes.string,
      avatar: PropTypes.string,
    }),
  }),
  onLogout: PropTypes.func.isRequired,
  isLoggingOut: PropTypes.bool,
  onNavigateToProfile: PropTypes.func.isRequired,
};

export default React.memo(MobileMenu);
