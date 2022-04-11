import { useContext, useMemo } from "react"
import MeetingContext from "../../../utilities/MeetingContext"
import Icons from "../../../utilities/icons"
import FractionDisplay from "../../FractionDisplay"
import MeetingRouting from "../MeetingRouting"
import Page from "../Page"
import UserList from "./UserList"
import SelectedTimeContext, { SelectedTimeContextProvider } from "../../../utilities/SelectedTimeContext"
import { CalendarCellWrapperType } from "../../../utilities/global"
import SelectedCellWrapper from "../../SelectedCellWrapper"
import SelectedDateTime from "./SelectedDateTime"
import Accordion from "../Accordion"
import PanelContainer from "../PanelContainer"
import ShareButton from "../ShareButton"
import PeopleAccordionsPanel from "./PeopleAccordionsPanel"

const SelectTimeWrapperNotEdit: CalendarCellWrapperType = ({title, year, month, day, timeMinutes, children}) => {
	  
    const { toggleSelectedTime, timeIsSelected } = useContext(SelectedTimeContext);

    return <SelectedCellWrapper 
      title={title} 
      isSelected={timeIsSelected(year, month, day, timeMinutes)} 
      onClick={() => toggleSelectedTime(year, month, day, timeMinutes)}
    >
      {children}
    </SelectedCellWrapper>;
  };

const ViewPageWrapped = () => {

    const { totalUsers } = useContext(MeetingContext);
    const { hasSelectedTime, selectedTime } = useContext(SelectedTimeContext);

    return <Page CalendarCellWrapper={SelectTimeWrapperNotEdit} sidePanelElement={<>
        <ShareButton/>
        <MeetingRouting/>
        {hasSelectedTime && <>
            <SelectedDateTime/>
            <FractionDisplay title="available" numerator={selectedTime!.available.length} denominator={totalUsers}/>
        </>}
        {hasSelectedTime ? <PeopleAccordionsPanel/> : <UserList/>}
    </>}/>
}

const ViewPage = () => {

    return <SelectedTimeContextProvider>
        <ViewPageWrapped/>
    </SelectedTimeContextProvider>
}

export default ViewPage;