import Validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'


//API to register user
 const registerUser = async (req,res) => {

    try {
        
        const { name, email, password } = req.body
        if(!name || !password || !email) {
            return res.json({successive: false ,message:"Missing Details"})
        }
//validating email 
        if(!Validator.isEmail(email)) {
                        return res.json({successive: false ,message:"Enter A Valid Email"})

        }
//validating strong password
        if(password.length < 8) {
            return res.json({success: false, message:"Enter  A Strong Password"})
        }

// hashing using password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

// to add this data into database
const userData = {
    name,
    email,
    password : hashedPassword
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


 export {registerUser,loginUser}