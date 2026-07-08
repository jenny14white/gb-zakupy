import { useState } from 'react';
import PublicShoppingPage from './pages/PublicShoppingPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  const [page, setPage] = useState('public');

  const [isAdmin, setIsAdmin] = useState(
    sessionStorage.getItem('admin') === 'true'
  );

  if (page === 'admin') {
    return isAdmin ? (
      <AdminDashboardPage
        goBack={() => setPage('public')}
        logout={() => {
          sessionStorage.removeItem('admin');
          setIsAdmin(false);
          setPage('public');
        }}
      />
    ) : (
      <AdminLoginPage
        goBack={() => setPage('public')}
        onLogin={() => setIsAdmin(true)}
      />
    );
  }

  return <PublicShoppingPage goToAdmin={() => setPage('admin')} />;
}
