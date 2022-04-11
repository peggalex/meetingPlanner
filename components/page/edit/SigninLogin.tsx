import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getClassName, UsernameRegex, UsernameRegexExplaination } from "../../../utilities/global";
import Icons from "../../../utilities/icons"
import { UserAuth } from "../../../utilities/types/requestTypes";

import globalStyles from "../../../styles/global.module.css";
import styles from "../../../styles/components/page/edit/SigninLogin.module.css";
import React from "react";
import UserContext from "../../../utilities/UserContext";
import MeetingContext from "../../../utilities/MeetingContext";

const SigninLogin = ()  => {
    const [username, setUsername] = useState<string|null>(null);
    const [passwordHash, setPasswordHash] = useState<string|null>(null);

    const { userToHasPassword } = useContext(MeetingContext);
    const {meetingId, isLoggedIn, userAuth, signup, login, logout} = useContext(UserContext);

    useEffect(() => {
        setUsername(userAuth?.username ?? null);
        setPasswordHash(userAuth?.passwordHash ?? null);
    }, [userAuth]);

    const _userAuth: UserAuth = useMemo(() => ({
        username: username!,
        passwordHash,
        meetingId
    }), [meetingId, username, passwordHash]);
    
    const submitRef = useRef(null as HTMLInputElement | null);

    const signupLogin = useCallback(async () => {

        if (username === null || username.length === 0){
            submitRef?.current?.setCustomValidity?.("Please enter a username");
            submitRef?.current?.reportValidity?.();
            return;
        }
        if (!username.match(UsernameRegex)){
            submitRef?.current?.setCustomValidity?.(UsernameRegexExplaination);
            submitRef?.current?.reportValidity?.();
            return;
        }

        if (Object.keys(userToHasPassword).map(u => u.toLowerCase()).includes(username.toLowerCase())){
            if (!confirm("This is an existing user, are you trying to login?")) return;
            await login(_userAuth);
        } else {
            if (!confirm("This is NOT an existing user, are you trying to sign up?")) return;
            await signup(_userAuth);
        }

    }, [_userAuth, login, signup, userToHasPassword, username]);

    return <div data-loggedIn={isLoggedIn} className={getClassName(globalStyles.centerCross, styles.signinLogin)}>
        <p  className={styles.title}>{isLoggedIn ? "signed in" : "sign in"}</p>
        <input type="text" value={username ?? ""} onChange={(e) => setUsername(e.target.value)} disabled={isLoggedIn} placeholder="username" pattern={UsernameRegex}/>
        <input type="submit" ref={submitRef} onClick={isLoggedIn ? logout : signupLogin} value=""/>
        <div className={styles.signinLoginIconContainer} onClick={isLoggedIn ? logout : signupLogin} title={isLoggedIn ? "Sign Out" : "Login / Sign up"}>
            {isLoggedIn ? Icons.logout : Icons.signinLogin}
        </div>
    </div>
}

export default SigninLogin