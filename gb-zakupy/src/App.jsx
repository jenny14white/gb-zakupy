import { useState } from 'react';

import PublicShoppingPage from './pages/PublicShoppingPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CalendarPage from './pages/CalendarPage';
import AdminEventsPage from './pages/AdminEventsPage';

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

  function handleLogin() {
    sessionStorage.setItem('admin', 'true');
    setIsAdmin(true);
  }

  switch (page) {
    case 'admin':
      return isAdmin ? (
        <AdminDashboardPage
          goBack={() => setPage('public')}
          logout={handleLogout}
          goToEvents={() => setPage('admin-events')}
        />
      ) : (
        <AdminLoginPage
          goBack={() => setPage('public')}
          onLogin={handleLogin}
        />
      );

    case 'admin-events':
      return isAdmin ? (
        <AdminEventsPage
          goBack={() => setPage('admin')}
        />
      ) : (
        <AdminLoginPage
          goBack={() => setPage('public')}
          onLogin={() => {
            handleLogin();
            setPage('admin-events');
          }}
        />
      );

    case 'calendar':
      return (
        <CalendarPage
          goBack={() => setPage('public')}
        />
      );

    default:
      return (
        <PublicShoppingPage
          goToAdmin={() => setPage('admin')}
          goToCalendar={() => setPage('calendar')}
        />
      );
  }
}
