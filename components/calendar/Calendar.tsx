import { useContext, useMemo } from "react";
import { dateToYMD, getClassName, ScheduleDay, strToDate } from "../../utilities/global";
import CalendarDay from "./CalendarDay";

import globalStyles from "../../styles/global.module.css";
import styles from "../../styles/components/calendar/Calendar.module.css";
import MeetingContext from "../../utilities/MeetingContext";

const Calendar = () => {

    const { sortedDates, setDates } = useContext(MeetingContext);

    const dateRuns = useMemo(() => {

        const newDateRuns: Array<Array<ScheduleDay>> = [];

        for (let sortedDate of sortedDates){
            const [year, month, day] = dateToYMD(strToDate(sortedDate.date));

            const prevRunLastDateStr = newDateRuns.at(-1)?.at(-1)?.date; // get the last date from the previous run
            const prevRunLastDate = prevRunLastDateStr !== undefined ? strToDate(prevRunLastDateStr) : undefined;
            const prevRunNextDate = new Date(prevRunLastDate ?? 0); // copy the date so we can mutate it
            prevRunNextDate.setDate((prevRunLastDate?.getDate() ?? 0) + 1); // add one to the copied date, making this date equal to the next in the run
            const [nextYear, nextMonth, nextDay] = dateToYMD(prevRunNextDate);
            if (!(nextYear === year && nextMonth === month && nextDay === day)){
                newDateRuns.push([]); // if the current date isn't in the previous run, start a new run
            }
            newDateRuns.at(-1)?.push(sortedDate);
        }
        return newDateRuns;
    }, [sortedDates]);

    return <div className={getClassName(globalStyles.row, styles.calendar)}>
        <div className={getClassName(globalStyles.row)}>
            {dateRuns.map((dateRun, i) => <div className={getClassName(globalStyles.row)} key={i}>
                <div className={getClassName(globalStyles.row, styles.dayRun)}>
                    {dateRun.map((d, j) => <CalendarDay day={d} key={j}/>)}
                </div>
                {i !== dateRuns.length - 1 && <div className={styles.runSeparator} key={`${i}seperator`}/>}
            </div>)}
        </div>
    </div>
}

export default Calendar;