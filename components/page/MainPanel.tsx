import styles from "../../styles/components/page/MainPanel.module.css";
import globalStyles from "../../styles/global.module.css";
import { getClassName } from "../../utilities/global";
import Calendar from "../calendar/Calendar";

const MainPanel = ({sidePanelElement}: {sidePanelElement: JSX.Element}) => {
    return <div className={getClassName(globalStyles.row, styles.mainPanel)}>
        <div className={getClassName(globalStyles.col, styles.sidePanel)}>
            {sidePanelElement}
        </div>
        <Calendar/>
    </div>
}

export default MainPanel;