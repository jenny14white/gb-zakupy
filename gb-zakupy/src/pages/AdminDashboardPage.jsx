import { useMemo, useState } from 'react';
import { logoutAdmin } from '../firebase/auth';
import { useAdminOrders } from '../hooks/useAdminOrders';
import { useLogs } from '../hooks/useLogs';
import { getOrderedOrders, getPendingOrders } from '../utils/orderUtils';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminStats from '../components/admin/AdminStats';
import AdminShoppingList from '../components/admin/AdminShoppingList';
import AdminNotifications from '../components/admin/AdminNotifications';
import AdminCompletedList from '../components/admin/AdminCompletedList';
import AdminEventLog from '../components/admin/AdminEventLog';

export default function AdminDashboardPage({ goBack }) {
  const [activeTab, setActiveTab] = useState('lista');
  const { orders, loading } = useAdminOrders();
  const logs = useLogs();

  const pendingOrders = useMemo(() => getPendingOrders(orders), [orders]);
  const orderedOrders = useMemo(() => getOrderedOrders(orders), [orders]);

  const unreadNotifications = useMemo(() => {
    return pendingOrders.filter((order) => !order.notificationRead);
  }, [pendingOrders]);

  async function handleLogout() {
    await logoutAdmin();
    goBack();
  }

  return (
    <main className="admin-page">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingOrders.length}
        orderedCount={orderedOrders.length}
        unreadNotificationsCount={unreadNotifications.length}
        goBack={goBack}
        logout={handleLogout}
      />

      <section className="dashboard">
        <p className="dashboard-eyebrow">GB Zakupy</p>
        <h1>Dashboard</h1>

        <AdminStats
          allCount={orders.length}
          pendingCount={pendingOrders.length}
          orderedCount={orderedOrders.length}
        />

        {loading && <div className="empty-admin-box">Ładowanie danych...</div>}

        {!loading && activeTab === 'lista' && (
          <AdminShoppingList orders={pendingOrders} />
        )}

        {!loading && activeTab === 'powiadomienia' && (
          <AdminNotifications orders={pendingOrders} />
        )}

        {!loading && activeTab === 'zrealizowane' && (
          <AdminCompletedList orders={orderedOrders} />
        )}

        {!loading && activeTab === 'dziennik' && <AdminEventLog logs={logs} />}
      </section>
    </main>
  );
}
