import { useCallback } from 'react'
import globalStyles from '../../../styles/global.module.css';
import styles from '../../../styles/components/page/create/Counter.module.css';
import Icons from '../../../utilities/icons';
import { getClassName } from '../../../utilities/global';

const Counter = ({counterIndex, counterEntries, setCounterIndex, width}: {counterIndex: number, counterEntries: Array<string|number>, setCounterIndex: (newMonthYearIndex: number)=>void, width?: string}) => {

    const decrementIndex = useCallback(() => {
        setCounterIndex(Math.max(counterIndex - 1, 0));
    }, [counterIndex, setCounterIndex]);

    const incrementIndex = useCallback(() => {
        setCounterIndex(Math.min(counterIndex + 1, counterEntries.length - 1));
    }, [counterEntries.length, counterIndex, setCounterIndex]);

    return <div className={getClassName(globalStyles.centerAll, styles.counter)} style={{width: width ?? 'auto'}}>
        <button 
            className={globalStyles.centerAll} 
            onClick={decrementIndex} 
            disabled={counterIndex == 0}
        >{Icons.left}</button>
        <p>{counterEntries[counterIndex]}</p>
        <button 
            className={globalStyles.centerAll} 
            onClick={incrementIndex} 
            disabled={counterIndex == counterEntries.length-1}
        >{Icons.right}</button>
    </div>
}

export default Counter;