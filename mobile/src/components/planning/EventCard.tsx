import { View, Text, StyleSheet } from "react-native";
import type { ScheduleEvent } from "@/types/schedule";
import { formatTime, sanitizeTitle } from "@/utils/schedule";

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

  const apiBgColor = event.backgroundColor || "#0A84FF";
  const apiTextColor = event.textColor || "#0A84FF";
  const sanitizedTitle = sanitizeTitle(event.title);

  /* Convertir une couleur hex en rgba avec opacité pour un fond subtil */
  const hexToRgba = (hex: string, alpha: number) => {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    if ([r, g, b].some(isNaN)) return `rgba(10, 132, 255, ${alpha})`;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <View
      style={[styles.card, { backgroundColor: hexToRgba(apiBgColor, 0.12) }]}
    >
      <View style={styles.cardContent}>
        {/* Top row: time + badge */}
        <View style={styles.topRow}>
          <View
            style={[
              styles.timePill,
              { backgroundColor: hexToRgba(apiBgColor, 0.25) },
            ]}
          >
            <Text style={[styles.time, { color: apiTextColor }]}>
              {formatTime(event.start)} — {formatTime(event.end)}
            </Text>
          </View>

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
        <Text style={[styles.moduleTitle, { color: apiTextColor }]}>
          {sanitizedTitle}
        </Text>

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
    borderRadius: 12,
    overflow: "hidden",
  },
  cardContent: {
    padding: 14,
    gap: 8,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  timePill: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  time: {
    fontSize: 12,
    fontWeight: "700",
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#FFFFFF",
  },
  moduleTitle: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  detailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    alignItems: "center",
  },
  detailText: {
    fontSize: 12,
    color: "#666670",
  },
  detailSeparator: {
    fontSize: 12,
    color: "#666670",
  },
});
