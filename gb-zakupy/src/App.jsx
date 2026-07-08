import { useState } from 'react';
import PublicShoppingPage from './pages/PublicShoppingPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoadingScreen from './components/shared/LoadingScreen';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const [page, setPage] = useState('public');
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (page === 'admin') {
    return isAdmin ? (
      <AdminDashboardPage goBack={() => setPage('public')} />
    ) : (
      <AdminLoginPage goBack={() => setPage('public')} />
    );
  }

  return <PublicShoppingPage goToAdmin={() => setPage('admin')} />;
}
