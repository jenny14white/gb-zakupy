import { useEffect } from "react";


export default function SessionGuard({
    onLogout
}){


    useEffect(()=>{


        const TIME = 10 * 60 * 1000;


        let timer;



        function refreshSession(){


            sessionStorage.setItem(
                "gbLastActivity",
                Date.now()
            );



            clearTimeout(timer);



            timer=setTimeout(()=>{


                sessionStorage.removeItem(
                    "gbAccess"
                );


                sessionStorage.removeItem(
                    "gbLastActivity"
                );



                onLogout();



            },TIME);


        }





        const events=[

            "mousemove",
            "mousedown",
            "keydown",
            "scroll",
            "touchstart"

        ];




        events.forEach(event=>{


            window.addEventListener(
                event,
                refreshSession
            );


        });




        refreshSession();





        return ()=>{


            clearTimeout(timer);



            events.forEach(event=>{


                window.removeEventListener(
                    event,
                    refreshSession
                );


            });


        };



    },[onLogout]);



    return null;

}
