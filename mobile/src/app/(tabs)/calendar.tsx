import { useMemo, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Host, Switch, Button, Row, Icon } from "@expo/ui";
import { useScheduleData } from "@/hooks/use-schedule-data";
import { useSettings } from "@/hooks/useSettings";
import { LevelSelector, DayGroup } from "@/components/planning";
import type { DayGroup as DayGroupType } from "@/types/schedule";
import { ALL_LEVELS, hasLevelEvents } from "@/types/levels";
import { getLevelSchedule, getMonday } from "@/utils/schedule";
import * as swiftModifier from "@expo/ui/swift-ui/modifiers";
import * as composeModifier from "@expo/ui/jetpack-compose/modifiers";

export default function CalendarScreen() {
  const { settings } = useSettings();
  const [weekOffset, setWeekOffset] = useState(0);
  const { data, loading, error, refresh } = useScheduleData(weekOffset);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [todayOnly, setTodayOnly] = useState(false);

  /* Appliquer le niveau par défaut des réglages au montage */
  useEffect(() => {
    if (settings.defaultLevel) {
      setSelectedLevel(settings.defaultLevel);
    }
  }, [settings.defaultLevel]);

  const onRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  /* Navigation de semaine */
  const goToPreviousWeek = useCallback(() => {
    setWeekOffset((prev) => prev - 1);
  }, []);

  const goToNextWeek = useCallback(() => {
    setWeekOffset((prev) => prev + 1);
  }, []);

  const goToCurrentWeek = useCallback(() => {
    setWeekOffset(0);
  }, []);

  const isCurrentWeek = weekOffset === 0;

  /* Titre de la semaine affichée */
  const weekLabel = useMemo(() => {
    const monday = getMonday(new Date());
    monday.setDate(monday.getDate() + weekOffset * 7);
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    const formatDay = (d: Date) =>
      `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    return `${formatDay(monday)} – ${formatDay(sunday)}`;
  }, [weekOffset]);

  /* Tous les niveaux disponibles (liste statique complète) */
  const levels = ALL_LEVELS;

  /* Savoir si le niveau sélectionné a des cours cette semaine */
  const hasEvents = selectedLevel ? hasLevelEvents(data, selectedLevel) : false;

  /* Filter events by selected level */
  const filteredEvents = useMemo(() => {
    if (!selectedLevel || !hasEvents) return [];
    return getLevelSchedule(data, selectedLevel);
  }, [data, selectedLevel, hasEvents]);

  /* Group events by day */
  const days = useMemo<DayGroupType[]>(() => {
    if (filteredEvents.length === 0) return [];

    const todayKey = new Date().toISOString().split("T")[0];

    const groups = new Map<string, typeof filteredEvents>();
    for (const event of filteredEvents) {
      const key = event.start.split("T")[0];
      if (todayOnly && key !== todayKey) continue;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(event);
    }

    const DAY_NAMES = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    const MONTH_NAMES = [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
    ];
    const formatDayLabel = (dateKey: string): string => {
      const date = new Date(dateKey + "T00:00:00");
      const dayName = DAY_NAMES[date.getDay()];
      const dayNum = date.getDate();
      const monthName = MONTH_NAMES[date.getMonth()];
      const year = date.getFullYear();
      return `${dayName} ${dayNum} ${monthName} ${year}`;
    };

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
  }, [filteredEvents, todayOnly]);

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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mon planning</Text>
          <Text style={styles.subtitle}>
            {selectedLevel
              ? `${days.length} jour${days.length > 1 ? "s" : ""} de cours`
              : "Sélectionne ton niveau pour voir ton emploi du temps"}
          </Text>

          {levels.length > 0 && (
            <LevelSelector
              levels={levels}
              selectedLevel={selectedLevel}
              onSelectLevel={setSelectedLevel}
            />
          )}
        </View>

        {/* Week navigation */}
        {selectedLevel && !todayOnly && (
          <View style={styles.weekNav}>
            <Host matchContents>
              <Button onPress={goToPreviousWeek} variant="outlined">
                <Icon
                  name={Icon.select({
                    android: require("../../../node_modules/@expo/material-symbols/icons/chevron_left.xml"),
                    ios: "chevron.left",
                  })}
                />
              </Button>
            </Host>

            <View style={styles.weekLabelContainer}>
              <Text style={styles.weekLabel}>{weekLabel}</Text>
              {!isCurrentWeek && (
                <Host matchContents>
                  <Button
                    onPress={goToCurrentWeek}
                    label="Aujourd'hui"
                    variant="filled"
                  />
                </Host>
              )}
            </View>

            <Host matchContents>
              <Button onPress={goToPreviousWeek} variant="outlined">
                <Icon
                  name={Icon.select({
                    android: require("../../../node_modules/@expo/material-symbols/icons/chevron_right.xml"),
                    ios: "chevron.right",
                  })}
                />
              </Button>
            </Host>
          </View>
        )}

        {/* Week / Today switch */}
        {selectedLevel && (
          <View style={styles.switchRow}>
            <Text
              style={[
                styles.switchLabel,
                !todayOnly && styles.switchLabelActive,
              ]}
            >
              Semaine
            </Text>
            <Host matchContents>
              <Switch
                value={todayOnly}
                onValueChange={(checked) => setTodayOnly(checked)}
              />
            </Host>
            <Text
              style={[
                styles.switchLabel,
                todayOnly && styles.switchLabelActive,
              ]}
            >
              Aujourd'hui
            </Text>
          </View>
        )}

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
              {hasEvents
                ? "Aucun cours" +
                  (todayOnly ? " aujourd'hui" : " cette semaine")
                : "Pas de cours disponible cette semaine"}
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
  header: {
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    color: "#8E8E93",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 4,
  },
  switchLabel: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
  },
  switchLabelActive: {
    color: "#0A84FF",
    fontWeight: "600",
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
  weekNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
  },
  weekArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  weekLabelContainer: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  weekLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },
});
