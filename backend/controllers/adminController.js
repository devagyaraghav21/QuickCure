import validator from "validator"
// import cloudinary from "../config/cloudinary.js"
import bcrypt from 'bcrypt'
import doctorModel from "../models/doctorModel.js"

import jwt from 'jsonwebtoken'

// API FOR ADDING DOCTOR
const addDoctor = async (req, res) => {

    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body

        // const imageFile = req.file

       
        // console.log({name, email, password, speciality, degree, experience, about, fees, address },imageFile);

        // checking for all data to add doctor if any missing details it will return the message
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        //validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please eneter a strong password" })
        }

        //hasing doctor password

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        // console.log("CLOUD:", process.env.CLOUDINARY_CLOUD_NAME)
        // console.log("KEY:", process.env.CLOUDINARY_API_KEY)
        // console.log("SECRET:", process.env.CLOUDINARY_API_SECRET)

        // const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        // const imageUrl = imageUpload.secure_url

        // to save these data into data base

        const doctorData = {

            name,
            email,
            // image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }
        
        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        res.json({ success: true, message: "Doctor Added" })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API FOR ADMIN LOGIN

const loginAdmin = async(req,res) => {
    try{

        const {email,password} =req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

            const token = jwt.sign(email+password,process.env.jwt_secret)
            res.json({success:true,token})

        } else{
            res.json({succcess:false,message:"invalid credentials"})
        }

    } catch (error) {
        console.log(error)
        res.json({succcess:false,message:error.message})
    }

}   


export { addDoctor, loginAdmin }