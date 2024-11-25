import eventDb from "../model/eventModel.js";





class EventService {

   async createEvent(eventData, userId) {

    const {title, description, date, image, category} = eventData;
    const event = new eventDb({ title, description, date, category, image, organizer: userId });
    return await event.save();

   }

   async getEventByUserId(userId) {
    return await eventDb.find({organizer: userId});
   }




}

export default new EventService();