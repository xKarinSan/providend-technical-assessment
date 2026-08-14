import { useCallback, useState } from 'react';

const STORAGE_KEY = 'userId';

/**
 * The acting user. Authentication is out of scope, so the id simply lives in
 * localStorage; in production it would come from the JWT.
 */
export function useCurrentUser() {
  const [userId, setUserId] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY),
  );

  const changeUser = useCallback((id: string) => {
    localStorage.setItem(STORAGE_KEY, id);
    setUserId(id);
  }, []);

  return { userId, changeUser };
}
