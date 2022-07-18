import type { NextPage } from 'next'
import React, { useCallback, useContext, useState } from 'react';
import DateTimePicker from '../components/page/create/DateTimePicker';
import SelectedDates from '../components/page/create/SelectedDates';
import Page from '../components/page/Page';
import PinkButton from '../components/page/PinkButton';
import {CalendarCellWrapperType, dateToStr, makeRequest, MeetingDays, timeToMinutes } from '../utilities/global';
import { Calendar, CalendarMonth } from '../utilities/home';
import Icons from '../utilities/icons';

import { GetServerSideProps } from 'next'
import MeetingContext, { MeetingContextProvider } from '../utilities/MeetingContext';
import { CreateMeetingRequest } from '../utilities/types/requestTypes';
import { CreateMeetingResponse } from '../utilities/types/responseTypes';
import DeleteHoverWrapper from '../components/DeleteHoverWrapper';
import { MeetingDay } from '../utilities/types/sharedTypes';

const getFirstDayOfWeek = (year: number, month: number) => new Date(year, month, 1).getDay();
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

function generateCalendar(): Calendar {
  const calendar: Calendar = [];

  const currentYear = new Date().getFullYear();
  for (let yearIndex = 0; yearIndex < 2; yearIndex++){
    let monthObjs: Array<CalendarMonth> = [];

    let year = currentYear + yearIndex;
    for (let month = 0; month < 12; month++){
      let blankDays = getFirstDayOfWeek(year, month);
      let daysInMonth = getDaysInMonth(year, month);

      let monthObj = [Array.from(Array(blankDays)).map(_ => null as number|null)]; // pad start of array with null
      
      for (let i = 0; i < daysInMonth; i++){
        let daysInWeek = monthObj.at(-1)?.length;
        if (daysInWeek == null || 7 <= daysInWeek){
          monthObj.push([]);
        }
        monthObj.at(-1)!.push(i+1);
      }
      monthObjs.push(monthObj);
    }
    calendar.push({ months: monthObjs, year });
  }

  return calendar;
}

export const getServerSideProps: GetServerSideProps = async () => {

  return {
    props: {
      calendar: generateCalendar()
    }, // will be passed to the page component as props
  }
}

const DeleteTimeWrapper: CalendarCellWrapperType = ({title, year, month, day, timeMinutes, children}) => {
  const { setDates } = useContext(MeetingContext);

  const deleteTime = useCallback((timeMinutes: number) => {
      setDates!((prevDates) => {
          const newDates = new Map(prevDates); // this is a shallow copy, but that's fine, we just want to trigger a react diff
          const key = dateToStr(year, month, day)
          const thisDate = newDates.get(key)!;
          const newTimes = thisDate.times.filter(t => timeMinutes !== timeToMinutes(t.hour, t.minute));
          if (newTimes.length === 0){
              newDates.delete(key);
          } else {
              newDates.set(key, {
                  date: dateToStr(year, month, day),
                  times: newTimes
              });
          }
          return newDates;
      });
  }, [setDates, year, month, day]);

  return <DeleteHoverWrapper onClick={() => deleteTime(timeMinutes)} title={`Remove time: ${title}`}>
    {children}
  </DeleteHoverWrapper>
}

const HomeWithContext = ({calendar}: {calendar: Calendar}) => {

  const {title, sortedDates} = useContext(MeetingContext);

  return <Page CalendarCellWrapper={DeleteTimeWrapper} sidePanelElement={<>
    <PinkButton text="publish" icon={Icons.share} onClick={async (setValidationMsg: (msg: string) => void)=>{
      let errorMessage: string|null = null;
      if (title.length === 0){
        errorMessage = "You must enter a title";
      }
      if (sortedDates.length === 0){
        errorMessage = "You must select at least one date";
      }
      if (errorMessage != null){
        setValidationMsg(errorMessage);
        return;
      } else {
        setValidationMsg("");
      }

      const meetingReq: CreateMeetingRequest = { meeting: {
        title, sortedDates
      }, passwordHash: null };

      const [res, isOk] = await makeRequest<CreateMeetingResponse>("/api/addNewMeeting", meetingReq);
      if (!isOk) throw Error(res?.errorMessage);
      window.location.href = `/meeting/${res!.meetingId}`;
      
    }} title="Create new meeting" isDisabled={false}/>
    <SelectedDates/>
    <DateTimePicker calendar={calendar}/>
  </>}/>
}

const Home: NextPage<{calendar: Calendar}> = ({calendar}) => {

  const [title, setTitle] = useState("");
  const [dates, setDates] = useState<MeetingDays>(new Map<string, MeetingDay>());

  return <MeetingContextProvider title={title} setTitle={setTitle} dates={dates} setDates={setDates}>
    <HomeWithContext calendar={calendar}/>
  </MeetingContextProvider>;
}

export default Home
