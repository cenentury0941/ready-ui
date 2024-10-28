import React from 'react';
import OrderTable from './OrderTable';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>
      <p>Welcome to the admin dashboard.</p>
      <OrderTable />
    </div>
  );
};

export default Dashboard;
