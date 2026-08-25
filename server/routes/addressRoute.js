import express from 'express';
import authenticateUser from '../middlewares/authUser.js';
import { addAddress, getAddress } from '../controllers/addressController.js';

const addressRouter = express.Router();

addressRouter.post('/add', authenticateUser, addAddress);
addressRouter.get('/get', authenticateUser, getAddress);

export default addressRouter;