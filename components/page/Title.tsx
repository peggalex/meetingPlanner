import {useCallback, useContext, useMemo} from 'react';

import MeetingContext from "../../utilities/MeetingContext";
import styles from "../../styles/components/page/Title.module.css";

const Title = () => {
    const {title: _title, setTitle: _setTitle} = useContext(MeetingContext);

    const canSetTitle = useMemo(() => _setTitle !==  undefined, [_setTitle]);
    const title = useMemo(() => decodeURI(_title), [_title]);

    const setTitle = useCallback((rawTitle: string) => {
        const safeTitle = encodeURI(rawTitle);
        _setTitle!(safeTitle);
    }, [_setTitle]);

    return <div className={styles.title}>
        <p>event title</p>
        {canSetTitle ? 
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="enter title here"/> : 
            <h2>{title}</h2>
        }
    </div>;
}

export default Title;