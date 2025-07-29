import { useEffect, useState } from 'react';
import {User} from "../types/api.types"
export function useApi(url: string) {
  const [data, setData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch data');
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err instanceof Error) {
          console.error('Error:', err.message);
          setError(err.message)
        } else {
          console.error('Unknown error:', err);
   
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [url]);

  return { data, loading, error };
}
