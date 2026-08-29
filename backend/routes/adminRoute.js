import express from "express";
import { addDoctor, allDoctors, appointmentsAdmin, loginAdmin,appointmentCancel, adminDashboard } from "../controllers/adminController.js";
import upload from "../middleware/multer.js";
import authAdmin from "../middleware/authAdmin.js";
import { changeAvailability } from "../controllers/doctorController.js";

const adminRouter = express.Router()

// yaha pr bhi cloudinary function aega after middleware upload.single('image') at p[lace of upload none]
// upload.none()
adminRouter.post('/add-doctor',authAdmin, upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailability)
adminRouter.get('/appointments',authAdmin,appointmentsAdmin)

adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel)
adminRouter.get('/dashboard',authAdmin,adminDashboard)

export default adminRouter 
