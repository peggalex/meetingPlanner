import styles from "../styles/components/SelectedCellWrapper.module.css"
import DraggableClickWrapper from "./DraggableClickWrapper";

const SelectedCellWrapper = ({onClick, title, isSelected, children}: {onClick: () => void, title: string, isSelected: boolean, children: any}) => {
    return <DraggableClickWrapper title={title} clickHandler={onClick}>
        <div className={styles.selectedCellWrapper} data-selected={isSelected}>
            {children}
        </div>
    </DraggableClickWrapper>
}

export default SelectedCellWrapper;