/**
 * AuthLayout Component
 * Simple layout for authentication pages (login, register)
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Navbar } from '@/components/navbar';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthLayout;
