export interface AppSettings {
  /** Offset from the current week (0 = current, 1 = next, -1 = previous, etc.) */
  weekOffset: number;
  /** Style de navigation de la semaine dans le planning */
  weekNavigationStyle: "arrows" | "picker" | "both";
  /** Permet de naviguer librement dans toutes les semaines */
  freeNavigation: boolean;
  /** Niveau pré-sélectionné dans le planning (null = aucun) */
  defaultLevel: string | null;
  /** Activer les notifications de rappel de cours */
  notificationsEnabled: boolean;
  /** Thème : "system" suit le système, "light" ou "dark" */
  theme: "system" | "light" | "dark";
}

export const DEFAULT_SETTINGS: AppSettings = {
  weekOffset: 0,
  weekNavigationStyle: "arrows",
  freeNavigation: true,
  defaultLevel: null,
  notificationsEnabled: false,
  theme: "system",
};
