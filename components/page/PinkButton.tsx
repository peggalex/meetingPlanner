import styles from "../../styles/components/page/PinkButton.module.css";
import globalStyles from "../../styles/global.module.css";
import { getClassName } from "../../utilities/global";
import { useCallback, useEffect, useRef } from "react";

const PinkButton = (
    {text, icon, title, onClick, isDisabled }: 
    {text: string, icon: JSX.Element, title: string, onClick: (setValidationMsg: (msg: string) => void) => void, isDisabled: boolean }
) => {
    const pinkBtn = useRef<HTMLInputElement|null>(null);

    const setValidationMsg = useCallback((msg: string) => {
        if (pinkBtn?.current != null){
            pinkBtn!.current!.setCustomValidity(msg);
            pinkBtn!.current!.reportValidity();
        }
    }, []);
    return <div 
        title={title} 
        className={getClassName(globalStyles.centerAll, styles.pinkButton)}
    >
        {icon}{text}
        <input ref={pinkBtn} onClick={() => onClick(setValidationMsg)} type="submit" defaultValue={""}/>
    </div>
}

export default PinkButton;