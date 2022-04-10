import Icons from "../utilities/icons";

import styles from "../styles/components/DeleteHoverWrapper.module.css"
import globalStyles from "../styles/global.module.css";
import { getClassName } from "../utilities/global";
import DraggableClickWrapper from "./DraggableClickWrapper";

const DeleteHoverWrapper = ({onClick, title, children}: {onClick: () => void, title: string, children: any}) => {
    return <DraggableClickWrapper title={title} clickHandler={onClick}>
        <div className={styles.deleteHoverWrapper}>
            <div className={styles.deleteHoverWrapperContent}>
                {children}
            </div>
            <div className={getClassName(globalStyles.centerAll, styles.deleteHoverWrapperIcon)}>
                {Icons.delete}
            </div>
        </div>
    </DraggableClickWrapper>
}

export default DeleteHoverWrapper;