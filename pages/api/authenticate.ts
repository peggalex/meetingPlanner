import type { NextApiRequest, NextApiResponse } from 'next';
import { UserAuth } from '../../utilities/types/requestTypes';
import { getDbMeeting } from '../../utilities/serverOnly/database';
import { RestError, handleAPIError } from '../../utilities/serverOnly/RestError';
import { handleOkResponse, validateAuthenticatedRequest } from '../../utilities/serverOnly/serverOnlyUtilities';
import { FailableResponse } from '../../utilities/types/responseTypes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FailableResponse>
) {
  try {
    const existingUser = JSON.parse(req.body) as UserAuth;
    const { meetingId } = existingUser;

    await validateUser(existingUser);

    const dbMeeting = await getDbMeeting(meetingId);
    if (dbMeeting === null){
      throw new RestError(`Meeting with id '${meetingId}' not found.`, 404);
    }

    await validateAuthenticatedRequest(existingUser);
    
    handleOkResponse(res, { failed: false });

  } catch (error: any) {
    handleAPIError(res, error);
  }
}

const validateUser = async ({ username }: UserAuth) => {
  //pass
}
