import { createContext, useMemo, useState } from "react";
import { MeetingDays, ScheduleDay, ScheduleDays, strToDate, timeToMinutes } from "./global";
import { MeetingDay } from "./types/sharedTypes";

const MeetingContext = createContext({} as { 
    dates: MeetingDays, 
    setDates?: (setStateFunc: (prevDates: MeetingDays) => MeetingDays) => void,
    sortedDates: Array<MeetingDay>, 
    earliestLatestTimes: { earliestTime: number, latestTime: number },
    title: string,
    setTitle?: (prevTitle: string) => void,
	totalUsers: number, 	
	userToHasPassword: {[username: string]: boolean},
	isEditMode: boolean,
	setIsEditMode: (isEditMode: boolean) => void,
  });
  
export default MeetingContext;

export const MeetingContextProvider = (
	{title, setTitle, dates, setDates, children, userToHasPassword: _userToHasPassword}: 
	{title: string, setTitle?: (newTitle: string) => void, dates: MeetingDays, setDates?: (setStateFunc: (prevDates: MeetingDays) => MeetingDays) => void, children: any, userToHasPassword?: {[username: string]: boolean}, }
) => {

	const userToHasPassword: {[username: string]: boolean} = useMemo(() => _userToHasPassword ?? {}, [_userToHasPassword]);
	const totalUsers = useMemo(() => Object.keys(userToHasPassword).length, [userToHasPassword]);

	const [isEditMode, setIsEditMode] = useState(false);

  	const sortedDates = useMemo(() => Array.from(dates.values())
		.sort((a,b) => 
			strToDate(a.date).getTime() - strToDate(b.date).getTime()
		), [dates]);

	const earliestLatestTimes = useMemo(() => {
		let earliestTime = null,
		latestTime = null;
	
		for (let { times } of Array.from(sortedDates.values())){
			if (0 < times.length){
	
			let [nextEarliestTime, nextLatestTime] = [0, -1]
				.map(index => times.at(index)!)
				.map(({hour, minute}) => timeToMinutes(hour, minute));
	
			earliestTime = Math.min(nextEarliestTime, earliestTime ?? Infinity);
			latestTime = Math.max(nextLatestTime, latestTime ?? -Infinity);
			}
		}
		return { earliestTime: earliestTime ?? 0, latestTime: latestTime ?? 0 };
	}, [sortedDates]);

  return <MeetingContext.Provider value={{dates, setDates, sortedDates, earliestLatestTimes, title, setTitle, totalUsers: totalUsers ?? 0, userToHasPassword, isEditMode, setIsEditMode}}>
    {children}
  </MeetingContext.Provider>;
}