import { useEffect, useState } from "react";
import { listenToEvents } from "../services/calendarService";

export function useEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = listenToEvents((data) => {
            setEvents(data);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return {
        events,
        loading,
    };
}

export default useEvents;
