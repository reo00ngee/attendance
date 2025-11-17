import React, { Suspense, memo } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthLayout = memo(() => {
  return (
    <div>
      <Header />
      <main>
        {/* Suspenseでページの遅延読み込みをサポート */}
        <Suspense fallback={<LoadingSpinner loading={true} />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
});

export default AuthLayout;