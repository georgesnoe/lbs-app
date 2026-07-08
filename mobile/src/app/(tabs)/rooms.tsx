import { useCallback } from "react";
import { RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LiveRooms from "@/components/LiveRooms";
import { useScheduleData } from "@/hooks/use-schedule-data";

export default function RoomsScreen() {
  const { data, loading, error, refresh } = useScheduleData();

  const onRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  return (
    <SafeAreaView style={styles.container}>
      <LiveRooms
        data={data}
        loading={loading}
        error={error}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
});
