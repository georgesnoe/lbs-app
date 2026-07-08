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
    borderRadius: 12,
    overflow: "hidden",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F2F2F7",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  eventsContainer: {
    padding: 12,
    gap: 12,
  },
});
