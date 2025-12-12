

import validator from "validator";
import bcrypt from "bcryptjs";
import userModel from "../models/userModels.js";

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

export {registerUser};