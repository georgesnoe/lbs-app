import { Host, Picker } from "@expo/ui";
import { View, StyleSheet } from "react-native";

interface Level {
  code: string;
  label: string;
}

interface LevelSelectorProps {
  levels: Level[];
  selectedLevel: string | null;
  onSelectLevel: (code: string | null) => void;
}

export default function LevelSelector({
  levels,
  selectedLevel,
  onSelectLevel,
}: LevelSelectorProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.pickerContainer}>
        <Host matchContents>
          <Picker
            selectedValue={selectedLevel ?? ""}
            onValueChange={(value) =>
              onSelectLevel(value === "" ? null : value)
            }
          >
            <Picker.Item label="Sélectionne un niveau" value="" />
            {levels.map((level) => (
              <Picker.Item
                key={level.code}
                label={level.label}
                value={level.code}
              />
            ))}
          </Picker>
        </Host>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
  },
  pickerContainer: {
    alignItems: "center",
  },
});
