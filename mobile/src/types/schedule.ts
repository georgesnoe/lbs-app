export interface ScheduleEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: {
    type: "course" | "exam";
    sessionType: "course" | "resit" | "exam";
    sessionLabel: string | null;
    isExamSession: boolean;
    examId: string | null;
    scheduleId: number;
    scheduleIds: number[];
    module: string;
    moduleCode: string;
    moduleId: number;
    teacher: string;
    teacherId: number;
    room: string;
    rooms: string[];
    roomIds: number[];
    roomId: number;
    levels: string;
    levelsCodes: string;
    levelIds: number[];
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    totalStudents: number;
    roomCapacity: number;
    capacityExceeded: boolean;
  };
}

export interface RoomInfo {
  name: string;
  id: number;
  capacity: number;
}

export interface Availability {
  totalCapacity: number;
  usedCapacity: number;
  available: number;
}

export interface DayGroup {
  dateKey: string;
  displayDate: string;
  events: ScheduleEvent[];
}
