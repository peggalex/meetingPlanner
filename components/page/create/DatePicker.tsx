
import { useCallback, useContext, useMemo, useState } from 'react'
import { dateToStr, getClassName, longMonths } from '../../../utilities/global';
import { Calendar, Weekdays } from '../../../utilities/home'
import CalendarPickerCell from './DatePickerCell'

import globalStyles from '../../../styles/global.module.css';
import styles from '../../../styles/components/page/create/DatePicker.module.css';
import { CalendarContext } from './DateTimePicker';
import DraggableClickWrapper from '../../DraggableClickWrapper';
import MeetingContext from '../../../utilities/MeetingContext';


const DatePicker = ({calendar}: {calendar: Calendar}) => {

    const { selectedDates, setSelectedDates, yearIndex, monthIndex } = useContext(CalendarContext);
    const { dates } = useContext(MeetingContext);

    const month = useMemo(
        () => calendar[yearIndex].months[monthIndex], 
        [calendar, monthIndex, yearIndex]
    );

    const encodeDay = useCallback(
        (day: number) => dateToStr(calendar[yearIndex].year, monthIndex, day), 
        [calendar, monthIndex, yearIndex]
    );

    const toggleDay = useCallback((day: number) => {
        const key = encodeDay(day);
        setSelectedDates((prevSelectedDates) => {
            const newSelectedDates = new Set(prevSelectedDates);
            newSelectedDates.has(key) ? newSelectedDates.delete(key) : newSelectedDates.add(key);
            return newSelectedDates;
        });
    }, [encodeDay, setSelectedDates]);

    const tableHeader = useMemo(() => <thead><tr>
        {Weekdays.map(wd => <th key={wd}>
            <div className={globalStyles.centerAll}>
                <p>{wd}</p>
            </div>
        </th>)}
    </tr></thead>, []);

    const getCell = useCallback((day) => 
        <DraggableClickWrapper clickHandler={() => toggleDay(day)}>
            <CalendarPickerCell day={day!} 
                isSelected={selectedDates.has(encodeDay(day))} 
            />
        </DraggableClickWrapper>,
        [encodeDay, selectedDates, toggleDay]
    );

    const tableBody = useMemo(() => <tbody>
        {month.map((week, i) => <tr key={i}>
            {week.map((day, j) => <td key={j}>
                {!(day == null || dates.has(encodeDay(day))) && getCell(day)}
            </td>)}
        </tr>)}
    </tbody>, [dates, encodeDay, getCell, month]);
    

    return <div className={styles.calendarPicker}>
        <table>
            {tableHeader}
            {tableBody}
        </table>
    </div>
  }
  
  export default DatePicker