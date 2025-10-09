import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';

const AdminLayout = memo(() => {
  return (
    <div>
      <AdminHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
});

export default AdminLayout;

