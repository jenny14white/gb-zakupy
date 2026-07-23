import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/firebase";

import { useAdminOrders } from "../hooks/useAdminOrders";
import { useLogs } from "../hooks/useLogs";

import { ORDER_STATUS } from "../utils/constants";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminStats from "../components/admin/AdminStats";
import AdminShoppingList from "../components/admin/AdminShoppingList";
import AdminNotifications from "../components/admin/AdminNotifications";
import AdminCompletedList from "../components/admin/AdminCompletedList";
import AdminEventLog from "../components/admin/AdminEventLog";

import "../styles/admin-dashboard.css";

export default function AdminDashboardPage({
    goBack,
    logout,
    goToEvents,
}) {
    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState("lista");
    const [authorized, setAuthorized] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && user.email === "belacount4@gmail.com") {
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
                    o.status === ORDER_STATUS.ACCEPTED
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
                    {t("admin.dashboard.checkingPermissions")}
                </section>
            </main>
        );
    }

    if (!authorized) {
        return (
            <main className="admin-page login-view">
                <section className="login-card">
                    <h1>
                        {t("admin.dashboard.accessDenied.title")}
                    </h1>

                    <p>
                        {t("admin.dashboard.accessDenied.description")}
                    </p>

                    <button
                        className="admin-button"
                        onClick={goBack}
                    >
                        {t("shopping.page.back")}
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
                pendingCount={pendingCount}
                acceptedCount={acceptedCount}
                completedCount={completedCount}
                unreadNotificationsCount={unreadNotifications.length}
                goBack={goBack}
                logout={logout}
                goToEvents={goToEvents}
            />

            <section className="dashboard">
                <p className="dashboard-eyebrow">
                    GB Zakupy
                </p>

                <h1>
                    {t("admin.dashboard.title")}
                </h1>

                <AdminStats
                    allCount={orders.length}
                    pendingCount={pendingCount}
                    acceptedCount={acceptedCount}
                    completedCount={completedCount}
                />

                {loading && (
                    <div className="empty-admin-box">
                        {t("admin.dashboard.loading")}
                    </div>
                )}

                {!loading && activeTab === "lista" && (
                    <AdminShoppingList
                        orders={pendingOrders}
                    />
                )}

                {!loading &&
                    activeTab === "powiadomienia" && (
                        <AdminNotifications
                            orders={pendingOrders}
                        />
                    )}

                {!loading &&
                    activeTab === "zrealizowane" && (
                        <AdminCompletedList
                            orders={completedOrders}
                        />
                    )}

                {!loading &&
                    activeTab === "dziennik" && (
                        <AdminEventLog
                            logs={logs}
                        />
                    )}
            </section>
        </main>
    );
}
