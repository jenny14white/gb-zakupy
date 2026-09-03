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



    const {
        orders = [],
        loading
    } = useAdminOrders(authorized);



    const logs =
        useLogs(
            authorized &&
            isAdmin
        );



    const {
        events = [],
        loading:eventsLoading
    } = useEvents(authorized);



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



    if(checking){

        return (

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



    if(!authorized){

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



    function handleSetActiveTab(tab){

        if(
            tab === "dziennik" &&
            !isAdmin
        ){

            return;

        }


        if(
            tab === "uzytkownicy" &&
            !isAdmin
        ){

            return;

        }


        setActiveTab(tab);

    }



    function renderContent(){

        if(
            loading ||
            eventsLoading
        ){

            return (

                <div className="empty-admin-box">

                    {t(
                        "admin.dashboard.loading"
                    )}

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

                if(!isAdmin){

                    return (
                        <AdminShoppingList
                            orders={pendingOrders}
                        />
                    );

                }


                return (
                    <AdminEventLog
                        logs={logs}
                    />
                );



            case "kalendarz":

                return (

                    <AdminCalendar
                        events={events}
                        onEdit={()=>{}}
                        onDelete={()=>{}}
                    />

                );



            case "uzytkownicy":

                if(!isAdmin){

                    return null;

                }


                return (
                    <UsersPage />
                );



            default:

                return null;

        }

    }



    return (

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


                <header className="dashboard-header">


                    <div>


                        <span className="dashboard-eyebrow">

                            GB PORTAL

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

                    {renderContent()}

                </section>


            </section>


        </main>

    );

}
