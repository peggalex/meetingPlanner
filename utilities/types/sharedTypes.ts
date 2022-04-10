import { ScheduleTime } from "../global";

export type MeetingTime = ScheduleTime & {
    available: Array<string>;
};

export type MeetingDay = {
    date: string;
    times: Array<MeetingTime>;
};

export type Meeting = {
    title: string;
    sortedDates: Array<MeetingDay>;
};
