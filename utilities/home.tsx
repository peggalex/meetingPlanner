export type CalendarMonth = Array<Array<number|null>>;

export type CalendarYear = {
    months: Array<CalendarMonth>;
    year: number;
}
  
export type Calendar = Array<CalendarYear>;

export const WeekdaysFull = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
export const Weekdays = WeekdaysFull.map(s => s.substring(0,3));