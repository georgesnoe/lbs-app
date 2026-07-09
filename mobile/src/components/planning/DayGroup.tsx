import { View, Text, StyleSheet } from "react-native";
import type { DayGroup as DayGroupType } from "@/types/schedule";
import EventCard from "./EventCard";

interface DayGroupProps {
  day: DayGroupType;
}

export default function DayGroup({ day }: DayGroupProps) {
  return (
    <View style={styles.container}>
      {/* Day header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{day.displayDate}</Text>
      </View>

      {/* Events */}
      <View style={styles.eventsContainer}>
        {day.events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  eventsContainer: {
    padding: 12,
    paddingTop: 0,
    gap: 10,
  },
});
