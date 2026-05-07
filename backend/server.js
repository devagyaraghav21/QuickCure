import dotenv from "dotenv"
dotenv.config()

import express from 'express'
import cors from 'cors'
import connectDB from "./config/mongodb.js"
import cloudinary from "./config/cloudinary.js"
import adminRouter from './routes/adminRoute.js'
import doctorRouter from "./routes/doctorRoute.js"
import userRouter from "./routes/userRouter.js"




// console.log("CLOUD:", process.env.CLOUDINARY_CLOUD_NAME)
// console.log("KEY:", process.env.CLOUDINARY_API_KEY)
// console.log("SECRET:", process.env.CLOUDINARY_API_SECRET)

// app config

const app = express()
const port = process.env.PORT || 4000

// connect DB
connectDB()

// connect Cloudinary
// connectcloudinary()

//middlewares

app.use(express.json())
app.use(cors())

//Api endpoint
app.use('/api/admin' , adminRouter)
app.use('/api/doctors' , doctorRouter)
app.use('/api/user' , userRouter)




// localhost:4000/api/admin/add-doctor

app.get('/',(req,res)=>{
res.send('API WORKING')
})

app.listen(port, ()=> console.log("Server Started",port))