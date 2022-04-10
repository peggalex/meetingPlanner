import { useContext } from "react";
import { MouseDownContext } from "../pages/_app";

import styles from '../styles/components/DraggableClickWrapper.module.css';

const DraggableClickWrapper = ({title, clickHandler, children, isDisabled}: {title?: string, clickHandler: () => void, children: any, isDisabled?: boolean}) => {
    const { isMouseDown } = useContext(MouseDownContext);

    const wrappedClickhandler = () => !isDisabled && clickHandler();
    
    return <div 
        className={styles.draggableClickWrapper}
        title={title}
        onMouseDown={wrappedClickhandler}
        onTouchStart={wrappedClickhandler}
        onMouseEnter={() => isMouseDown && wrappedClickhandler()}
    >
        {children}
    </div>
}

export default DraggableClickWrapper;