import { createContext, useCallback, useContext, useMemo, useState } from "react";
import MeetingContext from "./MeetingContext";
import { dateToStr, timeToMinutes } from "./global";
import { MeetingTime } from "./types/sharedTypes";

const SelectedTimeContext = createContext({} as { 
    year: number|undefined,
    month: number|undefined,
    day: number|undefined,
    timeMinutes: number|undefined,
    selectedTime: MeetingTime|undefined,
    hasSelectedTime: boolean,
    toggleSelectedTime: (y: number, m: number, d: number, timeMinutes: number) => void,
    timeIsSelected: (y: number, m: number, d: number, timeMinutes: number) => boolean,
  });
  
export default SelectedTimeContext;

export const SelectedTimeContextProvider = ({children}: {children: any}) => {

    const { sortedDates } = useContext(MeetingContext);
    const [selectedTimeObj, setSelectedTimeObj] = useState<{y: number, m: number, d: number, timeMinutes: number}|null>(null);

	const selectedTime = useMemo(() => {
		if (selectedTimeObj === null) return undefined;
        const {y, m, d, timeMinutes} = selectedTimeObj;
        const dateStr = dateToStr(y,m,d);
		return sortedDates
			.find(d => d.date === dateStr)?.times
			?.find?.(t => timeMinutes === timeToMinutes(t.hour, t.minute));
	}, [selectedTimeObj, sortedDates]);

    const timeIsSelected = useCallback((y2: number, m2: number, d2: number, timeMinutes2: number) => {
        const {y, m, d, timeMinutes} = selectedTimeObj ?? {};
        return y===y2 && m===m2 && d===d2 && timeMinutes===timeMinutes2;
    }, [selectedTimeObj]);

    const toggleSelectedTime = useCallback((y: number, m: number, d: number, timeMinutes: number) => {
        setSelectedTimeObj(timeIsSelected(y,m,d,timeMinutes) ? null : {y,m,d,timeMinutes});
    }, [timeIsSelected]);

    const { y: year, m: month, d: day, timeMinutes } = selectedTimeObj ?? {};

    return <SelectedTimeContext.Provider value={{year, month, day, timeMinutes, hasSelectedTime: selectedTimeObj !== null, selectedTime, toggleSelectedTime, timeIsSelected}}>
        {children}
    </SelectedTimeContext.Provider>;
}