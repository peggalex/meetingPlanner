import type { NextApiRequest, NextApiResponse } from 'next';
import { getDbMeeting } from '../../../utilities/serverOnly/database';
import { handleAPIError, RestError } from '../../../utilities/serverOnly/RestError';
import { CreateMeetingResponse } from '../../../utilities/types/responseTypes';
import { dbToMeetingResponse, handleOkResponse } from '../../../utilities/serverOnly/serverOnlyUtilities';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateMeetingResponse>
) {

  try {
    const meetingId = req.query.meetingId as string;

    validateMeetingId(meetingId);

    const dbMeeting = await getDbMeeting(meetingId);
    if (!dbMeeting){
      throw new RestError(`meeting with id '${meetingId}' not found.`, 404);
    }
    const meetingRes = dbToMeetingResponse(dbMeeting);

    handleOkResponse(res, meetingRes);
  } catch (error) {
    handleAPIError(res, error);
  }
}

const validateMeetingId = (meetingId: string) => {
  //pass
}
