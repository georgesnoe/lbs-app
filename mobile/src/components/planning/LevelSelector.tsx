import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";

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
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLabel = selectedLevel
    ? (levels.find((l) => l.code === selectedLevel)?.label ?? selectedLevel)
    : "Sélectionne un niveau";

  return (
    <>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.triggerText,
            !selectedLevel && styles.triggerPlaceholder,
          ]}
          numberOfLines={1}
        >
          {selectedLabel}
        </Text>
        <Text style={styles.chevron}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Niveau</Text>
            <FlatList
              data={levels}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.item,
                    selectedLevel === item.code && styles.itemSelected,
                  ]}
                  onPress={() => {
                    onSelectLevel(item.code);
                    setModalVisible(false);
                  }}
                  activeOpacity={0.6}
                >
                  <Text
                    style={[
                      styles.itemText,
                      selectedLevel === item.code && styles.itemTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {selectedLevel === item.code && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minWidth: 200,
  },
  triggerText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000000",
    flexShrink: 1,
  },
  triggerPlaceholder: {
    color: "#8E8E93",
  },
  chevron: {
    fontSize: 10,
    color: "#8E8E93",
    marginLeft: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    width: "80%",
    maxHeight: "60%",
    overflow: "hidden",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemSelected: {
    backgroundColor: "#F2F2F7",
  },
  itemText: {
    fontSize: 16,
    color: "#000000",
  },
  itemTextSelected: {
    fontWeight: "600",
    color: "#0A84FF",
  },
  checkmark: {
    fontSize: 16,
    color: "#0A84FF",
    fontWeight: "700",
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E5EA",
    marginHorizontal: 16,
  },
});
