import React from 'react';
import EmployerProfileView from '../components/profile/EmployerProfileView';

export default function EmployerProfilePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Employer Profile</h1>
      <EmployerProfileView />
    </div>
  );
}
