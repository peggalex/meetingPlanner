import Title from "./Title";
import MainPanel from "./MainPanel";

import globalStyles from "../../styles/global.module.css";
import styles from "../../styles/components/page/page.module.css";
import Icons from "../../utilities/icons";
import { createContext, useMemo } from "react";
import { CalendarCellWrapperType, getClassName } from "../../utilities/global";

export const CalendarCellWrapperContext = createContext<CalendarCellWrapperType|null>(null);

const Page = ({sidePanelElement, CalendarCellWrapper}: {sidePanelElement: JSX.Element, CalendarCellWrapper: CalendarCellWrapperType}) => {

    const heading = useMemo(() => 
        <header className={globalStyles.centerCross}>
            {Icons.meetingPlannerIcon}
            <h1>meeting planner</h1>
        </header>, 
    []);

    return <CalendarCellWrapperContext.Provider value={CalendarCellWrapper}>
        <div className={getClassName(globalStyles.col, globalStyles.centerCross, styles.page)}>
            {heading}
            <section><Title/></section>
            <section><MainPanel sidePanelElement={sidePanelElement}/></section>
        </div>
    </CalendarCellWrapperContext.Provider>
}

export default Page;