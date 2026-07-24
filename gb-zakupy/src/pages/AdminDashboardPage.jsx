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

    const [activeTab, setActiveTab] = useState("lista");

    const [authorized, setAuthorized] = useState(false);
    const [checking, setChecking] = useState(true);


    useEffect(() => {

        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {

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

    }, []);



    const {
        orders,
        loading,
    } = useAdminOrders();


    const logs = useLogs();


    const {
        events,
        loading: eventsLoading,
    } = useEvents();



    const handleEditEvent = (event) => {

        console.log(
            "Edit event:",
            event
        );

    };


    const handleDeleteEvent = (id) => {

        console.log(
            "Delete event:",
            id
        );

    };



    const pendingOrders = useMemo(
        () =>
            orders.filter(order =>
                order.status === ORDER_STATUS.PENDING ||
                order.status === ORDER_STATUS.ACCEPTED
            ),
        [orders]
    );


    const completedOrders = useMemo(
        () =>
            orders.filter(order =>
                order.status === ORDER_STATUS.COMPLETED
            ),
        [orders]
    );


    const pendingCount = pendingOrders.filter(
        order =>
            order.status === ORDER_STATUS.PENDING
    ).length;


    const acceptedCount = pendingOrders.filter(
        order =>
            order.status === ORDER_STATUS.ACCEPTED
    ).length;


    const unreadNotifications = useMemo(
        () =>
            pendingOrders.filter(
                order => !order.notificationRead
            ),
        [pendingOrders]
    );


    if (checking) {

        return (

            <main className="admin-page">

                <section className="dashboard">

                    {t(
                        "admin.dashboard.checkingPermissions"
                    )}

                </section>

            </main>

        );

    }


    if (!authorized) {

        return (

            <main className="admin-page login-view">

                <section className="login-card">

                    <h1>
                        {t(
                            "admin.dashboard.accessDenied.title"
                        )}
                    </h1>

                    <p>
                        {t(
                            "admin.dashboard.accessDenied.description"
                        )}
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

                completedCount={completedOrders.length}

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


                <h1>
                    {t(
                        "admin.dashboard.title"
                    )}
                </h1>



                <AdminStats

                    allCount={orders.length}

                    pendingCount={pendingCount}

                    acceptedCount={acceptedCount}

                    completedCount={
                        completedOrders.length
                    }

                />



                {(loading || eventsLoading) && (

                    <div className="empty-admin-box">

                        {t(
                            "admin.dashboard.loading"
                        )}

                    </div>

                )}



                {!loading &&
                    activeTab === "lista" && (

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



                {!eventsLoading &&
                    activeTab === "kalendarz" && (

                    <AdminCalendar

                        events={events}

                        onEdit={handleEditEvent}

                        onDelete={handleDeleteEvent}

                    />

                )}


            </section>

        </main>

    );

}
