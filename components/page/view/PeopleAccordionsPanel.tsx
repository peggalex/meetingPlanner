import { useContext } from "react";
import Icons from "../../../utilities/icons";
import MeetingContext from "../../../utilities/MeetingContext";
import SelectedTimeContext from "../../../utilities/SelectedTimeContext";
import Accordion from "../Accordion";
import PanelContainer from "../PanelContainer";

const PeopleAccordionsPanel = () => {
    const { userToHasPassword } = useContext(MeetingContext);
    const { selectedTime } = useContext(SelectedTimeContext);
    
    return <PanelContainer title='people'>
        <Accordion icon={Icons.check} title='available' people={selectedTime?.available || []}/>
        <Accordion icon={Icons.cross} title='unavailable' people={
            Object.keys(userToHasPassword).filter(
                u => !(selectedTime?.available.map(u => u.toLowerCase()) || []).includes(u.toLowerCase())
            )  || []
        }/>
    </PanelContainer>
}

export default PeopleAccordionsPanel;