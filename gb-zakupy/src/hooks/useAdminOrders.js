import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    listenToOrders,
} from "../services/ordersService";


const NOTIFICATION_TITLE =
    "📦 GB Zakupy";


export function useAdminOrders(
    enabled = true
) {

    const [orders,setOrders] =
        useState([]);

    const [loading,setLoading] =
        useState(true);



    const initialized =
        useRef(false);


    const previousIds =
        useRef(new Set());



    useEffect(() => {


        if(!enabled){

            setOrders([]);

            setLoading(false);

            initialized.current = false;

            previousIds.current =
                new Set();

            return;

        }



        let active = true;



        async function enableNotifications(){

            if(
                "Notification" in window &&
                Notification.permission === "default"
            ){

                try{

                    await Notification.requestPermission();

                }catch(error){

                    console.error(
                        "Notification error:",
                        error
                    );

                }

            }

        }


        enableNotifications();



        const unsubscribe =
            listenToOrders(
                data => {


                    if(!active){
                        return;
                    }



                    if(
                        !initialized.current
                    ){

                        previousIds.current =
                            new Set(
                                data.map(
                                    order =>
                                        order.id
                                )
                            );


                        initialized.current =
                            true;


                        setOrders(data);

                        setLoading(false);

                        return;

                    }



                    data.forEach(
                        order => {


                            const isNew =
                                !previousIds.current.has(
                                    order.id
                                );


                            if(
                                isNew &&
                                "Notification" in window &&
                                Notification.permission === "granted"
                            ){

                                const notification =
                                    new Notification(
                                        NOTIFICATION_TITLE,
                                        {
                                            body:
                                                `${order.requestedBy} dodał(a): ${order.product}`,

                                            icon:
                                                "/logo.png",

                                            badge:
                                                "/logo.png",
                                        }
                                    );


                                notification.onclick =
                                    () => {

                                        window.focus();

                                        notification.close();

                                    };

                            }

                        }
                    );



                    previousIds.current =
                        new Set(
                            data.map(
                                order =>
                                    order.id
                            )
                        );



                    setOrders(data);

                    setLoading(false);


                }
            );



        return () => {

            active = false;

            unsubscribe();

        };


    },[
        enabled
    ]);



    return {
        orders,
        loading,
    };

}



export default useAdminOrders;
