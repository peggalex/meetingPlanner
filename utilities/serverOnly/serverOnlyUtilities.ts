import { NextApiResponse } from "next";
import { HexRegex, UsernameRegex } from "../global";
import { DatabaseMeeting } from "../types/databaseTypes";
import { UserAuth } from "../types/requestTypes";
import { FailableResponse, GetMeetingResponse } from "../types/responseTypes";
import { getDbMeeting } from "./database";
import { RestError } from "./RestError";

export const dbToMeetingResponse = ({ meeting, userToPasswordHash }: DatabaseMeeting): GetMeetingResponse => {

    const userToHasPassword = {} as {[username: string]: boolean};
    Object.entries(userToPasswordHash).forEach(([username, password]) => {
        userToHasPassword[username] = password !== null;
    });

    return { meeting, userToHasPassword, failed: false };
}

export const findUserPassword = (userToPasswordHash: {[username: string]: string | null}, name: string): string | null | undefined => {
    const usernames = Object.keys(userToPasswordHash);
    const existingUsername = usernames.find(n => n.toLowerCase() === name.toLowerCase());
    if (existingUsername === undefined) return;

    return userToPasswordHash[existingUsername!];
}

export const validateMeetingId = async (meetingId: string): Promise<DatabaseMeeting> => {
    const dbMeeting = await getDbMeeting(meetingId);
    if (dbMeeting === null){
      throw new RestError(`Meeting with id '${meetingId}' not found.`, 404);
    }
    return dbMeeting;
}

export const validateAuthenticatedRequest = async ({ username, passwordHash, meetingId }: UserAuth): Promise<DatabaseMeeting> => {

    const dbMeeting = await validateMeetingId(meetingId);

    const existingPasswordHash = findUserPassword(dbMeeting.userToPasswordHash, username);
    if (existingPasswordHash === undefined){
      throw new RestError(
        `No user with name'${username}' in meeting '${meetingId}'.`, 
        404
      );
    } else if (existingPasswordHash !== passwordHash){
        throw new RestError(
          `Incorrect password for user '${username}.`, 
          403
        );
    }

    return dbMeeting;
}

export function handleOkResponse<T extends FailableResponse>(res: NextApiResponse, json: T, statusCode: 200|201 = 200) {
    (res as NextApiResponse<T>).status(statusCode).json({ 
        ...(JSON.parse(JSON.stringify(json)) as T),
        failed: false,
    });
}

export const validateUser = ({ username, passwordHash }: UserAuth) => {
  if (!username.match(UsernameRegex)){
    throw new RestError(`Invalid username '${username}' (does not match regex).`, 500);
  }
  if (passwordHash != null && !passwordHash.match(HexRegex)){
    throw new RestError(`Invalid password hash (should be hexadecimal).`, 500);
  }
}