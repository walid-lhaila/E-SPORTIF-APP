import eventService from "../services/eventService.js"
import jwt, { decode } from 'jsonwebtoken'




const createEvent = async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({ message: "Image file are required" });
        }
        const userId = req.user.id
        const savedEvent = await eventService.createEvent(req.body, userId, {
            image:req.files.image[0],
        });
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


const deleteEvent = async (req, res) => {
    try {
        const token = req.headers["authorization"].split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const eventId = req.params.id;
    

        const eventIdDeleted = await eventService.deleteEvent(eventId, userId);
        if(!eventIdDeleted) {
            return res.status(500).json({
                message: "Event Not Found",
            })
        }
        
        res.status(200).json({
            message: "Event Deleted Successfully",
            eventId: eventIdDeleted,
        });
        } catch(error) {
            res.status(500).json({
                message: error.message ||  "An error occurred while deleting the event." 
            });
        }
}

const updateEvent = async (req, res) => {
    const { id: eventId } = req.params;
    const updatedData = req.body;

    if (req.files && req.files.image) {
        updatedData.image = req.files.image[0].path;
    }

    try {
        const updatedEvent = await eventService.updateEvent(eventId, updatedData, req.files ? req.files.image[0] : null);
        res.status(200).json({
            message: "Event Updated Successfully",
            data: updatedEvent,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message || "Failed to update event",
        });
    }
};


export default { createEvent, getEventByUserId, deleteEvent, updateEvent };