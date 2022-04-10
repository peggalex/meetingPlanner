import { useContext, useMemo } from "react";
import MeetingContext from "../../../utilities/MeetingContext";
import UserContext from "../../../utilities/UserContext"
import FractionDisplay from "../../FractionDisplay";

const UserSelectionFraction = () => {
    const { isLoggedIn, userDates } = useContext(UserContext);

    const numberSelected = useMemo(() => userDates?.flatMap?.(d => d.times)?.length ?? 0, [userDates]);

    const { sortedDates } = useContext(MeetingContext);
    const totalMeetingTimes = useMemo(() => sortedDates?.flatMap?.(d => d.times)?.length ?? 0, [sortedDates]);

    if (!isLoggedIn) return null;

    return <FractionDisplay title="selected" numerator={numberSelected} denominator={totalMeetingTimes}/>
}

export default UserSelectionFraction;