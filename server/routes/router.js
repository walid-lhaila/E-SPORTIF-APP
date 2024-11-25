import express from 'express';
import verifyToken from '../middleware/authMidlleware.js';
import authController from '../controller/authController.js';
import eventController from '../controller/eventController.js';

const route = express.Router();

route.post('/api/register', authController.register);
route.post('/api/login', authController.login);

route.post('/api/createEvent', verifyToken, eventController.createEvent);
route.get('/api/getEvents', verifyToken, eventController.getEventByUserId);
route.delete('/api/delete/:id', verifyToken, eventController.deleteEvent);
export default route;