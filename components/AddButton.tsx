import { useEffect, useRef } from "react";
import { setValidationMsg } from "../utilities/global";

import styles from "../styles/components/AddButton.module.css";

const AddButton = ({onClick, validationMsgObj}: {onClick: () => void, validationMsgObj: { msg: string }}) => {
    const addBtnRef = useRef(null as HTMLInputElement|null);

    useEffect(() => {
        setValidationMsg(addBtnRef, validationMsgObj.msg);
    }, [validationMsgObj]);
    
    return <input className={styles.addBtn} onClick={onClick} ref={addBtnRef} defaultValue="+ add"></input>;
} 

export default AddButton;