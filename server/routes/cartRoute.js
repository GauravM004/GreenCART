import express from "express"
import authenticateUser from "../middlewares/authUser.js";
import { updateCart } from "../controllers/cartController.js";


const cartRouter = express.Router();

cartRouter.post('/update', authenticateUser, updateCart)

export default cartRouter;