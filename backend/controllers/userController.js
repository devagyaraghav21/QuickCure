import Validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import { v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmntModel from '../models/appointmentModel.js'
import razorpay from 'razorpay'

//API to register user
 const registerUser = async (req,res) => {

    try {
        
        const { name, email, password } = req.body
        if(!name || !password || !email) {
            return res.json({success: false ,message:"Missing Details"})
        }
//validating email 
        if(!Validator.isEmail(email)) {
                        return res.json({success: false ,message:"Enter A Valid Email"})

        }
//validating strong password
        if(password.length < 8) {
            return res.json({success: false, message:"Enter  A Strong Password"})
        }

// hashing using password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

// to add this data into database
// const userData = {
//     name,
//     email,
//     password : hashedPassword
// }


// to add this data into database
const userData = {
    name,
    email,
    password : hashedPassword,

    phone:'',

    address:{
        line1:'',
        line2:''
    },

    gender:'Not Selected',

    dob:''
}

const  newUser = new userModel(userData)
const user = await newUser.save()

//this is for sending token after getting correct email and password

const token = jwt.sign({id:user._id}, process.env.JWT_SECRET )
res.json({success:true,token})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
 }


//API For user Login

const loginUser = async (req,res) => {
    try {
        
const {email,password} = req.body
const user = await userModel.findOne({email})
if(!user) {
    return res.json({success:false,message:'User Does Not Exist'})
}
const isMatch = await bcrypt.compare(password,user.password)

if(isMatch) {
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
    res.json({success:true,token})
}else{
    res.json({success:false, message:"Invalid Credentials"})
}

    } catch (error) {
      console.log(error)
        res.json({success:false, message:error.message})  
    }
}

//API to get user profile data

const getProfile = async (req,res) => {
    try {
        
        const  userId  = req.userId

        const userData = await userModel.findById(userId).select(' -password')
        
        res.json({success:true,userData})

    } catch (error) {
     console.log(error)
        res.json({success:false, message:error.message})     
    }
}

// API to update profile

const updateProfile = async (req,res) => {
    try {

        const userId = req.userId

        const { name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if(!name || !phone || !dob || !gender) {
            return res.json({success: false, message: "Data Missing" })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address),dob, gender})

        if(imageFile){

            //upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId,{image:imageURL})

        }
        res.json({success:true,message:"profile Updated"})
        
    } catch (error) {
           console.log(error)
        res.json({success:false, message:error.message}) 
    }
}


// API to book appointment

const bookAppointment = async (req,res) =>  {
    try {
        
        const userId = req.userId

        const { docId, slotDate, slotTime } = req.body

        const docData = await doctorModel.findById(docId).select('-password')

        if(!docData.available) {
            return res.json({success:false,message:'Doctor not available'})
        }
        
        let slots_booked = docData.slots_booked

        // checking for slot availability
            if (slots_booked[slotDate]) {
                if(slots_booked[slotDate].includes(slotTime)) {
                    return res.json({success:false, message:'Slot not available'})
                }else{
                    slots_booked[slotDate].push(slotTime)
                }
            }else{
                slots_booked[slotDate] = []
                slots_booked[slotDate].push(slotTime)
            }

            const userData = await userModel.findById(userId).select('-password')

            delete docData.slots_booked


            // creating appointmnet data 
            const appointmentData = {
                userId,
                docId,
                userData,
                docData,
                amount:docData.fees,
                slotDate,
                slotTime,
                date: Date.now()
            }

            // saving to database
            const newAppointment = new appointmntModel(appointmentData)
            await newAppointment.save()

            // save new slots data in docData

            await doctorModel.findByIdAndUpdate(docId,{slots_booked})

            res.json({success:true,message:'Appointment Booked'})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//API to get user appointment for frontend my-Appointment page

const listAppointment = async (req,res) =>  {

    try {
        
        const userId = req.userId
        const appointments = await appointmntModel.find({userId})

        res.json({success: true,appointments})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// API to cancel appointment

const cancelAppointment = async (req,res) => {
    try {

         const userId = req.userId
        const { appointmentId } = req.body

        const appointmentData = await appointmntModel.findById(appointmentId)

        //verify appointment user 
        if(appointmentData.userId.toString() !== userId.toString()) {
            return res.json ({success:false,message:'Unauthorized action'})
        }

        await appointmntModel.findByIdAndUpdate(appointmentId, {cancelled:true})

        // Releasing doctor slot

        const {docId, slotDate, slotTime} = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, {slots_booked})

        res.json({success:true, message:'Appointment cancelled'})
        
    } catch (error) {
          console.log(error)
        res.json({success:false, message:error.message})
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

// API to make payment of appointment

const paymentRazorpay =  async (req,res) => {

    try {

        const  { appointmentId } = req.body
        const appointmentData =  await appointmntModel.findById(appointmentId)

        if(!appointmentData || appointmentData.cancelled) {
            return res.json({success:false, message:"Appointment Cancelled or Not found"})
        }

        // creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }
        //creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({success:true,order})
        
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }


}

// API to verify payment of razorpay

const verifyRazorpay = async (req,res) => {
    try{

        const {razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        // console.log(orderInfo)

        if(orderInfo.status === 'paid'){
            await appointmntModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
            res.json({success:true,message:"payment successfull"})
        }else{
            res.json({success:false,message:"payment failed" })
        }
        
    } catch (error) {
         console.log(error)
        res.json({success:false, message:error.message})
    }
}

 export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay}