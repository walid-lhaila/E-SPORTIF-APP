import eventService from "../services/eventService.js"




const createEvent = async (req, res) => {
    try {
        const savedEvent = await eventService.createEvent(req.body);
        res.status(201).json({message: 'Event Created Succesfully', event: savedEvent});
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while creating a event"
        })
    }
}

export default { createEvent };