import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Host, Picker, Switch } from "@expo/ui";
import { useSettings } from "@/hooks/useSettings";
import { LevelSelector } from "@/components/planning";
import { ALL_LEVELS } from "@/types/levels";

export default function SettingsScreen() {
  const { settings, updateSettings, loading } = useSettings();

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#0A84FF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Paramètres</Text>

        {/* --- Navigation de semaine --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Navigation de la semaine</Text>
          <View style={styles.pickerRow}>
            <Text style={styles.pickerRowLabel}>Style de navigation</Text>
            <Host matchContents>
              <Picker
                selectedValue={settings.weekNavigationStyle ?? "arrows"}
                onValueChange={(value) =>
                  updateSettings({
                    weekNavigationStyle: value as "arrows" | "picker" | "both",
                  })
                }
              >
                <Picker.Item label="Flèches" value="arrows" />
                <Picker.Item label="Sélecteur de semaine" value="picker" />
                <Picker.Item label="Les deux" value="both" />
              </Picker>
            </Host>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Navigation libre</Text>
            <Host matchContents>
              <Switch
                value={settings.freeNavigation ?? true}
                onValueChange={(checked) =>
                  updateSettings({ freeNavigation: checked })
                }
              />
            </Host>
          </View>
        </View>

        {/* --- Niveau par défaut --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Niveau par défaut</Text>
          <Text style={styles.sectionDescription}>
            Le niveau sera automatiquement sélectionné dans le planning.
          </Text>
          <LevelSelector
            levels={ALL_LEVELS}
            selectedLevel={settings.defaultLevel}
            onSelectLevel={(code) => updateSettings({ defaultLevel: code })}
          />
        </View>

        {/* --- Notifications --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications de rappel</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              {settings.notificationsEnabled ? "Activées" : "Désactivées"}
            </Text>
            <Host matchContents>
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={(checked) =>
                  updateSettings({ notificationsEnabled: checked })
                }
              />
            </Host>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  content: {
    padding: 16,
    gap: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  sectionDescription: {
    fontSize: 13,
    color: "#8E8E93",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
  },
  rowLabel: {
    fontSize: 15,
  },
  pickerRow: {
    alignItems: "center",
    gap: 4,
  },
  pickerRowLabel: {
    fontSize: 15,
    color: "#8E8E93",
    marginBottom: 2,
    alignSelf: "flex-start",
  },
});
