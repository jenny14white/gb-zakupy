import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { ADMIN_EMAIL } from '../utils/constants';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (
        currentUser &&
        currentUser.email?.toLowerCase() === ADMIN_EMAIL?.toLowerCase()
      ) {
        setUser(currentUser);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    user,
    loading,
    isAdmin: !!user,
  };
}
