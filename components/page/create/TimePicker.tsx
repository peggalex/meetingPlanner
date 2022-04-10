import { useCallback, useEffect, useState } from "react";

import styles from '../../../styles/components/page/create/TimePicker.module.css';
import { getRoundTime, minutesToTime, parseTime, timeToMinutes, timeToStr } from "../../../utilities/global";
import Icons from "../../../utilities/icons";


const TimePicker = ({title, time, setTime, minTime, maxTime}: {title: string, time: string, setTime: (newTime: string) => void, minTime?: string, maxTime?: string}) => {

    const [_time, _setTime] = useState(time);

    useEffect(() => _setTime(time), [time]);

    const onBlur = useCallback(() => {
        const [hour, minute] = parseTime(_time);
        let roundTimeMinutes = timeToMinutes(...getRoundTime(hour, minute)); // first, get rounded time
        if (minTime != null){
            const minTimeMinutes = timeToMinutes(...parseTime(minTime));
            if (roundTimeMinutes <= minTimeMinutes){
                roundTimeMinutes = minTimeMinutes + 30; // if we're not larger than the min time, add 30 mins to min time
            }
        } else if (maxTime != null){
            const maxTimeMinutes = timeToMinutes(...parseTime(maxTime));
            if (maxTimeMinutes <= roundTimeMinutes){
                roundTimeMinutes = maxTimeMinutes - 30; // if we're not smaller than the max time, minus 30 mins from max time
            }
        }
        const newTimeStr = timeToStr(...minutesToTime(roundTimeMinutes));
        newTimeStr != time ? setTime(newTimeStr) : _setTime(newTimeStr); 
        // why do we need to call _setTime() manually here? because newTimeStr might be the same as time, so no diff will happen, meaning the effect wont trigger
    }, [_time, maxTime, minTime, setTime, time]);

    return <div className={styles.timePicker}>
        <input 
            type="time" step={`${30 * 60}`} 
            value={_time} 
            onChange={(e) => _setTime(e.target.value)} 
            onBlur={onBlur}
        />
        <h3>{title}</h3>
        {Icons.clock}
    </div>
}

export default TimePicker;