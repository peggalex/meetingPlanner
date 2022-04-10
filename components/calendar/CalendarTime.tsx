import globalStyles from '../../styles/global.module.css';
import styles from '../../styles/components/calendar/CalendarTime.module.css';
import { getClassName, getDisplayTime, minutesToTime, timeToMinutes } from '../../utilities/global';
import { useContext, useEffect, useMemo } from 'react';
import MeetingContext from '../../utilities/MeetingContext';


function hexToRgb(hex: string): number[] {
    console.log({hex, hi: 'bye'});
    const normal = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    return normal!.slice(1).map(e => parseInt(e, 16));
}

const minPercent = 0;
// these colors are generated using getImageGradient.py and copy/pasted here
const colors = ['(163, 234, 204)', '(86, 211, 151)', '(89, 212, 150)', '(91, 213, 151)', '(93, 213, 150)', '(96, 214, 149)', '(99, 215, 150)', '(103, 215, 149)', '(105, 215, 148)', '(108, 217, 149)', '(111, 217, 148)', '(114, 217, 148)', '(117, 218, 148)', '(121, 219, 148)', '(123, 219, 146)', '(127, 220, 145)', '(130, 221, 146)', '(133, 221, 145)', '(136, 221, 144)', '(140, 222, 145)', '(143, 222, 144)', '(146, 223, 144)', '(149, 224, 144)', '(154, 225, 143)', '(156, 225, 143)', '(160, 226, 143)', '(164, 226, 142)', '(167, 226, 141)', '(170, 227, 141)', '(175, 228, 141)', '(177, 228, 140)', '(181, 229, 140)', '(185, 230, 140)', '(188, 230, 139)', '(192, 231, 139)', '(196, 231, 139)', '(199, 231, 137)', '(203, 232, 137)', '(207, 233, 137)', '(210, 233, 136)', '(214, 234, 136)', '(218, 235, 136)', '(222, 236, 136)', '(224, 236, 134)', '(229, 237, 134)', '(232, 237, 134)', '(235, 237, 133)', '(239, 238, 133)', '(244, 239, 133)', '(246, 239, 132)', '(250, 240, 133)', '(252, 239, 133)', '(252, 238, 133)', '(252, 236, 133)', '(252, 235, 134)', '(251, 233, 134)', '(251, 231, 135)', '(251, 231, 136)', '(251, 229, 137)', '(251, 227, 138)', '(251, 226, 138)', '(251, 223, 139)', '(250, 222, 139)', '(251, 222, 140)', '(250, 220, 141)', '(249, 218, 142)', '(250, 217, 143)', '(250, 215, 143)', '(249, 214, 143)', '(249, 211, 144)', '(250, 210, 145)', '(249, 208, 145)', '(249, 207, 146)', '(249, 207, 146)', '(249, 205, 146)', '(248, 203, 148)', '(248, 201, 149)', '(248, 199, 149)', '(248, 198, 150)', '(248, 197, 151)', '(248, 195, 151)', '(248, 193, 151)', '(248, 192, 152)', '(248, 191, 153)', '(248, 189, 154)', '(248, 188, 155)', '(247, 186, 155)', '(246, 184, 155)', '(246, 183, 156)', '(247, 182, 157)', '(246, 180, 157)', '(246, 178, 158)', '(247, 177, 159)', '(246, 176, 159)', '(246, 174, 159)', '(247, 173, 160)', '(247, 171, 162)', '(246, 169, 162)', '(247, 169, 163)', '(246, 167, 164)']
const CalendarTime = ({dateStr, minutes, isEmpty}: {dateStr: string, minutes: number, isEmpty: boolean}) => {

    const { totalUsers, sortedDates } = useContext(MeetingContext);

	const timeObj = useMemo(() => 
        sortedDates
            .find(d => d.date === dateStr)?.times
            ?.find(t => timeToMinutes(t.hour, t.minute) === minutes), 
        [dateStr, minutes, sortedDates]
    );
	const opacity = useMemo(
        () => totalUsers === 0 ? 1 : minPercent+((1-minPercent)*(timeObj?.available?.length ?? 0) / totalUsers), 
        [totalUsers, timeObj]
    );

    const backgroundColor = useMemo(() => `rgb${colors[99-Math.round(opacity*99)]}`, [opacity]);
    useEffect(() => {
        console.log({backgroundColor});
    }, [backgroundColor]);
 
    const isDark = false;
    const displayTime = useMemo(() => getDisplayTime(minutes), [minutes]);

    return <div className={getClassName(styles.calendarTime, isDark ? styles.dark : '')} data-time={minutesToTime(minutes)} data-opacity={opacity.toFixed(2)}>
        {!isEmpty && (
            <div 
                style={{backgroundColor, color: 'blue'}}
                className={getClassName(globalStyles.col, globalStyles.spaceBetween)} 
                title={`${displayTime} - ${getDisplayTime(minutes+30)}`}
            >
                <p>30m</p>
                <p className={styles.time}>{displayTime}</p>
            </div>
        )}
    </div>
}

export default CalendarTime;