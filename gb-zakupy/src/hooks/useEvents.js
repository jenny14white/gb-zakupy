import { useEffect, useState } from "react";
import { listenToEvents } from "../services/calendarService";


export function useEvents(enabled = true) {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        if (!enabled) {

            setEvents([]);
            setLoading(false);

            return;

        }


        setLoading(true);


        const unsubscribe = listenToEvents((data) => {

            setEvents(data);
            setLoading(false);

        });


        return unsubscribe;


    }, [enabled]);


    return {
        events,
        loading,
    };

}


export default useEvents;
