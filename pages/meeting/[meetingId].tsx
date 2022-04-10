import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { MeetingDays } from '../../utilities/global';
import { Meeting, MeetingDay } from '../../utilities/types/sharedTypes';
import MeetingContext, { MeetingContextProvider } from '../../utilities/MeetingContext';
import { GetMeetingResponse } from '../../utilities/types/responseTypes';
import ViewPage from '../../components/page/view/ViewPage';
import EditPage from '../../components/page/edit/EditPage';

const meetingToSortedDates = (meeting: Meeting) => {
    const sortedDates: MeetingDays = new Map<string, MeetingDay>();
    for (let { date, times} of meeting.sortedDates){
        sortedDates.set(date, { date, times });
    }
    return sortedDates;
}


const MeetingPlannerWrapped = ({meetingId, updateMeeting}: { meetingId: string, updateMeeting: () => Promise<void>}) => {
	const {isEditMode} = useContext(MeetingContext);

	return isEditMode ? <EditPage meetingId={meetingId} updateMeeting={updateMeeting}/> : <ViewPage/>
}

const MeetingPlanner = () => {
    const router = useRouter();
    const meetingId = router.query.meetingId as string;

    const [meetingRes, setMeetingRes] = useState<GetMeetingResponse|null>(null);
    const meeting = useMemo(() => meetingRes?.meeting, [meetingRes?.meeting]);
    const userToHasPassword = useMemo(() => meetingRes?.userToHasPassword, [meetingRes?.userToHasPassword]);

    const title = useMemo(() => meeting?.title ?? "", [meeting]);
    
    const updateMeeting = useCallback(async () => {
      if (!meetingId) return;
      const meetingRes: GetMeetingResponse = await (await fetch(`/api/meeting/${meetingId}`)).json();
      setMeetingRes(meetingRes);
    }, [meetingId]);

    useEffect(() => {
      if (meeting == null){
        updateMeeting();
      }
    }, [meeting, updateMeeting]);

	if (!meeting || !userToHasPassword) return null;

    return <MeetingContextProvider 
		title={title} 
		dates={meetingToSortedDates(meeting)} 
		userToHasPassword={userToHasPassword}
	>
		<MeetingPlannerWrapped meetingId={meetingId} updateMeeting={updateMeeting}/>
    </MeetingContextProvider>;
}

export default MeetingPlanner;