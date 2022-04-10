import { useContext } from "react";
import { getClassName, getDaySuffix, getDisplayTime, getMonth } from "../../../utilities/global"
import SelectedTimeContext from "../../../utilities/SelectedTimeContext";

import globalStyles from  "../../../styles/global.module.css";
import styles from "../../../styles/components/page/view/SelectedDateTime.module.css";

const SelectedDateTime = () => {

    const { year, month, day, timeMinutes, hasSelectedTime } = useContext(SelectedTimeContext);

    if (!hasSelectedTime) return null;

    return <div className={getClassName(globalStyles.col)}>
        <div className={getClassName(globalStyles.row, styles.dateRow)}>
            <span className={styles.month} >{getMonth(month!, true)}</span>
            <div className={getClassName(globalStyles.row)}>
                <span className={styles.day}>{day}</span>
                <span className={styles.daySuffix}>{getDaySuffix(day!)}</span>
            </div>
            <span className={styles.bullet}>•</span>
            <span className={styles.year}>{year}</span>
        </div>
        <span className={styles.time}>{getDisplayTime(timeMinutes!)} - {getDisplayTime(timeMinutes!+30)}</span>
    </div>
}

export default SelectedDateTime;