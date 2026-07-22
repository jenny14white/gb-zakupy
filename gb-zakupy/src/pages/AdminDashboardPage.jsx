import { useMemo, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '../firebase/firebase';

import { useAdminOrders } from '../hooks/useAdminOrders';
import { useLogs } from '../hooks/useLogs';

import { ORDER_STATUS } from '../utils/constants';

import AdminSidebar from '../components/admin/AdminSidebar';
import AdminStats from '../components/admin/AdminStats';
import AdminShoppingList from '../components/admin/AdminShoppingList';
import AdminNotifications from '../components/admin/AdminNotifications';
import AdminCompletedList from '../components/admin/AdminCompletedList';
import AdminEventLog from '../components/admin/AdminEventLog';

import '../styles/admin-dashboard.css';

export default function AdminDashboardPage({
  goBack,
  logout,
  goToEvents,
}) {
  const [activeTab, setActiveTab] = useState('lista');
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (
        user &&
        user.email === 'belacount4@gmail.com'
      ) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }

      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  const { orders, loading } = useAdminOrders();
  const logs = useLogs();

  const pendingOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.status === ORDER_STATUS.PENDING ||
          o.status === ORDER_STATUS.ACCEPTED ||
          o.status === ORDER_STATUS.ORDERED
      ),
    [orders]
  );

  const completedOrders = useMemo(
    () =>
      orders.filter(
        (o) => o.status === ORDER_STATUS.COMPLETED
      ),
    [orders]
  );

  const pendingCount = useMemo(
    () =>
      orders.filter(
        (o) => o.status === ORDER_STATUS.PENDING
      ).length,
    [orders]
  );

  const acceptedCount = useMemo(
    () =>
      orders.filter(
        (o) => o.status === ORDER_STATUS.ACCEPTED
      ).length,
    [orders]
  );

  const orderedCount = useMemo(
    () =>
      orders.filter(
        (o) => o.status === ORDER_STATUS.ORDERED
      ).length,
    [orders]
  );

  const completedCount = useMemo(
    () =>
      orders.filter(
        (o) => o.status === ORDER_STATUS.COMPLETED
      ).length,
    [orders]
  );

  const unreadNotifications = useMemo(() => {
    return pendingOrders.filter(
      (order) => !order.notificationRead
    );
  }, [pendingOrders]);

  if (checking) {
    return (
      <main className="admin-page">
        <section className="dashboard">
          Sprawdzanie uprawnień...
        </section>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="admin-page login-view">
        <section className="login-card">
          <h1>Brak dostępu</h1>

          <p>
            Konto administratora jest wymagane.
          </p>

          <button
            className="admin-button"
            onClick={goBack}
          >
            Wróć
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingOrders.length}
        orderedCount={completedOrders.length}
        unreadNotificationsCount={
          unreadNotifications.length
        }
        goBack={goBack}
        logout={logout}
        goToEvents={goToEvents}
      />

      <section className="dashboard">
        <p className="dashboard-eyebrow">
          GB Zakupy
        </p>

        <h1>Dashboard</h1>

        <AdminStats
          allCount={orders.length}
          pendingCount={pendingCount}
          acceptedCount={acceptedCount}
          orderedCount={orderedCount}
          completedCount={completedCount}
        />

        {loading && (
          <div className="empty-admin-box">
            Ładowanie danych...
          </div>
        )}

        {!loading && activeTab === 'lista' && (
          <AdminShoppingList
            orders={pendingOrders}
          />
        )}

        {!loading &&
          activeTab === 'powiadomienia' && (
            <AdminNotifications
              orders={pendingOrders}
            />
          )}

        {!loading &&
          activeTab === 'zrealizowane' && (
            <AdminCompletedList
              orders={completedOrders}
            />
          )}

        {!loading &&
          activeTab === 'dziennik' && (
            <AdminEventLog logs={logs} />
          )}
      </section>
    </main>
  );
}
