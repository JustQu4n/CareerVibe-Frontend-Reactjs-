/**
 * UserMenu Component
 * Displays user avatar and dropdown menu with profile options
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { USER_MENU_ITEMS, DEFAULT_AVATAR, ROLE_DISPLAY } from '@/constants/navbar.constants';

const UserMenu = ({ user, onLogout, isLoggingOut }) => {
  if (!user) return null;

  // Determine user role and menu items
  const isRecruiter = user.role === 'employer' || user.role === 'Recruiter';
  const menuItems = isRecruiter ? USER_MENU_ITEMS.RECRUITER : USER_MENU_ITEMS.JOBSEEKER;

  // Get user data - support both old and new structure
  const userData = user.jobseeker || user.employer || user;
  const avatarUrl = userData.avatar || userData.avatar_url || user.avatar_url || DEFAULT_AVATAR;
  console.log('Avatar URL:', avatarUrl);
  const fullName = userData.full_name || user.fullname || user.full_name || 'User';
  const roleDisplay = ROLE_DISPLAY[user.role] || user.role;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-3 focus:outline-none">
          <Avatar className="cursor-pointer">
            <AvatarImage
              className="object-cover"
              src={avatarUrl}
              alt={`${fullName}'s profile`}
            />
          </Avatar>
          <div className="hidden sm:flex flex-col text-left">
            <span className="font-semibold text-sm">{fullName}</span>
            <span className="text-xs text-muted-foreground">{roleDisplay}</span>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        {/* User Info Header */}
        <div className="flex items-center gap-4 space-y-2">
          <Avatar className="cursor-pointer">
            <AvatarImage
              className="object-cover"
              src={avatarUrl}
              alt={`${fullName}'s profile`}
            />
          </Avatar>
          <div>
            <h3 className="font-medium">{fullName}</h3>
            <p className="text-sm text-muted-foreground max-w-[200px] truncate">
              {user.email}
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col my-2 text-gray-600">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex w-fit items-center gap-2 cursor-pointer"
              >
                <Icon size={28} strokeWidth={1.75} />
                <Button variant="link">
                  <Link to={item.to}>{item.label}</Link>
                </Button>
              </div>
            );
          })}

          {/* Logout */}
          <div className="flex w-fit items-center gap-2 cursor-pointer">
            <LogOut size={28} strokeWidth={1.75} />
            <Button
              onClick={onLogout}
              variant="link"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

UserMenu.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    role: PropTypes.string,
    fullname: PropTypes.string,
    full_name: PropTypes.string,
    avatar_url: PropTypes.string,
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
};

export default React.memo(UserMenu);
