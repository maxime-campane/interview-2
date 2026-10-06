import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import type { Site } from '@/types/site';

interface UseSitesResult {
  sites: Site[];
  setSites: Dispatch<SetStateAction<Site[]>>;
  loading: boolean;
  error: string;
}

export function useSites(): UseSitesResult {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadSites(): Promise<void> {
      try {
        const response = await fetch('/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `query {
              sites { id name address postalCode city createdAt }
            }`,
          }),
          signal: controller.signal,
        });
        const result: { data?: { sites: Site[] }; errors?: { message: string }[] } = await response.json();

        if (!response.ok || result.errors?.length || !result.data) {
          throw new Error(result.errors?.[0]?.message ?? 'Impossible de charger les sites.');
        }

        setSites(result.data.sites);
      } catch (cause) {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : 'Impossible de joindre l’API.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadSites();

    return () => controller.abort();
  }, []);

  return { sites, setSites, loading, error };
}
