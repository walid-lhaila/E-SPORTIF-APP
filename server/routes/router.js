import express from 'express';
import verifyToken from '../middleware/authMidlleware.js';
import authController from '../controller/authController.js';
import eventController from '../controller/eventController.js';
import participantsController from '../controller/participantsController.js';

const route = express.Router();

route.post('/api/register', authController.register);
route.post('/api/login', authController.login);

route.post('/api/createEvent', verifyToken, eventController.createEvent);
route.get('/api/getEvents', verifyToken, eventController.getEventByUserId);
route.delete('/api/delete/:id', verifyToken, eventController.deleteEvent);
route.put('/api/update/:id', verifyToken, eventController.updateEvent);

route.post('/api/event/:id/participants', verifyToken, participantsController.addParticipants);
export default route;