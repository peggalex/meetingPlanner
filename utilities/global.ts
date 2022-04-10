var crypto = require('crypto');
import { MutableRefObject } from "react";
import { MeetingDay } from "./types/sharedTypes";

export type ScheduleTime  = {
    hour: number;
    minute: number;
}

export type ScheduleDay = {
    date: string;
    times: Array<ScheduleTime>;
}

export type ScheduleDays = Map<string, ScheduleDay>;
export type MeetingDays = Map<string, MeetingDay>;

export const hashString = (str: string) => crypto.createHash('sha256').update(str).digest('base64');

export const getClassName = (...args: Array<string>) => args.join(" ");

export const getRange = (range: number) => Array.from(Array(range)).map((_, i) => i);

export const getMonth = (monthIndex: number, isShort: boolean) => {
    const date = new Date(1, monthIndex);
    const formatter = new Intl.DateTimeFormat('default', { month: isShort ? 'short' : 'long'});
    return formatter.format(date);
}

export const shortMonths = getRange(12).map(i => getMonth(i, true));
export const longMonths = getRange(12).map(i => getMonth(i, false));

export const getDaySuffix = (day: number) => {
    if (10 < day && day < 20){
        return 'th';
    }
    switch (day%10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }

}
export const getDayStr = (day: number) => `${day}${getDaySuffix(day)}`;

export const dateToYMD = (date: Date): [number, number, number] => [date.getFullYear(), date.getMonth(), date.getDate()];
export const dateToStr = (y: number, m: number, d: number) => new Date(y, m, d).toDateString();
export const strToDate = (dateStr: string) => new Date(dateStr);

export const parseTime = (timeStr: string): [number, number] => {
    const timeRegex = timeStr.match(/(\d\d):(\d\d)/);
    if (!timeRegex) throw Error(`unexpected format for time '${timeStr}'`);
    const [_, hourStr, minuteStr] = Array.from(timeRegex!);
    return [hourStr, minuteStr].map(s => parseInt(s)) as [number, number];
}

export const timeToMinutes = (hour: number, minute: number) => (hour*60) + minute;
export const minutesToTime = (minutes: number): [number, number] => [Math.floor(minutes/60)%24, minutes%60];

export const getRoundTime = (hour: number, minute: number) => {
    let minutes = timeToMinutes(hour, minute);
    const roundedMinutes = Math.round(minutes/30)*30; 
    return minutesToTime(roundedMinutes);
}

export const timeToStr = (hour: number, minute: number) => {
    const [hourStr, minuteStr] = [hour, minute].map(i => i.toString().padStart(2, '0'));
    return `${hourStr}:${minuteStr}`;
}

export const getDisplayTime = (minutes: number) => {
    let [hour, minute] = minutesToTime(minutes);
    const isMorning = hour < 12;
    if (12 < hour){ // not the same as !isMorning, strict inequality
        hour -= 12;
    }
    return `${hour}:${minute.toString().padStart(2, '0')}${isMorning ? "am" : "pm"}`;
}

export const setValidationMsg = (ref: MutableRefObject<any>, message: string) => {
    ref!.current!.setCustomValidity(message);
    ref!.current!.reportValidity();
}

export const clearValidationMsg = (ref: MutableRefObject<any>) => setValidationMsg(ref, "");

const _makeRequest = (url: string, json?: any) => fetch(url, {
    method: json == null ? "GET" : "POST",
    body: JSON.stringify(json ?? {})
})

export async function makeRequest<TResponse>(url: string, json?: any): Promise<[TResponse|undefined, boolean, number]> {
    const res = await _makeRequest(url, json);
    let resJson: TResponse | undefined = undefined;
    try {
        resJson = await res.json() as TResponse;
    } catch {}
    return [resJson, res.ok, res.status];
};

export type CalendarCellWrapperType = React.FC<{
    title: string, 
    year: number, 
    month: number, 
    day: number, 
    timeMinutes: number, 
    children: any
  }>;
  