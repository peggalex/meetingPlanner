import { useState } from "react";
import Icons from "../../utilities/icons";

import globalStyles from '../../styles/global.module.css';
import styles from '../../styles/components/Accordion.module.css';
import { getClassName } from "../../utilities/global";

const Person = ({name}: {name: string}) => <p>{name}</p>;


const Accordion = ({icon, title, people}: {icon: JSX.Element, title: string, people: string[]}) => {
    const [isClosed, setIsClosed] = useState(false);

    return <div className={styles.accordion}>
        <div onClick={() => setIsClosed(!isClosed)} className={getClassName(globalStyles.row, globalStyles.centerCross, globalStyles.clickable, styles.accordionHeader)}>
            <div className={styles.iconContainer}>{icon}</div>
            <p className={styles.headerTitle}>{title} </p>
            <p className={styles.headerCount}>• {people.length}</p>
            <button>
                {isClosed ? Icons.down : Icons.up}
            </button>
        </div>
        {isClosed && <div className={styles.accordionContent}>{people.length === 0 ? <p><i>no {title} users</i></p>: people.map(p => <Person name={p} key={p}/>)}</div>}
    </div>
}

export default Accordion;