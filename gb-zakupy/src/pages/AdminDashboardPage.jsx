import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/firebase";

import { useAdminOrders } from "../hooks/useAdminOrders";
import { useLogs } from "../hooks/useLogs";
import { useEvents } from "../hooks/useEvents";

import { ORDER_STATUS } from "../utils/constants";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminStats from "../components/admin/AdminStats";
import AdminShoppingList from "../components/admin/AdminShoppingList";
import AdminNotifications from "../components/admin/AdminNotifications";
import AdminCompletedList from "../components/admin/AdminCompletedList";
import AdminEventLog from "../components/admin/AdminEventLog";
import AdminCalendar from "../components/admin/AdminCalendar";

import "../styles/admin-dashboard.css";

const ADMIN_UID = "kRulgEcxNed8aYacTWq3j9GgP4J2";

export default function AdminDashboardPage({
    goBack,
    logout,
    goToEvents,
}) {

    const { t } = useTranslation();

    const [activeTab,setActiveTab] = useState("lista");
    const [authorized,setAuthorized] = useState(false);
    const [checking,setChecking] = useState(true);

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(
            auth,
            user => {

                setAuthorized(
                    Boolean(
                        user &&
                        user.uid === ADMIN_UID
                    )
                );

                setChecking(false);
            }
        );

        return unsubscribe;

    },[]);


    const { orders, loading } =
        useAdminOrders(authorized);

    const logs =
        useLogs(authorized);

    const {
        events,
        loading:eventsLoading,
    } = useEvents(authorized);


    const {
        pendingOrders,
        completedOrders,
        pendingCount,
        acceptedCount,
        unreadNotifications,
    } = useMemo(() => {

        const active =
            orders.filter(order =>
                order.status === ORDER_STATUS.PENDING ||
                order.status === ORDER_STATUS.ACCEPTED
            );

        const completed =
            orders.filter(order =>
                order.status === ORDER_STATUS.COMPLETED
            );

        return {
            pendingOrders: active,
            completedOrders: completed,

            pendingCount:
                active.filter(order =>
                    order.status === ORDER_STATUS.PENDING
                ).length,

            acceptedCount:
                active.filter(order =>
                    order.status === ORDER_STATUS.ACCEPTED
                ).length,

            unreadNotifications:
                active.filter(order =>
                    !order.notificationRead
                ),
        };

    },[orders]);


    if(checking){

        return (
            <main className="admin-page">
                <section className="dashboard">
                    {t("admin.dashboard.checkingPermissions")}
                </section>
            </main>
        );

    }


    if(!authorized){

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


    function renderContent(){

        if(loading || eventsLoading){

            return (
                <div className="empty-admin-box">
                    {t("admin.dashboard.loading")}
                </div>
            );

        }


        switch(activeTab){

            case "lista":
                return (
                    <AdminShoppingList
                        orders={pendingOrders}
                    />
                );

            case "powiadomienia":
                return (
                    <AdminNotifications
                        orders={pendingOrders}
                    />
                );

            case "zrealizowane":
                return (
                    <AdminCompletedList
                        orders={completedOrders}
                    />
                );

            case "dziennik":
                return (
                    <AdminEventLog
                        logs={logs}
                    />
                );

            case "kalendarz":
                return (
                    <AdminCalendar
                        events={events}
                        onEdit={() => {}}
                        onDelete={() => {}}
                    />
                );

            default:
                return null;

        }

    }


    return (

        <main className="admin-page">

            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                pendingCount={pendingCount}
                acceptedCount={acceptedCount}
                completedCount={completedOrders.length}
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
                    completedCount={completedOrders.length}
                />

                {renderContent()}

            </section>

        </main>

    );

}
