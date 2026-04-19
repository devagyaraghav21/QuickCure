import express from "express";
import { addDoctor, loginAdmin } from "../controllers/adminController.js";
import upload from "../middleware/multer.js";
import authAdmin from "../middleware/authAdmin.js";

const adminRouter = express.Router()


adminRouter.post('/add-doctor',authAdmin, upload.none(),addDoctor)
adminRouter.post('/login',loginAdmin)
export default adminRouter 
