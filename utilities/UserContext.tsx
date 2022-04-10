import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import MeetingContext from "./MeetingContext";
import { dateToStr, makeRequest, minutesToTime, ScheduleDay, strToDate, timeToMinutes } from "./global";
import { UserAuth } from "./types/requestTypes";
import { FailableResponse } from "./types/responseTypes";
import { MeetingDay } from "./types/sharedTypes";

const UserContext = createContext({} as { 
    meetingId: string,
    userAuth: UserAuth|null,
    isLoggedIn: boolean,
    userDates: Array<ScheduleDay>|null,
    login: (userAuth: UserAuth) => Promise<void>,
    signup: (userAuth: UserAuth) => Promise<void>,
    logout: () => void,
    toggleTime: (y: number, m: number, d: number, timeMinutes: number) => void,
    getIsAvailable: (y: number, m: number, d: number, timeMinutes: number) => boolean,
    loadUserUpdate: () => void,
  });
  
export default UserContext;

const getUserAuthKey = (meetingId: string) => `userAuth - ${meetingId}`;

export const UserContextProvider = ({meetingId, sortedDates, loadUserUpdate, children}:  {meetingId: string, sortedDates: Array<MeetingDay>, loadUserUpdate: () => void, children: any}) => {

    const { userToHasPassword } = useContext(MeetingContext);

    const userAuthKey = useMemo(() => getUserAuthKey(meetingId), [meetingId]);

    const [userAuth, setUserAuth] = useState<UserAuth|null>(null);

    const isLoggedIn = useMemo(() => userAuth !== null, [userAuth]);

    const [userDatesUnsorted, setUserDatesUnsorted] = useState<Array<ScheduleDay>|null>(null);
    const [userDates, setUserDates] = useState<Array<ScheduleDay>|null>(null);

    useEffect(() => {
        setUserDates(null);
    }, [isLoggedIn, userAuthKey]);

    useEffect(() => {
        if (isLoggedIn){
            localStorage.setItem(userAuthKey, JSON.stringify(userAuth));
            if (userDates === null){
                setUserDatesUnsorted(sortedDates.map(({date, times }) => ({
                    date,
                    times: times.filter(t => t.available.includes(userAuth!.username.toLowerCase()))
                })));
            }
        }
    }, [isLoggedIn, sortedDates, userAuth, userAuthKey, userDates]);

    useEffect(() => {
        userDatesUnsorted?.forEach(d => d.times.sort((a, b) => 
            timeToMinutes(a.hour, a.minute) - timeToMinutes(b.hour, b.minute))
        );
        setUserDates(
            userDatesUnsorted              
                ?.filter?.(d => 0 < d.times.length)
                ?.sort?.((a, b) => 
                    strToDate(  a.date).getTime() - strToDate(b.date).getTime()
                ) ?? null
        );
    }, [userDatesUnsorted]);

    const getDateTimeIndex = useCallback((y: number, m: number, d: number, timeMinutes: number): [ number, number ] => {
        const dateStr = dateToStr(y, m, d)

        const dayIndex = userDates?.findIndex?.(ud => 
            dateStr == ud.date
        );

        if (dayIndex === undefined || dayIndex === -1){
            return [-1, -1];
        }

        const timeIndex = userDates![dayIndex].times
            .findIndex(t => timeMinutes === timeToMinutes(t.hour, t.minute));

        return [dayIndex, timeIndex];
    }, [userDates]);

    const toggleTime = useCallback((y: number, m: number, d: number, timeMinutes: number) => {
        if (userDates === null) return; 

        const date = dateToStr(y, m, d);
        const [hour, minute] = minutesToTime(timeMinutes);

        const [ dayIndex, timeIndex ] = getDateTimeIndex(y, m, d, timeMinutes);

        if (dayIndex !== -1){
            const dayObj = userDates![dayIndex];
            if (timeIndex !== -1){
                dayObj.times.splice(timeIndex, 1);
            } else {
                dayObj.times.push({ hour, minute })
            }
        } else {
            userDates!.push({
                date,
                times: [{ hour, minute }]
            });
        }
        setUserDatesUnsorted([...userDates!]);
    }, [getDateTimeIndex, userDates]);

    const getIsAvailable = useCallback(
        (y: number, m: number, d: number, timeMinutes: number) => !getDateTimeIndex(y, m, d, timeMinutes).some(i => i == -1), 
        [getDateTimeIndex]
    );

    useEffect(() => {(async () =>{
        if (meetingId == null || isLoggedIn) return;
        const existingUserAuthStr = localStorage.getItem(userAuthKey);
        if (existingUserAuthStr === null) return;

        const existingUserAuth = JSON.parse(existingUserAuthStr) as UserAuth;

        const [res, isOk, status] = await makeRequest<FailableResponse>(
            "/api/authenticate", 
            existingUserAuth
        );
        if (isOk){
            setUserAuth(existingUserAuth);
        } else {
            localStorage.removeItem(userAuthKey);
            switch(status){
                case 403:
                    alert("Your password has changed since you last logged in on this browser, please log in again");
                    break;
                case 404:
                    alert("Your user has been deleted since you last logged in on this browser");
                    break;
                default:
                    throw new Error(res?.errorMessage ?? status.toString());
            }
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    })()}, []);

    const logout = useCallback(() => {
        setUserAuth(null);
        localStorage.removeItem(userAuthKey);
    }, [userAuthKey]);
    
    const signup = useCallback(async (newUserAuth: UserAuth) => {

        const [res, isOk, status] = await makeRequest<FailableResponse>("/api/createNewUser", newUserAuth);

        if (isOk){
            setUserAuth(newUserAuth);
        }
        else {
            switch (status){
                case 400:
                    alert("User already exists.");
                default:
                    throw new Error(res?.errorMessage ?? status.toString());
            }
        }
        userToHasPassword[newUserAuth.username!] = false; // todo: refresh meeting? change context to global
    }, [userToHasPassword]);

    const login = useCallback(async (existingUserAuth: UserAuth) => {
        
        const [res, isOk, status] = await makeRequest<FailableResponse>("/api/authenticate", existingUserAuth);
        
        if (isOk){
            console.log('setting user auth', existingUserAuth);
            setUserAuth(existingUserAuth);
        } else {
            switch(status){
                case 403:
                    alert("Incorrect password.");
                    break;
                case 404:
                    alert("User not found.");
                    break;
                default:
                    throw new Error(res?.errorMessage ?? status.toString());
            }
        }
    }, []);

    return <UserContext.Provider value={{meetingId, isLoggedIn, userAuth, login, logout, signup, toggleTime, getIsAvailable, loadUserUpdate, userDates}}>
        {children}
    </UserContext.Provider>;
}