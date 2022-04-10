import globalStyles from "../../styles/global.module.css";
import styles from "../../styles/components/page/PanelContainer.module.css";

const PanelContainer = ({title, children, isFullWidth}: {title: string, children: any, isFullWidth?: boolean}) => {
    return <div className={styles.panelContainer} data-fullwidth={isFullWidth ?? true}>
        <p>{title}</p>
        <div className={globalStyles.col}>{children}</div>
    </div>
}

export default PanelContainer;