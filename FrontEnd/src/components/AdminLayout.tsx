import React, { memo, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import { UseAuthAdmin } from '../hooks/useAdminAuth';

const AdminLayout = memo(() => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        await UseAuthAdmin();
      } catch (error) {
        console.error('Admin authentication failed:', error);
        localStorage.removeItem('admin');
        navigate('/admin/login');
      }
    };

    checkAdminAuth();
  }, [navigate]);

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

