import express from "express";
import {PostContactForm, GetContactForms, DeleteContactForm} from "../controllers/ContactUsController.js";
import verifySeller from "../middlewares/authSeller.js"

const ContactusRouter = express.Router()

ContactusRouter.post("/submit", PostContactForm)
ContactusRouter.delete("/:id", verifySeller, DeleteContactForm)
ContactusRouter.get("/", verifySeller, GetContactForms)

export default ContactusRouter;
