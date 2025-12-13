

import validator from "validator";
import bcrypt from "bcryptjs";
import userModel from "../models/userModels.js";
import jwt from "jsonwebtoken";
// import generateToken from "../utils/generateToken.js";

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId},
        process.env.JWT_SECRET,
        { expiresIn: "10m"} 


    );
};

//register

const registerUser = async (req, res) => {
    const { name, email,password } = req.body;
    
  try {
    if(!name || !email || !password) {
        return res.status(400).json({success:false, message:"All fields are required" })
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email"});
    }
    if (password.length < 8 ){
        return res.status(400).json({ success: false, message: "password must be at least 8 characters long"});
    }

    const existingUser = await userModel.findOne({ email });
    if(existingUser) {
        return res.status(400).json({ success: false, message:"User already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
        name,
        email,
        password: hashedPassword
    });

    const user =await newUser.save();

    const token = generateToken(user._id)

    res.status(201).json({
        success: true,
        token,
        user: {
            id:user._id,
            name: user.name,
            email: user.email
        },
    });

  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Server error" })   
  };
  
  

};



//login

const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required",

            });

        }

        const user = await userModel.findOne({ email});
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "password is incorrect"});
        }

        const token = generateToken(user._id);
        res.status(200).json({
            success:true,
            token,
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error"});
    }
}

export {registerUser, loginUser};