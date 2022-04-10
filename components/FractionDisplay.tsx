import PanelContainer from "./page/PanelContainer";

import globalStyles from "../styles/global.module.css";
import styles from "../styles/components/FractionDisplay.module.css";
import { getClassName } from "../utilities/global";

const FractionDisplay = ({title, numerator, denominator}: {title: string, numerator: number, denominator: number}) => {
    return <PanelContainer title={title} isFullWidth={false}>
        <div className={getClassName(globalStyles.row, globalStyles.center, styles.fractionDisplay)}>
            <span>{numerator}</span>
            <span>{denominator}</span>
        </div>
    </PanelContainer>
}

export default FractionDisplay;