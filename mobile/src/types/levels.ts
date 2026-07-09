/**
 * Niveaux possibles à l'akwaba School of Management.
 * Liste statique exhaustive — extraite de l'API schedules.
 */
export interface LevelInfo {
  code: string;
  label: string;
}

export const ALL_LEVELS: LevelInfo[] = [
  // Bachelor 1
  { code: "B1 M - A", label: "B1 M - A" },
  { code: "B1 M - B", label: "B1 M - B" },
  { code: "B1 M - C", label: "B1 M - C" },
  { code: "B1 M - D", label: "B1 M - D" },
  { code: "B1 SI - A", label: "B1 SI - A" },
  { code: "B1 SI - B", label: "B1 SI - B" },

  // Bachelor 2
  { code: "B2 M - A", label: "B2 M - A" },
  { code: "B2 M - B", label: "B2 M - B" },
  { code: "B2 SI - A", label: "B2 SI - A" },
  { code: "B2 SI - B", label: "B2 SI - B" },

  // Bachelor 3
  { code: "B3 M - BA", label: "B3 M - Banque Assurance" },
  { code: "B3 M - LOG", label: "B3 M - Logistique" },
  { code: "B3 M - MARK", label: "B3 M - Marketing" },
  { code: "B3 SI - GL", label: "B3 SI - Génie Logiciel" },
  { code: "B3 SI - RX", label: "B3 SI - Réseaux" },

  // Master 1
  { code: "M1 M - JOUR", label: "M1 M - Jour" },
  { code: "M1 M - SOIR", label: "M1 M - Soir" },
  { code: "M1 SI - JOUR", label: "M1 SI - Jour" },
  { code: "M1 SI - SOIR", label: "M1 SI - Soir" },

  // Master 2
  { code: "M2 M - AF", label: "M2 M - Audit Finance" },
  { code: "M2 M - LOG", label: "M2 M - Logistique" },
  { code: "M2 M - MK", label: "M2 M - Marketing" },
  { code: "M2 SI - SOIR", label: "M2 SI - Soir" },
];

/**
 * Helper: check if a given level has any events in a schedule dataset.
 */
export function hasLevelEvents(
  schedules: { extendedProps: { levelsCodes?: string } }[],
  levelCode: string,
): boolean {
  return schedules.some((event) =>
    (event.extendedProps.levelsCodes ?? "").split(", ").includes(levelCode),
  );
}
