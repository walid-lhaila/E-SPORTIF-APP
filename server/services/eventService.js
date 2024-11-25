import eventDb from "../model/eventModel.js";





class EventService {

   async createEvent(eventData) {

    const {title, description, date, image, category} = eventData;
    const event = new eventDb({ title, description, date, category, image });
    return await event.save();

   }

}

export default new EventService();