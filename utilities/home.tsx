export type CalendarMonth = Array<Array<number|null>>;

export type CalendarYear = {
    months: Array<CalendarMonth>;
    year: number;
}
  
export type Calendar = Array<CalendarYear>;

export const Weekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];