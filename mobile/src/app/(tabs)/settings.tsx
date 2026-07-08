import { View, Text } from "react-native";

export default function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Paramètres</Text>
      <Text style={{ marginTop: 20, fontSize: 16 }}>
        Settings screen content goes here
      </Text>
    </View>
  );
}
