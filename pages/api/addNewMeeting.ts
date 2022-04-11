// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDB, getMongoId } from '../../utilities/serverOnly/database';
import { handleAPIError, RestError } from '../../utilities/serverOnly/RestError';
import { CreateMeetingRequest } from '../../utilities/types/requestTypes';
import { DatabaseMeeting } from '../../utilities/types/databaseTypes';
import { ObjectId } from 'mongodb';
import { CreateMeetingResponse } from '../../utilities/types/responseTypes';
import { handleOkResponse } from '../../utilities/serverOnly/serverOnlyUtilities';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateMeetingResponse>
) {

  try {
    const meetingReq = JSON.parse(req.body) as CreateMeetingRequest;
    const { meeting, passwordHash } = meetingReq;

    validateMeeting(meetingReq);

    let meetingId: ObjectId = getMongoId();
    const dbMeeting: DatabaseMeeting = { _id: meetingId, meeting, passwordHash, userToPasswordHash: {}};

    await connectToDB((collection) => collection.insertOne(dbMeeting));

    handleOkResponse(res, { failed: false, meetingId: meetingId.toString() });
    
  } catch (error) {
    handleAPIError(res, error);
  }
}

const validateMeeting = (meetingReq: CreateMeetingRequest) => {
  const isValidURIEncoding = (str: string) => true;
  const title = meetingReq.meeting.title;
  if (!isValidURIEncoding(title)){
    throw new RestError(`Invalid title '${title}' (expected URI encoded title).`, 500);
  }
}
