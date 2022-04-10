import { useCallback, useContext, useMemo, useState } from "react";
import { dateToStr, dateToYMD, getClassName, getMonth, getRange, strToDate } from "../../../utilities/global";
import PanelContainer from "../PanelContainer";
import DatePickerCell from "./DatePickerCell";

import globalStyles from "../../../styles/global.module.css";
import styles from "../../../styles/components/page/create/SelectedDates.module.css";
import DeleteHoverWrapper from "../../DeleteHoverWrapper";
import MeetingContext from "../../../utilities/MeetingContext";

type DateGroup = {
    year: number;
    month: number;
    days: Array<number>;
}

const SelectedDates = () => {

    const { sortedDates, setDates } = useContext(MeetingContext);

    const deleteDate = useCallback((year: number, month: number, day: number) => {
        setDates!((prevSelectedDates) => {
            const newSelectedDates = new Map(prevSelectedDates);
            newSelectedDates.delete(dateToStr(year, month, day));
            return newSelectedDates;
        });
    }, [setDates]);

    const dateGroups = useMemo(() => {
        const newDateGroups: Array<DateGroup> = [];

        for (let { date } of sortedDates){
            const [year, month, day] = dateToYMD(strToDate(date));

            const lastDateGroup = newDateGroups.at(-1);
            if (!(lastDateGroup?.year === year && lastDateGroup?.month === month)){
                newDateGroups.push({ year, month, days: [] });
            }
            newDateGroups.at(-1)?.days.push(day);
        }
        return newDateGroups;
    }, [sortedDates]);


    return <PanelContainer title="dates">
        {dateGroups.length == 0 ? <p className={styles.noDatesMsg}><i>No dates selected yet.</i></p> : 
            <div className={getClassName(globalStyles.row, styles.dateGroupsContainer)}>
                {dateGroups.map(dg => {
                    if (dg.days.length === 0) return;
                    return <div key={JSON.stringify(dg)} className={getClassName(globalStyles.col, styles.dateGroup)}>
                        <p>
                            <span className={styles.dateGroupMonth}>{getMonth(dg.month, true)} • </span>
                            <span className={styles.dateGroupYear}>{dg.year}</span>
                        </p>
                        <div className={getClassName(globalStyles.row, styles.datesContainer)}>
                            {dg.days.map(d => <DeleteHoverWrapper 
                                title={`Remove date: ${dateToStr(dg.year, dg.month, d)}`}
                                onClick={() => deleteDate(dg.year, dg.month, d)} 
                                key={dateToStr(dg.year, dg.month, d)}
                            >
                                <DatePickerCell 
                                    day={d} 
                                    isSelected={false} 
                                />
                            </DeleteHoverWrapper>)}
                        </div>
                    </div>
                })}
            </div>
    }
    </PanelContainer>
}

export default SelectedDates;