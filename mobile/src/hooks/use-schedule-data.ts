import { useCallback, useEffect, useState } from "react";
import type { ScheduleEvent } from "@/types/schedule";
import { getScheduleApiUrl } from "@/utils/schedule";

interface UseScheduleDataResult {
  data: ScheduleEvent[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useScheduleData(weekOffset: number = 0): UseScheduleDataResult {
  const [data, setData] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function fetchData() {
      try {
        const url = getScheduleApiUrl(weekOffset);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const json: ScheduleEvent[] = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Impossible de charger les données",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [refreshKey, weekOffset]);

  return { data, loading, error, refresh };
}
