import minio from "../../minio.js";
import eventDb from "../models/eventModel.js";





class EventService {

   async createEvent(eventData, userId, files) {

    const {title, description, date, category} = eventData;

    if(!files.image) {
        throw new Error('File Is Required');
    }

    const imageUrl = await this.uploadEventImage(files.image, 'images')
    const event = new eventDb({ title, description, date, category, image: imageUrl, organizer: userId });
    return await event.save();

   }

   async getEventByUserId(userId) {
    return await eventDb.find({organizer: userId});
   }


   async deleteEvent(eventId, userId) {

    const event = await eventDb.findOneAndDelete({_id: eventId, organizer: userId});
    if(!event) {
        throw new Error ('Event Not Found Or Unauthorized')
    }
    return event._id;
    }


    async updateEvent(eventId, userId, eventData) {
        const event = await eventDb.findOneAndUpdate({_id: eventId, organizer: userId}, {$set: eventData}, {new: true});
        if(!event) {
            throw new Error ('Event Not Found')
        }
        return event;
    }

    async uploadEventImage(file, folder) {
        const bucketName = 'e-sportif';
        const fileName = `${folder}/${file.originalname}`;

        const exists = await minio.bucketExists(bucketName);
        if (!exists) {
            await minio.makeBucket(bucketName, 'us-east-1');
        }


        await minio.fPutObject(bucketName, fileName, file.path);
        return `http://127.0.0.1:9000/${bucketName}/${fileName}`;
    }


}

export default new EventService();