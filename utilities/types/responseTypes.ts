import { Meeting } from "./sharedTypes";

export type FailableResponse = {
    failed: boolean;
    errorMessage?: string;
}

export type AuthenticateResponse =  FailableResponse & {
    correctCaseUsername: string;
}

export type GetMeetingResponse = FailableResponse & {
    meeting: Meeting;
    userToHasPassword: {[username: string]: boolean};
};

export type CreateMeetingResponse = FailableResponse & {
    meetingId: string;
}