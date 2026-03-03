import express from "express"
import authSeller from "../middlewares/authSeller.js"
import {adminDashboardData} from "../controllers/adminDashboardController.js"

const adminDashboardRouter = express.Router();

adminDashboardRouter.get('/dashboard',authSeller, adminDashboardData);


export default adminDashboardRouter;