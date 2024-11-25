import eventService from "../services/eventService.js"
import jwt from 'jsonwebtoken'




const createEvent = async (req, res) => {
    try {
        const userId = req.user.id
        const savedEvent = await eventService.createEvent(req.body, userId);
        res.status(201).json({message: 'Event Created Succesfully', event: savedEvent});
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while creating a event"
        })
    }
}

const getEventByUserId = async(req, res) => {
    try {
        const token = req.headers["authorization"].split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const events = await eventService.getEventByUserId(userId);
        res.status(200).json({events: events})
    } catch (error) {
        res.status(500).json({ error: error.message,
            message: 'Cannot Get Events',
        })
    }
}

export default { createEvent, getEventByUserId };