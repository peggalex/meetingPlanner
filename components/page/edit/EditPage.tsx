import { useContext } from "react";
import { CalendarCellWrapperType } from "../../../utilities/global";
import Icons from "../../../utilities/icons";
import MeetingContext from "../../../utilities/MeetingContext"
import UserContext, { UserContextProvider } from "../../../utilities/UserContext"
import SelectedCellWrapper from "../../SelectedCellWrapper";
import MeetingRouting from "../MeetingRouting";
import Page from "../Page";
import PinkButton from "../PinkButton";
import ShareButton from "../ShareButton";
import AddUserTimeButton from "./AddUserTimeButton";
import SigninLogin from "./SigninLogin";
import UserSelectionFraction from "./UserSelectionFraction";

const SelectTimeWrapperEdit: CalendarCellWrapperType = ({title, year, month, day, timeMinutes, children}) => {
  const { toggleTime, getIsAvailable } = useContext(UserContext);
  
  return <SelectedCellWrapper 
      title={title} 
      isSelected={getIsAvailable(year, month, day, timeMinutes)} 
      onClick={() => {toggleTime(year, month, day, timeMinutes)}}
  >
      {children}
  </SelectedCellWrapper>;
}

const EditPage = ({meetingId, updateMeeting}: {meetingId: string, updateMeeting: () => Promise<void>}) => {

    const { sortedDates } = useContext(MeetingContext);

    return <UserContextProvider meetingId={meetingId} sortedDates={sortedDates} loadUserUpdate={updateMeeting}>
        <Page sidePanelElement={<>
            <ShareButton/>
            <MeetingRouting />
            <SigninLogin />
            <UserSelectionFraction />
            <AddUserTimeButton />
        </>} CalendarCellWrapper={SelectTimeWrapperEdit}/>
      </UserContextProvider>
}

export default EditPage;