import { useCallback, useEffect, useState } from 'react';

export function useGitHubData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadOverview = useCallback(async ({ forceRefresh = false } = {}) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const url = forceRefresh ? '/api/github/overview?refresh=true' : '/api/github/overview';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const fetchRepoReadme = useCallback(async (repoName) => {
    const response = await fetch(`/api/github/repos/${encodeURIComponent(repoName)}/readme`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  }, []);

  return {
    data,
    loading,
    refreshing,
    error,
    refresh: () => loadOverview({ forceRefresh: true }),
    fetchRepoReadme,
  };
}
