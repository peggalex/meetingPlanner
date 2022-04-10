import { useContext } from "react";
import { makeRequest } from "../../../utilities/global";
import { UpdateMeetingRequest } from "../../../utilities/types/requestTypes";
import UserContext from "../../../utilities/UserContext";
import AddButton from "../../AddButton";

const AddUserTimeButton = () => {
	const { isLoggedIn, userAuth, userDates, loadUserUpdate } = useContext(UserContext);
  
	if (!isLoggedIn) return null;
  
	return <AddButton onClick={async () => {
	  await makeRequest('/api/updateUserAvailability', { 
		sortedDates: userDates, 
		userAuth
	  } as UpdateMeetingRequest); 
	  loadUserUpdate();
	}} validationMsgObj={{msg: ""}}/>
}

export default AddUserTimeButton;