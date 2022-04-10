import { useContext } from 'react';

import globalStyles from '../../styles/global.module.css';
import styles from '../../styles/components/page/MeetingRouting.module.css';
import MeetingContext from '../../utilities/MeetingContext';

const MeetingRouting = () => {
    
    const { isEditMode, setIsEditMode } = useContext(MeetingContext);

    return <div className={globalStyles.row}>
        <button className={styles.meetingRouting} data-selected={!isEditMode} onClick={()=>setIsEditMode(false)}>view all</button>
        <button className={styles.meetingRouting} data-selected={isEditMode} onClick={()=>setIsEditMode(true)}>edit me</button>
    </div>
}

export default MeetingRouting;