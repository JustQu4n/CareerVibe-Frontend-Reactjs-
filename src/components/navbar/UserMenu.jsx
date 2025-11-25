/**
 * UserMenu Component — animated dropdown (Framer Motion)
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Mail } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { USER_MENU_ITEMS, DEFAULT_AVATAR, ROLE_DISPLAY } from '@/constants/navbar.constants';

const UserMenu = ({ user, onLogout, isLoggingOut }) => {
  if (!user) return null;

  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  // Determine user role and menu items
  const isRecruiter = user.role === 'employer' || user.role === 'Recruiter';
  const menuItems = isRecruiter ? USER_MENU_ITEMS.RECRUITER : USER_MENU_ITEMS.JOBSEEKER;

  // Get user data - support both old and new structure
  const userData = user.jobseeker || user.employer || user;
  const avatarUrl = userData?.avatar || userData?.avatar_url || user?.avatar_url || DEFAULT_AVATAR;
  const fullName = userData?.full_name || user?.fullname || user?.full_name || 'User';
  const roleDisplay = ROLE_DISPLAY[user?.role] || user?.role || '';

  const handleNavigate = (to) => {
    setShowMenu(false);
    navigate(to);
  };

  const handleToggle = () => setShowMenu((s) => !s);

  return (
    <div className="relative">
      <button onClick={handleToggle} className="flex items-center gap-3 focus:outline-none">
        <Avatar className="cursor-pointer">
          <AvatarImage className="object-cover" src={avatarUrl} alt={`${fullName}'s profile`} />
        </Avatar>
        <div className="hidden sm:flex flex-col text-left">
          <span className="font-semibold text-sm">{fullName}</span>
          <span className="text-xs text-muted-foreground">{roleDisplay}</span>
        </div>
      </button>

      <AnimatePresence>
        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.14 }}
              className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-20"
            >
              <div className="p-4 border-b border-gray-200">
                <p className="font-semibold text-gray-900">{fullName || 'User'}</p>
                <p className="text-sm text-gray-500 truncate">{user?.email || ''}</p>
              </div>

              <div className="p-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.to)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      {Icon && <Icon className="h-4 w-4 text-gray-600" />}
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </button>
                  );
                })}

                <button
                  onClick={() => handleNavigate('/admin/settings')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Settings className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Settings</span>
                </button>

                <button
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Mail className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Messages</span>
                </button>
              </div>

              <div className="p-2 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-left text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

UserMenu.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func.isRequired,
  isLoggingOut: PropTypes.bool,
};

export default UserMenu;
