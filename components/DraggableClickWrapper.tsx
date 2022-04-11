import { useContext } from "react";
import { MouseDownContext } from "../pages/_app";

import styles from '../styles/components/DraggableClickWrapper.module.css';

const DraggableClickWrapper = ({title, clickHandler, children, isDisabled}: {title?: string, clickHandler: () => void, children: any, isDisabled?: boolean}) => {
    const { isMouseDown } = useContext(MouseDownContext);

    const wrappedClickHandler = () => !isDisabled && clickHandler();
    
    return <div 
        className={styles.draggableClickWrapper}
        title={title}
        onMouseDown={wrappedClickHandler}
        onTouchStart={wrappedClickHandler}
        onMouseEnter={() => isMouseDown && wrappedClickHandler()}
    >
        {children}
    </div>
}

export default DraggableClickWrapper;