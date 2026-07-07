import { View, Text } from "react-native";

export default function IndexScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Planning</Text>
      <Text style={{ marginTop: 20, fontSize: 16 }}>
        Planning screen content goes here
      </Text>
    </View>
  );
}
