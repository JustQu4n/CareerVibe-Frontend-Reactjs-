/**
 * Navbar Component (Refactored)
 * Main navigation bar with user menu, notifications, and responsive design
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/components_lite/ThemeToggle';
import useNavbar from '@/hooks/useNavbar';
import NavLinks from './NavLinks';
import NotificationBell from './NotificationBell';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  // Redux state
  const { user } = useSelector((store) => store.auth);

  // Custom hook for navbar logic
  const {
    mobileOpen,
    isLoggingOut,
    toggleMobileMenu,
    handleLogout,
    handleNavigateToProfile,
  } = useNavbar();

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              aria-label="CareerVibe home" 
              className="flex items-center"
            >
              <img
                src="/vite.svg"
                alt="CareerVibe"
                className="h-8 w-auto sm:h-10"
              />
              <span className="ml-2 hidden md:inline text-lg font-semibold text-gray-800">
                CareerVibe
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-8">
            <ul className="flex items-center gap-8">
              <NavLinks userRole={user?.role} />
            </ul>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Guest Actions */}
            {!user ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" className="text-sm">
                    <span className="font-semibold">Login</span>
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transform hover:-translate-y-0.5 transition-transform">
                    <span className="font-semibold">Register</span>
                  </Button>
                </Link>
              </div>
            ) : (
              /* Authenticated User Actions */
              <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <ThemeToggle className="hidden sm:inline-flex" />

                {/* Notifications */}
                <NotificationBell />

                {/* User Menu */}
                <UserMenu 
                  user={user} 
                  onLogout={handleLogout}
                  isLoggingOut={isLoggingOut}
                />
              </div>
            )}

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden">
              <button
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                onClick={toggleMobileMenu}
                className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {mobileOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <MobileMenu
        isOpen={mobileOpen}
        user={user}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
        onNavigateToProfile={handleNavigateToProfile}
      />
    </header>
  );
};

export default Navbar;
