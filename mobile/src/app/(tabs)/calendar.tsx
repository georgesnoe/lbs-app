import { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScheduleData } from "@/hooks/use-schedule-data";
import { LevelSelector, DayGroup } from "@/components/planning";
import type { DayGroup as DayGroupType } from "@/types/schedule";
import { getLevelSchedule, formatDayLabel } from "@/utils/schedule";

interface Level {
  code: string;
  label: string;
}

export default function CalendarScreen() {
  const { data, loading, error, refresh } = useScheduleData();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const onRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  /* Extract unique levels from data */
  const levels = useMemo<Level[]>(() => {
    const seen = new Map<string, string>();
    for (const event of data) {
      const codes = event.extendedProps.levelsCodes.split(", ");
      const labels = event.extendedProps.levels.split(", ");
      codes.forEach((code, i) => {
        const trimmedCode = code.trim();
        if (!trimmedCode) return;
        const label = labels[i]?.trim() || trimmedCode;
        if (!seen.has(trimmedCode)) {
          seen.set(trimmedCode, label);
        }
      });
    }
    return Array.from(seen.entries())
      .map(([code, label]) => ({ code, label }))
      .sort((a, b) => a.code.localeCompare(b.code));
  }, [data]);

  /* Filter events by selected level */
  const filteredEvents = useMemo(() => {
    if (!selectedLevel) return [];
    return getLevelSchedule(data, selectedLevel);
  }, [data, selectedLevel]);

  /* Group events by day */
  const days = useMemo<DayGroupType[]>(() => {
    if (filteredEvents.length === 0) return [];

    const groups = new Map<string, typeof filteredEvents>();
    for (const event of filteredEvents) {
      const key = event.start.split("T")[0];
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(event);
    }

    return Array.from(groups.entries())
      .map(([dateKey, events]) => {
        const sortedEvents = [...events].sort((a, b) =>
          a.extendedProps.startTime.localeCompare(b.extendedProps.startTime),
        );
        return {
          dateKey,
          displayDate: formatDayLabel(dateKey),
          events: sortedEvents,
        };
      })
      .sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  }, [filteredEvents]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#0A84FF" />
        <Text style={styles.loadingText}>Chargement du planning…</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
      >
        {/* Header row */}
        <View style={styles.headerRow}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Mon planning</Text>
            <Text style={styles.subtitle}>
              {selectedLevel
                ? `${days.length} jour${days.length > 1 ? "s" : ""} de cours`
                : "Sélectionne ton niveau pour voir ton emploi du temps"}
            </Text>
          </View>

          {levels.length > 0 && (
            <LevelSelector
              levels={levels}
              selectedLevel={selectedLevel}
              onSelectLevel={setSelectedLevel}
            />
          )}
        </View>

        {/* Empty: no level selected */}
        {!selectedLevel && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Choisis un niveau pour afficher ton planning
            </Text>
          </View>
        )}

        {/* Empty: level selected but no events */}
        {selectedLevel && days.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Aucun cours cette semaine pour ce niveau
            </Text>
          </View>
        )}

        {/* Day cards */}
        {days.length > 0 && (
          <View style={styles.daysContainer}>
            {days.map((day) => (
              <DayGroup key={day.dateKey} day={day} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  content: {
    padding: 16,
    gap: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: "#8E8E93",
  },
  errorText: {
    fontSize: 15,
    color: "#FF453A",
    textAlign: "center",
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  headerTextContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    color: "#8E8E93",
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#8E8E93",
    textAlign: "center",
  },
  daysContainer: {
    gap: 16,
  },
});
