import express from "express"
import verifySeller from "../middlewares/authSeller.js"
import {adminDashboardData} from "../controllers/adminDashboardController.js"

const adminDashboardRouter = express.Router();

adminDashboardRouter.get('/dashboard', verifySeller, adminDashboardData);


export default adminDashboardRouter;