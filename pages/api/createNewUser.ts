import type { NextApiRequest, NextApiResponse } from 'next';
import { updateMeeting } from '../../utilities/serverOnly/database';
import { RestError, handleAPIError } from '../../utilities/serverOnly/RestError';
import { findUserPassword, handleOkResponse, validateMeetingId } from '../../utilities/serverOnly/serverOnlyUtilities';
import { UserAuth } from '../../utilities/types/requestTypes';
import { FailableResponse } from '../../utilities/types/responseTypes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FailableResponse>
) {
  try {
    const newUser = JSON.parse(req.body) as UserAuth;
    const { username, passwordHash, meetingId } = newUser;

    await validateUser(newUser);

    const dbMeeting = await validateMeetingId(meetingId);
    const existingPassword = findUserPassword(dbMeeting.userToPasswordHash, username); 
    if (existingPassword !== undefined){
      throw new RestError(
        `User with name '${username}' already exists in meeting '${meetingId}'.`, 
        400
      );
    }
    
    dbMeeting.userToPasswordHash[username] = passwordHash;

    await updateMeeting(meetingId, dbMeeting);

    handleOkResponse(res, { failed: false }, 201);

  } catch (error: any) {
    handleAPIError(res, error);
  }
}

const validateUser = async ({ username }: UserAuth) => {
  //pass
}
