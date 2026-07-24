import { useEffect, useState } from "react";

import {
    onAuthStateChanged,
} from "firebase/auth";

import { auth } from "./firebase/firebase";

import {
    logoutAdmin,
} from "./firebase/auth";



import AccessPage from "./pages/AccessPage";
import HomePage from "./pages/HomePage";
import PublicShoppingPage from "./pages/PublicShoppingPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CalendarPage from "./pages/CalendarPage";
import AdminEventsPage from "./pages/AdminEventsPage";

import SessionGuard from "./components/shared/SessionGuard";


const ADMIN_UID =
    "kRulgEcxNed8aYacTWq3j9GgP4J2";


function hasPortalAccess() {

    return (
        sessionStorage.getItem(
            "gbAccess"
        ) === "true"
    );

}



export default function App() {


    const [page,setPage] =
        useState(
            hasPortalAccess()
                ? "home"
                : "access"
        );


    const [hasAccess,setHasAccess] =
        useState(
            hasPortalAccess()
        );


    const [firebaseReady,setFirebaseReady] =
        useState(false);


    const [isAdmin,setIsAdmin] =
        useState(false);



    useEffect(() => {

        const unsubscribe =
            onAuthStateChanged(
                auth,
                user => {

                    const access =
                        hasPortalAccess();


                    setHasAccess(
                        access
                    );


                    setPage(
                        access
                            ? "home"
                            : "access"
                    );


                    setIsAdmin(
                        Boolean(
                            user &&
                            user.uid === ADMIN_UID
                        )
                    );


                    setFirebaseReady(true);

                }
            );


        return unsubscribe;

    },[]);



    function goHome(){

        setPage(
            "home"
        );

    }



    function handleAccessLogout(){

        sessionStorage.removeItem(
            "gbAccess"
        );

        sessionStorage.removeItem(
            "gbLastActivity"
        );


        setHasAccess(false);

        setPage(
            "access"
        );

    }



    async function handleLogout(){

        try{

            await logoutAdmin();

        }catch(error){

            console.error(
                error
            );

        }


        setIsAdmin(false);

        goHome();

    }



    function handleLogin(user){

        if(
            user?.uid !== ADMIN_UID
        ){
            return;
        }


        setIsAdmin(true);

        setPage(
            "admin"
        );

    }



    function handleAccessSuccess(){

        sessionStorage.setItem(
            "gbAccess",
            "true"
        );


        sessionStorage.setItem(
            "gbLastActivity",
            Date.now()
        );


        setHasAccess(true);

        goHome();

    }



    function renderPage(){

        switch(page){


            case "access":

                return (
                    <AccessPage
                        onSuccess={
                            handleAccessSuccess
                        }
                    />
                );



            case "home":

                return (
                    <HomePage
                        goToShopping={() =>
                            setPage(
                                "shopping"
                            )
                        }

                        goToCalendar={() =>
                            setPage(
                                "calendar"
                            )
                        }

                        goToAdmin={() =>
                            setPage(
                                "admin"
                            )
                        }
                    />
                );



            case "shopping":

                return (
                    <PublicShoppingPage
                        goBack={goHome}
                    />
                );



            case "calendar":

                return (
                    <CalendarPage
                        goBack={goHome}
                    />
                );



            case "admin":

                return isAdmin ? (

                    <AdminDashboardPage

                        goBack={goHome}

                        logout={
                            handleLogout
                        }

                        goToEvents={() =>
                            setPage(
                                "admin-events"
                            )
                        }

                    />

                ) : (

                    <AdminLoginPage

                        goBack={goHome}

                        onLogin={
                            handleLogin
                        }

                    />

                );



            case "admin-events":

                return isAdmin ? (

                    <AdminEventsPage

                        goBack={() =>
                            setPage(
                                "admin"
                            )
                        }

                    />

                ) : (

                    <AdminLoginPage

                        goBack={goHome}

                        onLogin={(user)=>{

                            handleLogin(user);

                            setPage(
                                "admin-events"
                            );

                        }}

                    />

                );



            default:

                return (
                    <AccessPage
                        onSuccess={
                            handleAccessSuccess
                        }
                    />
                );

        }

    }



    if(!firebaseReady){

        return null;

    }



    return (

        <>

            {hasAccess && (

                <SessionGuard
                    onLogout={
                        handleAccessLogout
                    }
                />

            )}


            {renderPage()}

        </>

    );

}
