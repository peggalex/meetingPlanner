import type { NextApiRequest, NextApiResponse } from 'next';
import { UserAuth } from '../../utilities/types/requestTypes';
import { getDbMeeting } from '../../utilities/serverOnly/database';
import { RestError, handleAPIError } from '../../utilities/serverOnly/RestError';
import { handleOkResponse, validateAuthenticatedRequest, validateUser } from '../../utilities/serverOnly/serverOnlyUtilities';
import { AuthenticateResponse } from '../../utilities/types/responseTypes';
import { HexRegex, UsernameRegex } from '../../utilities/global';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthenticateResponse>
) {
  try {
    const existingUser = JSON.parse(req.body) as UserAuth;
    const { meetingId } = existingUser;

    validateUser(existingUser);

    // find meeting. validateAuthenticatedRequest does this, but if we call it here we can handle the error case and throw our own 404 error
    const dbMeeting = await getDbMeeting(meetingId);
    if (dbMeeting === null){
      throw new RestError(`Meeting with id '${meetingId}' not found.`, 404);
    }

    // authenticate username and password
    await validateAuthenticatedRequest(existingUser);

    const usernames = Object.keys(dbMeeting.userToPasswordHash);
    // send the username back in the correct case.  This is so the user may log in with the incorrect case, but still use the correct case.
    const correctCaseUsername = usernames.find(n => n.toLowerCase() === existingUser.username.toLowerCase());

    handleOkResponse(res, { failed: false, correctCaseUsername });

  } catch (error: any) {
    handleAPIError(res, error);
  }
}