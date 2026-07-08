import { View, Text, StyleSheet } from "react-native";
import type { ScheduleEvent } from "@/types/schedule";
import { formatTime, sanitizeTitle } from "@/utils/schedule";

const ACCENT_COLOR = "#0A84FF";
const WARNING_COLOR = "#FF9F0A";
const DANGER_COLOR = "#FF453A";

interface EventCardProps {
  event: ScheduleEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const isRattrapage =
    event.extendedProps.sessionType === "resit" ||
    (event.extendedProps.sessionType === "exam" &&
      event.extendedProps.sessionLabel?.includes("RATTRAPAGE"));
  const isExam = event.extendedProps.sessionType === "exam" && !isRattrapage;
  const accentColor = isRattrapage
    ? WARNING_COLOR
    : isExam
      ? DANGER_COLOR
      : ACCENT_COLOR;

  const sanitizedTitle = sanitizeTitle(event.title);

  return (
    <View style={styles.card}>
      {/* Accent bar */}
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

      <View style={styles.cardContent}>
        {/* Top row: time + badge */}
        <View style={styles.topRow}>
          <Text style={[styles.time, { color: accentColor }]}>
            {formatTime(event.start)}
            <Text style={styles.timeDash}> — </Text>
            {formatTime(event.end)}
          </Text>

          {isRattrapage && (
            <View style={[styles.badge, { backgroundColor: WARNING_COLOR }]}>
              <Text style={styles.badgeText}>Rattrapage</Text>
            </View>
          )}
          {isExam && (
            <View style={[styles.badge, { backgroundColor: DANGER_COLOR }]}>
              <Text style={styles.badgeText}>Examen</Text>
            </View>
          )}
        </View>

        {/* Module title */}
        <Text style={styles.moduleTitle}>{sanitizedTitle}</Text>

        {/* Room + teacher */}
        <View style={styles.detailsRow}>
          {event.extendedProps.room ? (
            <Text style={styles.detailText}>{event.extendedProps.room}</Text>
          ) : null}
          {event.extendedProps.room && event.extendedProps.teacher ? (
            <Text style={styles.detailSeparator}>—</Text>
          ) : null}
          {event.extendedProps.teacher ? (
            <Text style={styles.detailText}>{event.extendedProps.teacher}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
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
    width: 4,
    flexShrink: 0,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    gap: 8,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  time: {
    fontSize: 13,
    fontWeight: "600",
    flexShrink: 1,
  },
  timeDash: {
    color: "#8E8E93",
  },
  badge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#FFFFFF",
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 18,
  },
  detailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    alignItems: "center",
  },
  detailText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  detailSeparator: {
    fontSize: 12,
    color: "#8E8E93",
  },
});
