import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontFamily: "GoogleSansText",
          fontWeight: 700,
        },
      }}
    >
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Planning",
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Ionicons name="calendar-number" size={size} color={color} />
            ) : (
              <Ionicons
                name="calendar-number-outline"
                size={size}
                color={color}
              />
            ),
        }}
      />
      <Tabs.Screen
        name="rooms"
        options={{
          title: "Salles",
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Ionicons name="business" size={size} color={color} />
            ) : (
              <Ionicons name="business-outline" size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Paramètres",
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Ionicons name="settings-sharp" size={size} color={color} />
            ) : (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
