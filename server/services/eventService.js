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


   async deleteEvent(eventId, userId) {

    const event = await eventDb.findOneAndDelete({_id: eventId, organizer: userId});
    if(!event) {
        throw new Error ('Event Not Found Or Unauthorized')
    }
    return event;
    }


    async updateEvent(eventId, userId, eventData) {
        const event = await eventDb.findOneAndUpdate({_id: eventId, organizer: userId}, {$set: eventData}, {new: true});
        if(!event) {
            throw new Error ('Event Not Found')
        }
        return event;
    }


}

export default new EventService();