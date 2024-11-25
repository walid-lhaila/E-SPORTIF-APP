import express from 'express';
import authController from '../controller/authController.js';


const route = express.Router();

route.post('/api/register', authController.register);
route.post('/api/login', authController.login);

export default route;