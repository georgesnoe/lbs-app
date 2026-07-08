import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  getFreeRooms,
  getMinutesUntilNextEvent,
  formatMinutes,
} from "@/utils/schedule";
import { sanitizeTitle } from "@/utils/schedule";
import type { ScheduleEvent } from "@/types/schedule";

const SUCCESS_COLOR = "#30D158";

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
  refreshControl?: React.ReactElement;
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

    const freeRooms = getFreeRooms(data, now, now);

    return freeRooms
      .map((room) => {
        const minutesUntil = getMinutesUntilNextEvent(data, room.name, now);

        let nextEvent: NextEvent | null = null;
        if (minutesUntil !== null) {
          const nextEvents = data
            .filter(
              (e) =>
                e.extendedProps.room === room.name &&
                new Date(e.start).getTime() > now.getTime(),
            )
            .sort(
              (a, b) =>
                new Date(a.start).getTime() - new Date(b.start).getTime(),
            );
          if (nextEvents.length > 0) {
            nextEvent = { title: nextEvents[0].title, minutesUntil };
          }
        }

        return {
          name: room.name,
          capacity: room.capacity,
          nextEvent,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
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
          <View style={styles.card}>
            {/* Accent bar — vert pour "libre" */}
            <View
              style={[styles.accentBar, { backgroundColor: SUCCESS_COLOR }]}
            />

            <View style={styles.cardContent}>
              {/* Top row: name + badge */}
              <View style={styles.topRow}>
                <Text style={styles.roomName} numberOfLines={1}>
                  {room.name}
                </Text>
                <View
                  style={[styles.badge, { backgroundColor: SUCCESS_COLOR }]}
                >
                  <Text style={styles.badgeText}>Libre</Text>
                </View>
              </View>

              {/* Capacity */}
              <Text style={styles.capacity}>{room.capacity} places</Text>

              {/* Next event or no-event indicator */}
              {room.nextEvent ? (
                <View style={styles.nextEventContainer}>
                  <Text style={styles.nextEventTitle} numberOfLines={1}>
                    {sanitizeTitle(room.nextEvent.title)}
                  </Text>
                  <Text style={styles.nextEventTime}>
                    Dans {formatMinutes(room.nextEvent.minutesUntil)}
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
    borderRadius: 10,
    overflow: "hidden",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  accentBar: {
    height: 4,
  },
  cardContent: {
    padding: 12,
    gap: 8,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  roomName: {
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
  },
  badge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#FFFFFF",
  },
  capacity: {
    fontSize: 12,
    color: "#8E8E93",
  },
  nextEventContainer: {
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 8,
    gap: 2,
  },
  nextEventTitle: {
    fontSize: 12,
    fontWeight: "600",
  },
  nextEventTime: {
    fontSize: 11,
    fontWeight: "500",
    color: "#0A84FF",
  },
  noEventText: {
    fontSize: 11,
    color: "#8E8E93",
  },
});
