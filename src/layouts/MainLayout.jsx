/**
 * MainLayout Component
 * Main application layout with sticky navbar and footer
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/components_lite/Footer';

const MainLayout = ({ children, showFooter = true }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
  showFooter: PropTypes.bool,
};

export default MainLayout;
