import { ObjectId, Collection, Document, MongoClient } from "mongodb";
import { DatabaseMeeting } from "../types/databaseTypes";

const client = new MongoClient("mongodb://127.0.0.1:27017");

export const getMongoId = (id?: string) => new ObjectId(id);

async function _connectToDB(
    dbName: string,
    collectionName: string,
    dbCallback: (collection: Collection<Document>) => Promise<any>
) {
  try {

    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    await dbCallback(collection);

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export const connectToDB = (dbCallback: (collection: Collection<Document>) => Promise<any>) => 
    _connectToDB('meetingPlanner', 'meetings', dbCallback);
    
export async function getDbMeeting(meetingId: string): Promise<DatabaseMeeting|null> {
    let dbMeeting = null as DatabaseMeeting|null;
  
    await connectToDB(async (collection) => {
        dbMeeting = await collection.findOne({
            _id: getMongoId(meetingId),
        }) as DatabaseMeeting|null; 
    });
    
    return dbMeeting;
}

export async function updateMeeting(meetingId: string, meeting: DatabaseMeeting): Promise<any> {
  await connectToDB(async (collection) => {
      await collection.updateOne(
          { _id: getMongoId(meetingId) },
          { $set: meeting }
      ); 
  });
}