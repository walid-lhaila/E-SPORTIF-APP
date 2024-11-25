import eventDb from "../models/eventModel.js";




class ParticipantsService {

    async addParticipants (eventId, participants) {
        try {
            const event = await eventDb.findById(eventId);
            if(!event) {
                throw new Error ('Event Not Found');
            }

            const updateEvent = await eventDb.findByIdAndUpdate(eventId, {$push: {participants: { $each: participants}}}, {new: true});
            return updateEvent;
        } catch (error) {
            throw new Error(error.message);
        }
    };


    async getAllParticipants(eventId) {
        try {
            const event = await eventDb.findById(eventId, 'participants');
            if(!event){
                throw new Error ('Event Not Found');
            } 
            return event.participants;
        } catch(error) {
            throw new error(error.message);
        }
    }
}

export default new ParticipantsService();