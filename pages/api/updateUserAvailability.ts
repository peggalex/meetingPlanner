import type { NextApiRequest, NextApiResponse } from 'next';
import { MeetingDay } from '../../utilities/types/sharedTypes';
import { updateMeeting } from '../../utilities/serverOnly/database';
import { handleAPIError, RestError } from '../../utilities/serverOnly/RestError';
import { UpdateMeetingRequest } from '../../utilities/types/requestTypes';
import { handleOkResponse, validateAuthenticatedRequest, validateUser } from '../../utilities/serverOnly/serverOnlyUtilities';
import { FailableResponse } from '../../utilities/types/responseTypes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FailableResponse>
) {

	try {
		const meetingReq = JSON.parse(req.body) as UpdateMeetingRequest;
		const { sortedDates: userSortedDates, userAuth } = meetingReq;

		validateUser(meetingReq.userAuth);

		const username = userAuth.username.toLowerCase();
		const dbMeeting = await validateAuthenticatedRequest(userAuth);
		const { meeting: { sortedDates: dbSortedDates } } = dbMeeting;
		validateUpdateRequest(meetingReq, dbSortedDates);

		let userDayIndex = 0; // index for userSortedDates

		for (let dbDay of dbSortedDates){
			const dbDate = dbDay.date;
			const userDay = userDayIndex < userSortedDates.length ? userSortedDates[userDayIndex] : null;

			if (dbDate === userDay?.date){
				let userTimeIndex = 0; // index for userDay.times

				for (let dbTime of dbDay.times){
					const userTime = userTimeIndex < userDay.times.length ? userDay.times[userTimeIndex] : null;
					const availableSet = new Set(dbTime.available);

					if (dbTime.hour === userTime?.hour && dbTime.minute === userTime?.minute){
						availableSet.add(username);
						userTimeIndex++;
					} else {
						availableSet.delete(username);
					}

					dbTime.available = Array.from(availableSet);
				}
				if (userTimeIndex < userDay.times.length) throw new RestError('what the hey? pt2', 500); 
				// we expect to have iterated over every time in userDay.times after itertaing over every dbDay.times

				userDayIndex++;
			} else {
				for (let dbTime of dbDay.times){
					const availableSet = new Set(dbTime.available);
					availableSet.delete(username);
					dbTime.available = Array.from(availableSet);
				}
			}
		}

		if (userDayIndex < userSortedDates.length) throw new RestError(`what the hey? ${userSortedDates.length} ${userDayIndex}`, 500); 
		// we expect to have iterated over every date in userSortedDate after itertaing over every dbSortedDate
		
		await updateMeeting(userAuth.meetingId, dbMeeting);

		handleOkResponse(res, { failed: false }, 201);

	} catch (error) {
		handleAPIError(res, error);
	}
}

const validateUpdateRequest = (meetingReq: UpdateMeetingRequest, dbMeeting: Array<MeetingDay>) => {
  // pass
}
