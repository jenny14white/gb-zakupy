import { useEffect, useRef } from "react";

import { logoutPortal } from "../../firebase/auth";


const SESSION_TIME = 10 * 60 * 1000;

const ACTIVITY_EVENTS = [
    "mousemove",
    "mousedown",
    "keydown",
    "scroll",
    "touchstart",
];


export default function SessionGuard({
    onLogout,
}) {

    const timerRef = useRef(null);
    const loggedOutRef = useRef(false);


    useEffect(()=>{


        function clearTimer(){

            if(timerRef.current){

                clearTimeout(
                    timerRef.current
                );

                timerRef.current = null;

            }

        }



        function logout(){

            if(loggedOutRef.current)
                return;


            loggedOutRef.current = true;


            clearTimer();


            sessionStorage.removeItem(
                "gbAccess"
            );

            sessionStorage.removeItem(
                "gbLastActivity"
            );


            logoutPortal()
                .catch(error =>
                    console.error(
                        "Logout error:",
                        error
                    )
                );


            onLogout?.();

        }



        function setTimer(){

            clearTimer();


            timerRef.current =
                setTimeout(
                    logout,
                    SESSION_TIME
                );

        }



        function refreshSession(){

            if(loggedOutRef.current)
                return;


            sessionStorage.setItem(
                "gbLastActivity",
                Date.now()
            );


            setTimer();

        }



        function checkSession(){

            const lastActivity =
                Number(
                    sessionStorage.getItem(
                        "gbLastActivity"
                    )
                );


            if(!lastActivity){

                refreshSession();

                return;

            }


            const inactiveTime =
                Date.now()
                -
                lastActivity;


            if(
                inactiveTime >= SESSION_TIME
            ){

                logout();

            }else{

                timerRef.current =
                    setTimeout(
                        logout,
                        SESSION_TIME - inactiveTime
                    );

            }

        }



        ACTIVITY_EVENTS.forEach(event => {

            window.addEventListener(
                event,
                refreshSession,
                {
                    passive:true,
                }
            );

        });


        checkSession();



        return ()=>{

            clearTimer();


            ACTIVITY_EVENTS.forEach(event=>{

                window.removeEventListener(
                    event,
                    refreshSession
                );

            });

        };


    },[
        onLogout
    ]);


    return null;

}
