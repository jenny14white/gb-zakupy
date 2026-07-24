import { useEffect, useState } from "react";
import { listenToLogs } from "../services/logsService";


export function useLogs(enabled = true) {

    const [logs, setLogs] = useState([]);


    useEffect(() => {

        if (!enabled) {

            setLogs([]);

            return;

        }


        const unsubscribe = listenToLogs(setLogs);


        return unsubscribe;


    }, [enabled]);


    return logs;

}


export default useLogs;
