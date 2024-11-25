import participantsService from "../services/participantsService.js";


const addParticipants = async(req, res) => {
    const {id: eventId} = req.params;
    const {participants} = req.body;

    try {
        if(!participants || !Array.isArray(participants)) {
            return res.status(400).json({ error : 'Participants must be an array'});
        }

        const updateEvent = await participantsService.addParticipants(eventId, participants);
        res.status(200).json({ message: "Participant Added Successfully", event: updateEvent });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}


export default {addParticipants};