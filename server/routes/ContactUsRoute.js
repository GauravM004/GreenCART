import express from "express";
import {PostContactForm, GetContactForms, DeleteContactForm} from "../controllers/ContactUsController.js";
import authSeller from "../middlewares/authSeller.js"

const ContactusRouter = express.Router()

ContactusRouter.post("/submit", PostContactForm)
ContactusRouter.delete("/:id", authSeller, DeleteContactForm)
ContactusRouter.get("/", authSeller, GetContactForms)

export default ContactusRouter;
