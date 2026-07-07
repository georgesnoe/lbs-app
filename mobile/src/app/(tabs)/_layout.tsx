import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Planning",
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Ionicons name="calendar" size={size} color={color} />
            ) : (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Paramètres",
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Ionicons name="settings" size={size} color={color} />
            ) : (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
