import { useEffect, useState } from 'react';
import { listenToLogs } from '../services/logsService';

export function useLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const unsubscribe = listenToLogs(setLogs);
    return unsubscribe;
  }, []);

  return logs;
}
