import { DatabaseMeeting } from "../types/databaseTypes";
import { connectToDB, getMongoId } from "./database";

export default async function getMeeting(meetingId: string): Promise<DatabaseMeeting|null> {
    let dbMeeting = null as DatabaseMeeting|null;
  
    await connectToDB(async (collection) => {
        dbMeeting = await collection.findOne({
            _id: getMongoId(meetingId),
        }) as DatabaseMeeting|null; 
    });
    
    return dbMeeting;
}