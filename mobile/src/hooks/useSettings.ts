import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppSettings } from "@/types/settings";
import { DEFAULT_SETTINGS } from "@/types/settings";

const STORAGE_KEY = "@lbs/settings";

interface UseSettingsResult {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => Promise<void>;
  loading: boolean;
}

export function useSettings(): UseSettingsResult {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((json) => {
        if (json) {
          const stored = JSON.parse(json) as Partial<AppSettings>;
          setSettings({ ...DEFAULT_SETTINGS, ...stored });
        }
      })
      .catch(() => {
        // Fall back to defaults silently
      })
      .finally(() => setLoading(false));
  }, []);

  const updateSettings = useCallback(
    async (partial: Partial<AppSettings>) => {
      const next = { ...settings, ...partial };
      setSettings(next);
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Silently fail
      }
    },
    [settings],
  );

  return { settings, updateSettings, loading };
}
