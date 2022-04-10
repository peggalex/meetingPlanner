import { ScheduleDay, ScheduleTime } from "../global";
import { Meeting } from "./sharedTypes";

export type MeetingRequest = {
    meetingId: string;
}

export type UserAuth = MeetingRequest & {
    username: string;
    passwordHash: string | null;
}; 

type AuthenticatedRequest = {
    userAuth: UserAuth;
};

export type CreateMeetingRequest = {
    meeting: Meeting;
    passwordHash: string | null;
};

export type UpdateMeetingRequest = AuthenticatedRequest & {
    sortedDates: Array<{ date: string, times: Array<ScheduleTime> }>;
};