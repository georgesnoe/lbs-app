import { Ionicons } from "@expo/vector-icons";
import { NativeTabs } from "expo-router/build/native-tabs";

export default function TabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="schedule">
        <NativeTabs.Trigger.Label>Planning</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: (
              <NativeTabs.Trigger.VectorIcon
                family={Ionicons}
                name="calendar-number-outline"
              />
            ),
            selected: (
              <NativeTabs.Trigger.VectorIcon
                family={Ionicons}
                name="calendar-number"
              />
            ),
          }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Label>Rechercher</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: (
              <NativeTabs.Trigger.VectorIcon
                family={Ionicons}
                name="search-outline"
              />
            ),
            selected: (
              <NativeTabs.Trigger.VectorIcon family={Ionicons} name="search" />
            ),
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
