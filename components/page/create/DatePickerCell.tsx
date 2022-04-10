
import globalStyles from '../../../styles/global.module.css';
import styles from '../../../styles/components/page/create/DatePickerCell.module.css';
import { getClassName, getDayStr } from '../../../utilities/global';

const CalendarPickerCell = ({day, isSelected}: {
    day: number
    isSelected: boolean
}) => {
  
    return (
      <button 
        className={getClassName(globalStyles.centerAll, styles.cell)} 
        data-selected={isSelected}
      >
          <p>{getDayStr(day)}</p>
      </button>
    )
  }
  
  export default CalendarPickerCell