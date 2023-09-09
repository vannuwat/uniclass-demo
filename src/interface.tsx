export interface ClassSchedule {
    class_order: number;
    en_time: string;
    st_time: string;
}

export interface ClassInfo {
    class_schedule: ClassSchedule[];
    edu_level: string;
    order_id: string;
    student_id: string;
    student_name: string;
    student_profile: string;
    subject: string;
    teacher_id: string;
    teacher_name: string;
}
  
export interface TimeSchedule {
    morning: string[];
    afternoon: string[];
    evening: string[];
    night: string[];
}

export interface UpdateSchedule {
      date: Date;
      schedule: string[];
}

export interface MiniCalendarProps {
    teacherSchedule: ClassInfo[];
    loading: boolean;
}

export interface TeacherScheduleProps {
    teacherSchedule: ClassInfo[];
    loading: boolean;
    screenWidth: number;
}

export interface BigCalendarPops{
    teacherSchedule: ClassInfo[];
    loading: boolean;
    screenWidth: number;
}

export interface DisplayDateCalendar{
    teacherSchedule: ClassInfo[];
    dateCalendar: Date;
}

export interface DisplayScheduleWeek{
    displayDates: Date[];
    teacherSchedule: ClassInfo[];
}