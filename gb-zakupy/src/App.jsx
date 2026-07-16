import { useState } from 'react';
import PublicShoppingPage from './pages/PublicShoppingPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CalendarPage from './pages/CalendarPage';
import { logoutAdmin } from './firebase/auth';

export default function App() {
  const [page, setPage] = useState('public');

  const [isAdmin, setIsAdmin] = useState(
    sessionStorage.getItem('admin') === 'true'
  );

  async function handleLogout() {
    try {
      await logoutAdmin();
    } catch (error) {
      console.error(error);
    }

    sessionStorage.removeItem('admin');
    setIsAdmin(false);
    setPage('public');
  }

  // =======================
  // PANEL ADMINA
  // =======================

  if (page === 'admin') {
    return isAdmin ? (
      <AdminDashboardPage
        goBack={() => setPage('public')}
        logout={handleLogout}
      />
    ) : (
      <AdminLoginPage
        goBack={() => setPage('public')}
        onLogin={() => setIsAdmin(true)}
      />
    );
  }

  // =======================
  // KALENDARZ
  // =======================

  if (page === 'calendar') {
    return (
      <CalendarPage
        goBack={() => setPage('public')}
      />
    );
  }

  // =======================
  // STRONA GŁÓWNA
  // =======================

  return (
    <PublicShoppingPage
      goToAdmin={() => setPage('admin')}
      goToCalendar={() => setPage('calendar')}
    />
  );
}
