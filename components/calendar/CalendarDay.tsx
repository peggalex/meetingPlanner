import { useContext, useMemo } from "react";
import { dateToYMD, getClassName, getDayStr, getMonth, minutesToTime, ScheduleDay, strToDate, timeToMinutes, timeToStr } from "../../utilities/global";
import CalendarTime from "./CalendarTime";
import MeetingContext from "../../utilities/MeetingContext";


import styles from '../../styles/components/calendar/CalendarDay.module.css';
import globalStyles from '../../styles/global.module.css';
import { CalendarCellWrapperContext } from "../page/Page";
import { WeekdaysFull } from "../../utilities/home";

const CalendarDay = ({day: {date, times}}: {day: ScheduleDay}) => {

    const { earliestLatestTimes: {earliestTime, latestTime} } = useContext(MeetingContext);
    const CalendarCellWrapper = useContext(CalendarCellWrapperContext)!;

    const [y, m, d] = useMemo(() => dateToYMD(strToDate(date)), [date]);

    const timeElements = useMemo(() => {

        const newTimeElements = [];
        let i = 0;
        for (let minutes = earliestTime; minutes <= latestTime && i < times.length; minutes+=30){

            const time = times.at(i)!;
            const timeMinutes = timeToMinutes(time.hour, time.minute);
            const isEmpty = timeMinutes !== minutes; // => minutes < timeMinutes

            const timeStr = `${timeToStr(...minutesToTime(minutes))} - ${timeToStr(...minutesToTime(minutes+30))}`;

            newTimeElements.push(!isEmpty ?
                <CalendarCellWrapper title={timeStr} year={y} month={m} day={d} timeMinutes={timeMinutes} key={timeStr}>
                    <CalendarTime dateStr={date} minutes={minutes} isEmpty={isEmpty}/>
                </CalendarCellWrapper> : <CalendarTime dateStr={date} minutes={minutes} isEmpty={isEmpty} key={timeStr}/>
            );

            if (!isEmpty){
                i++;
            } // must happen after we use i in the deleteTime func
        }
        return newTimeElements;
    }, [earliestTime, latestTime, times, CalendarCellWrapper, y, m, d, date]);

    const dayOfWeek = useMemo(() => WeekdaysFull[strToDate(date).getDay()], [date]);

    return <div className={getClassName(styles.calendarDay, globalStyles.col)}>
        <div className={styles.calendarDayHeader}>
            <p>{y}</p>
            <p>{getMonth(m, true)} {getDayStr(d)}</p>
            <p>{dayOfWeek}</p>
        </div>
        <div className={styles.calendarDayTimes}>
            {timeElements}
        </div>
    </div>
}

export default CalendarDay;