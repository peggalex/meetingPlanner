import { useContext, useEffect, useMemo } from "react";
import MeetingContext from "../../../utilities/MeetingContext";
import Icons from "../../../utilities/icons";

import globalStyles from "../../../styles/global.module.css";
import styles from "../../../styles/components/page/view/UserList.module.css";
import { getClassName } from "../../../utilities/global";
import PanelContainer from "../PanelContainer";

const UserList = () => {

    const { userToHasPassword, sortedDates } = useContext(MeetingContext);

    const lowerToUsername = useMemo(() => {
        const newLowerToUsername = new Map<string, string>();
        Object.keys(userToHasPassword).forEach(username => newLowerToUsername.set(username.toLowerCase(), username));
        return newLowerToUsername;
    }, [userToHasPassword]);

    const usernameToAvailability = useMemo(() => {
        const newUsernameToAvailability = new Map<string, number>(Array.from(lowerToUsername.entries()).map(([_, username]) => [username, 0])); 

        for (const d of sortedDates){
            for (const t of d.times){
                for (const lowerUsername of t.available){
                    const username = lowerToUsername.get(lowerUsername)!;
                    const existingAvailability = newUsernameToAvailability.get(username)!;
                    newUsernameToAvailability.set(username, existingAvailability + 1);
                }
            }
        }
        return newUsernameToAvailability;
    }, [lowerToUsername, sortedDates]);

    useEffect(() => {
        console.log({lowerToUsername});
        console.log({usernameToAvailability});
    }, [usernameToAvailability, lowerToUsername]);

    return <PanelContainer title={"people"}>
        {usernameToAvailability.size === 0 ? <p className={styles.noUsersMsg}>No users joined yet</p> : Array.from(usernameToAvailability.entries()).map(([username, availability]) =>
            <div className={getClassName(globalStyles.centerCross, globalStyles.spaceBetween, styles.userList)} key={username}>
                <div className={getClassName(globalStyles.centerCross)}>
                    {Icons.user}
                    <p>{username}</p>
                </div>
                <p>{availability}</p>
            </div>)}
    </PanelContainer>
}

export default UserList;