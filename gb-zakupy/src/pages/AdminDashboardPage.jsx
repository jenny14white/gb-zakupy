import {useEffect,useMemo,useState} from "react";
import {useTranslation} from "react-i18next";
import {onAuthStateChanged} from "firebase/auth";

import {auth} from "../firebase/firebase";

import {useAdminOrders} from "../hooks/useAdminOrders";
import {useLogs} from "../hooks/useLogs";
import {useEvents} from "../hooks/useEvents";

import {ORDER_STATUS} from "../utils/constants";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminStats from "../components/admin/AdminStats";
import AdminShoppingList from "../components/admin/AdminShoppingList";
import AdminNotifications from "../components/admin/AdminNotifications";
import AdminCompletedList from "../components/admin/AdminCompletedList";
import AdminEventLog from "../components/admin/AdminEventLog";
import AdminCalendar from "../components/admin/AdminCalendar";
import UsersPage from "./UsersPage";


const ADMIN_UID =
    "kRulgEcxNed8aYacTWq3j9GgP4J2";


const SECRETARIAT_UID =
    "474lDJntS0agRKyLcnHTXfEf58n1";


const ADMIN_UIDS = [
    ADMIN_UID,
    SECRETARIAT_UID,
];


export default function AdminDashboardPage({
    goBack,
    logout,
    goToEvents,
}){

    const {t} = useTranslation();


    const [activeTab,setActiveTab] =
        useState("lista");


    const [authorized,setAuthorized] =
        useState(false);


    const [checking,setChecking] =
        useState(true);


    const [userUid,setUserUid] =
        useState(null);



    /*
     * =========================
     * AUTH
     * =========================
     */

    useEffect(()=>{

        const unsubscribe =
            onAuthStateChanged(
                auth,
                user=>{

                    const uid =
                        user?.uid ?? null;


                    setUserUid(uid);


                    setAuthorized(
                        Boolean(
                            user &&
                            ADMIN_UIDS.includes(
                                user.uid
                            )
                        )
                    );


                    setChecking(false);

                }
            );


        return unsubscribe;

    },[]);



    const isAdmin =
        userUid === ADMIN_UID;


    const isSecretariat =
        userUid === SECRETARIAT_UID;



    /*
     * =========================
     * DATA
     * =========================
     */

    const {
        orders=[],
        loading:ordersLoading
    } = useAdminOrders(
        authorized
    );


    const logs =
        useLogs(
            authorized &&
            isAdmin
        );


    const {
        events=[],
        loading:eventsLoading
    } = useEvents(
        authorized
    );



    /*
     * =========================
     * ORDERS
     * =========================
     */

    const {
        pendingOrders,
        completedOrders,
        pendingCount,
        acceptedCount,
        unreadNotifications
    } = useMemo(()=>{

        const activeOrders =
            orders.filter(order=>
                order.status ===
                    ORDER_STATUS.PENDING
                ||
                order.status ===
                    ORDER_STATUS.ACCEPTED
            );


        const finishedOrders =
            orders.filter(order=>
                order.status ===
                    ORDER_STATUS.COMPLETED
            );


        return {

            pendingOrders:
                activeOrders,


            completedOrders:
                finishedOrders,


            pendingCount:
                activeOrders.filter(order=>
                    order.status ===
                        ORDER_STATUS.PENDING
                ).length,


            acceptedCount:
                activeOrders.filter(order=>
                    order.status ===
                        ORDER_STATUS.ACCEPTED
                ).length,


            unreadNotifications:
                activeOrders.filter(order=>
                    !order.notificationRead
                ),

        };

    },[orders]);



    /*
     * =========================
     * LOADING
     * =========================
     */

    if(checking){

        return(

            <main className="admin-page">

                <section className="dashboard">

                    <div className="empty-admin-box">

                        {t(
                            "admin.dashboard.checkingPermissions"
                        )}

                    </div>

                </section>

            </main>

        );

    }



    /*
     * =========================
     * ACCESS DENIED
     * =========================
     */

    if(!authorized){

        return(

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



    /*
     * =========================
     * TAB CHANGE
     * =========================
     */

    function handleSetActiveTab(tab){

        /*
         * Sekretariat nie ma dostępu
         * do dziennika.
         */

        if(
            tab === "dziennik" &&
            !isAdmin
        ){

            return;

        }


        /*
         * Użytkownicy tylko dla
         * głównego administratora.
         */

        if(
            tab === "uzytkownicy" &&
            !isAdmin
        ){

            return;

        }


        setActiveTab(tab);

    }



    /*
     * =========================
     * CONTENT
     * =========================
     */

    function renderContent(){


        /*
         * ZAKUPY
         *
         * Tutaj są kafelki.
         * W żadnej innej zakładce
         * ich nie renderujemy.
         */

        if(activeTab === "lista"){

            if(ordersLoading){

                return(

                    <div className="empty-admin-box">

                        {t(
                            "admin.dashboard.loading"
                        )}

                    </div>

                );

            }


            return(

                <>

                    <header className="dashboard-header">

                        <div>

                            <span className="dashboard-eyebrow">
                                SEKRETARIAT
                            </span>


                            <h1>
                                {t(
                                    "admin.dashboard.title"
                                )}
                            </h1>


                            <p className="dashboard-description">
                                Centrum zarządzania zakupami,
                                wydarzeniami i administracją.
                            </p>

                        </div>

                    </header>



                    <section className="dashboard-stats">

                        <AdminStats

                            allCount={
                                orders.length
                            }

                            pendingCount={
                                pendingCount
                            }

                            acceptedCount={
                                acceptedCount
                            }

                            completedCount={
                                completedOrders.length
                            }

                        />

                    </section>



                    <section className="dashboard-content">

                        <AdminShoppingList
                            orders={pendingOrders}
                        />

                    </section>

                </>

            );

        }



        /*
         * POWIADOMIENIA
         */

        if(activeTab === "powiadomienia"){

            if(ordersLoading){

                return(

                    <div className="empty-admin-box">

                        {t(
                            "admin.dashboard.loading"
                        )}

                    </div>

                );

            }


            return(

                <section className="dashboard-content">

                    <AdminNotifications
                        orders={pendingOrders}
                    />

                </section>

            );

        }



        /*
         * ZREALIZOWANE
         */

        if(activeTab === "zrealizowane"){

            if(ordersLoading){

                return(

                    <div className="empty-admin-box">

                        {t(
                            "admin.dashboard.loading"
                        )}

                    </div>

                );

            }


            return(

                <section className="dashboard-content">

                    <AdminCompletedList
                        orders={completedOrders}
                    />

                </section>

            );

        }



        /*
         * DZIENNIK
         */

        if(activeTab === "dziennik"){

            if(!isAdmin){

                return null;

            }


            if(ordersLoading){

                return(

                    <div className="empty-admin-box">

                        {t(
                            "admin.dashboard.loading"
                        )}

                    </div>

                );

            }


            return(

                <section className="dashboard-content">

                    <AdminEventLog
                        logs={logs}
                    />

                </section>

            );

        }



        /*
         * KALENDARZ
         */

        if(activeTab === "kalendarz"){

            if(eventsLoading){

                return(

                    <div className="empty-admin-box">

                        Ładowanie kalendarza...

                    </div>

                );

            }


            return(

                <section className="dashboard-content">

                    <AdminCalendar
                        events={events}
                        onEdit={()=>{}}
                        onDelete={()=>{}}
                    />

                </section>

            );

        }



        /*
         * UŻYTKOWNICY
         */

        if(activeTab === "uzytkownicy"){

            if(!isAdmin){

                return null;

            }


            return(

                <section className="dashboard-content">

                    <UsersPage />

                </section>

            );

        }



        return null;

    }



    /*
     * =========================
     * PAGE
     * =========================
     */

    return(

        <main className="admin-page">


            <AdminSidebar

                activeTab={activeTab}

                setActiveTab={
                    handleSetActiveTab
                }

                pendingCount={
                    pendingCount
                }

                acceptedCount={
                    acceptedCount
                }

                completedCount={
                    completedOrders.length
                }

                unreadNotificationsCount={
                    unreadNotifications.length
                }

                goBack={goBack}

                logout={logout}

                goToEvents={goToEvents}

                userUid={userUid}

            />


            <section className="dashboard">

                {renderContent()}

            </section>


        </main>

    );

}
