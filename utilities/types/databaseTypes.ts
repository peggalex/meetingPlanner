import { ObjectId } from "mongodb";
import { Meeting } from "./sharedTypes";

export type DatabaseMeeting = {
    _id: ObjectId;
    meeting: Meeting;
    passwordHash: string | null;
    userToPasswordHash: {[usernameLower: string]: string | null };
};