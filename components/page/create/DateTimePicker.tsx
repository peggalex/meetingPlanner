import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Calendar } from "../../../utilities/home";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";

import globalStyles from "../../../styles/global.module.css";
import styles from "../../../styles/components/page/create/DateTimePicker.module.css";
import Counter from "./Counter";
import { getClassName, longMonths, minutesToTime, parseTime, ScheduleTime, strToDate, timeToMinutes } from "../../../utilities/global";
import PanelContainer from "../PanelContainer";
import MeetingContext from "../../../utilities/MeetingContext";
import AddButton from "../../AddButton";

const getFirstMonth = (calendar: Calendar) => {
    const clientDate = new Date();
    const clientYear = clientDate.getFullYear();
    const serverYear = calendar[0].year;
    return clientYear === serverYear ? clientDate.getMonth() : 0; 
    // could be a situation where serverDate is 2022/1/1 and clientDate is 2021/12/31 or vice versa
}

type CalendarContextType = {
    selectedDates: Set<string>;
    setSelectedDates: (setState: (prevSelectedDates: Set<string>) => Set<string>) => void;
    yearIndex: number;
    monthIndex: number;
}

export const CalendarContext = createContext({} as CalendarContextType);

const DateTimePicker = ({calendar}: { calendar: Calendar}) => {

    const { setDates } = useContext(MeetingContext);

    const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
    const [startTime, setStartTime] = useState('17:00');
    const [endTime, setEndTime] = useState('22:00');

    const [yearIndex, setYearIndex] = useState(0);
    const [monthIndex, setMonthIndex] = useState(getFirstMonth(calendar));
    
    const monthYearCounters = useMemo(() => <div className={getClassName(globalStyles.row, styles.monthYearContainer)}>
        <Counter 
            counterIndex={yearIndex} 
            counterEntries={calendar.map(y => y.year)} 
            setCounterIndex={setYearIndex} 
            width='7rem'
        />
        <Counter 
            counterIndex={monthIndex} 
            counterEntries={longMonths} 
            setCounterIndex={setMonthIndex} 
            width='10rem'
        />
    </div>, [calendar, monthIndex, yearIndex]);

    const timePickers = useMemo(() => <div className={globalStyles.row}>
        <TimePicker title="start" time={startTime} setTime={setStartTime} maxTime={endTime}/>
        <TimePicker title="end" time={endTime} setTime={setEndTime} minTime={startTime}/>
    </div>, [endTime, startTime]);

    const [validationMsgObj, setValidationMsgObj] = useState({msg: ""});

    const addDateTimes = useCallback(() => setDates!((prevDates) => {

        if (selectedDates.size ===  0){
            setValidationMsgObj({msg: "No dates selected. Click on the calendar to select a date."});
            return prevDates;
        } else {
            setValidationMsgObj({msg: ""});
        }

        const times: Array<ScheduleTime> = [];
        const [startTimeMinutes, endTimeMinutes] = [startTime, endTime].map(t => timeToMinutes(...parseTime(t)));
        if (!(startTimeMinutes < endTimeMinutes)) throw Error(`start time ${startTime} is not less than end time ${endTime}`);
        for (let t = startTimeMinutes; t < endTimeMinutes; t+=30){
            const [hour, minute] = minutesToTime(t);
            times.push({ hour, minute });
        }

        const newDates = new Map(prevDates);

        selectedDates.forEach(d => newDates.set(d, {
            date: d, 
            times: times.map(t => ({ ...t, available: [] }))
        })); 

        setSelectedDates(new Set<string>()); // empty selected dates
        return newDates;
    }), [endTime, selectedDates, setDates, startTime]);

    return <CalendarContext.Provider value={{
        selectedDates,
        setSelectedDates,
        yearIndex,
        monthIndex,
    }}>
        <PanelContainer title="add date">
            <div className={styles.dateTimePicker}>
                {monthYearCounters}
                <DatePicker calendar={calendar}/>
                {timePickers}
                <AddButton onClick={addDateTimes} validationMsgObj={validationMsgObj}/>
            </div>
        </PanelContainer>
    </CalendarContext.Provider>
}

export default DateTimePicker;