import type { RoomInfo, ScheduleEvent } from "@/types/schedule";

/**
 * Get the Monday of the current week (Monday = 0, Sunday = 6).
 */
export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Format a Date as YYYY-MM-DD.
 */
export function toISODate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Format an ISO string to HH:MM (French locale, 24h).
 */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Remove warning emoji (⚠️) from a title string.
 */
export function sanitizeTitle(title: string): string {
  return title.replace(/\u26a0\ufe0f?\s*/g, "");
}

/**
 * European day names in French, indexed by getDay() (0 = Sunday).
 */
const DAY_NAMES = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

const MONTH_NAMES = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

/**
 * Format a date as "Lundi 7 juillet 2026" in French.
 */
export function formatDayLabel(dateKey: string): string {
  const date = new Date(dateKey + "T00:00:00");
  const dayName = DAY_NAMES[date.getDay()];
  const dayNum = date.getDate();
  const monthName = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName} ${dayNum} ${monthName} ${year}`;
}

/**
 * Return all events for a given level / class.
 */
export function getLevelSchedule(
  schedules: ScheduleEvent[],
  levelCode: string,
): ScheduleEvent[] {
  return schedules.filter((event) =>
    (event.extendedProps.levelsCodes ?? "").split(", ").includes(levelCode),
  );
}

/**
 * Build the API URL for the current week.
 * @param weekOffset Décalage en semaines (0 = courant, 1 = suivante, -1 = précédente, etc.)
 */
export function getScheduleApiUrl(weekOffset: number = 0): string {
  const today = new Date();
  const monday = getMonday(today);
  monday.setDate(monday.getDate() + weekOffset * 7);
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);

  const params = new URLSearchParams({
    start: toISODate(monday),
    end: toISODate(sunday),
  });

  return `https://allnone.lome-bs.com/planning-view/student/schedules?${params}`;
}

/**
 * Extract the list of unique rooms from the schedule data.
 * Utilise le nom de la salle comme clé pour éviter les doublons,
 * même si un même événement référence plusieurs salles.
 */
export function getRooms(schedules: ScheduleEvent[]): RoomInfo[] {
  const seen = new Map<string, RoomInfo>();

  for (const event of schedules) {
    const { rooms, room, roomId, roomCapacity } = event.extendedProps;

    /* L'API peut lister plusieurs salles pour un même cours */
    const roomList = rooms && rooms.length > 0 ? rooms : room ? [room] : [];

    for (const roomName of roomList) {
      if (!roomName) continue;
      if (!seen.has(roomName)) {
        seen.set(roomName, {
          name: roomName,
          id: roomId,
          capacity: roomCapacity,
        });
      }
    }
  }

  return Array.from(seen.values());
}

/**
 * Return events that overlap with the [from, to[ time window.
 */
export function getEventsInRange(
  schedules: ScheduleEvent[],
  from: Date,
  to: Date,
): ScheduleEvent[] {
  const fromMs = from.getTime();
  const toMs = to.getTime();

  return schedules.filter((event) => {
    const eventStart = new Date(event.start).getTime();
    const eventEnd = new Date(event.end).getTime();
    return eventStart < toMs && eventEnd > fromMs;
  });
}

/**
 * Return all rooms that have no events in the given time window.
 * Prend en compte que chaque événement peut occuper plusieurs salles.
 */
export function getFreeRooms(
  schedules: ScheduleEvent[],
  from: Date,
  to: Date,
): RoomInfo[] {
  const allRooms = getRooms(schedules);
  const busyNames = new Set<string>();

  for (const event of getEventsInRange(schedules, from, to)) {
    const ep = event.extendedProps;
    /* Marquer toutes les salles de l'événement comme occupées */
    const eventRooms =
      ep.rooms && ep.rooms.length > 0 ? ep.rooms : ep.room ? [ep.room] : [];
    for (const r of eventRooms) {
      if (r) busyNames.add(r);
    }
  }

  return allRooms.filter((r) => !busyNames.has(r.name));
}

/**
 * Compute how many minutes remain until the next event starts in a given room.
 * Returns null if the room is free for the whole window, or if there are no events.
 */
export function getMinutesUntilNextEvent(
  schedules: ScheduleEvent[],
  roomName: string,
  from: Date,
): number | null {
  const roomEvents = schedules
    .filter((e) => e.extendedProps.room === roomName)
    .map((e) => ({
      start: new Date(e.start).getTime(),
      end: new Date(e.end).getTime(),
    }))
    .sort((a, b) => a.start - b.start);

  const now = from.getTime();

  // Find the currently running event (if any)
  const currentEvent = roomEvents.find((e) => e.start <= now && e.end > now);
  if (currentEvent) return 0; // Room is occupied

  // Find the next upcoming event
  const nextEvent = roomEvents.find((e) => e.start > now);
  if (!nextEvent) return null; // No upcoming event

  return Math.ceil((nextEvent.start - now) / 60_000);
}

/**
 * Format minutes into a human-readable string.
 */
export function formatMinutes(min: number): string {
  if (min < 1) return "< 1 min";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h} h ${m} min` : `${h} h`;
}
