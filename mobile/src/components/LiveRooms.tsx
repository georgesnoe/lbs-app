import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  type RefreshControlProps,
} from "react-native";
import { getFreeRooms, formatMinutes } from "@/utils/schedule";
import { sanitizeTitle } from "@/utils/schedule";
import type { ScheduleEvent } from "@/types/schedule";

interface NextEvent {
  title: string;
  minutesUntil: number;
}

interface RoomCard {
  name: string;
  capacity: number;
  nextEvent: NextEvent | null;
}

interface LiveRoomsProps {
  data: ScheduleEvent[];
  loading: boolean;
  error: string | null;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

export default function LiveRooms({
  data,
  loading,
  error,
  refreshControl,
}: LiveRoomsProps) {
  const [now, setNow] = useState(new Date());

  /* Tick every 10 s so the countdown feels alive */
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(id);
  }, []);

  /* Derive room cards from raw data + current time */
  const rooms = useMemo<RoomCard[]>(() => {
    if (data.length === 0) return [];

    const nowMs = now.getTime();
    const todayStr = now.toISOString().split("T")[0];

    /* Après 21h30 → toutes les salles sont libres, plus de "prochain cours" */
    const isAfterClosing = now.getHours() >= 21 && now.getMinutes() >= 30;

    /* Événements en cours maintenant (couvre une fenêtre de 2h) */
    const currentFrom = new Date(nowMs - 2 * 60 * 60 * 1000);
    const freeRooms = getFreeRooms(data, currentFrom, now);

    return freeRooms
      .map((room) => {
        if (isAfterClosing) {
          return { name: room.name, capacity: room.capacity, nextEvent: null };
        }

        /* Prochains événements du jour uniquement */
        const todayEvents = data
          .filter(
            (e) =>
              e.extendedProps.room === room.name &&
              e.start.startsWith(todayStr) &&
              new Date(e.start).getTime() > nowMs,
          )
          .sort(
            (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
          );

        let nextEvent: NextEvent | null = null;
        if (todayEvents.length > 0) {
          const minutesUntil = Math.ceil(
            (new Date(todayEvents[0].start).getTime() - nowMs) / 60_000,
          );
          nextEvent = { title: todayEvents[0].title, minutesUntil };
        }

        return { name: room.name, capacity: room.capacity, nextEvent };
      })
      .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
  }, [data, now]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0A84FF" />
        <Text style={styles.loadingText}>Chargement des salles…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Salles disponibles</Text>
        <Text style={styles.subtitle}>
          {rooms.length} salle{rooms.length > 1 ? "s" : ""} libre
          {rooms.length > 1 ? "s" : ""} maintenant
        </Text>
      </View>

      <FlatList
        data={rooms}
        keyExtractor={(item) => item.name}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        refreshControl={refreshControl}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Aucune salle libre pour le moment.
            </Text>
          </View>
        }
        renderItem={({ item: room }) => (
          <View style={[styles.card, { backgroundColor: "#EAF9EE" }]}>
            <View style={styles.cardContent}>
              <Text style={styles.roomName} numberOfLines={1}>
                {room.name}
              </Text>

              <Text style={styles.capacity}>{room.capacity} places</Text>

              {/* Next event or no-event indicator */}
              {room.nextEvent ? (
                <View style={styles.nextEventContainer}>
                  <Text style={styles.nextEventTitle} numberOfLines={1}>
                    {sanitizeTitle(room.nextEvent.title)}
                  </Text>
                  <Text style={styles.nextEventTime}>
                    Prochain cours dans{" "}
                    {formatMinutes(room.nextEvent.minutesUntil)}
                  </Text>
                </View>
              ) : (
                <View style={styles.nextEventContainer}>
                  <Text style={styles.noEventText}>
                    Aucun cours prévu aujourd'hui
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
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
  listContent: {
    padding: 16,
    gap: 12,
  },
  row: {
    gap: 12,
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
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardContent: {
    padding: 14,
    gap: 8,
  },
  roomName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  capacity: {
    fontSize: 12,
    color: "#666670",
  },
  nextEventContainer: {
    backgroundColor: "rgba(48, 209, 88, 0.15)",
    borderRadius: 8,
    padding: 10,
    gap: 3,
  },
  nextEventTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  nextEventTime: {
    fontSize: 11,
    fontWeight: "600",
    color: "#30D158",
  },
  noEventText: {
    fontSize: 11,
    color: "#666670",
  },
});
