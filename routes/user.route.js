const express = require('express');

const userRouter = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require('../models/user.model');
const redisClient = require('../helpers/redis');
require("dotenv").config()

userRouter.post("/signup", async (req, res) => {
    try{

        const {name,email,password} = req.body;
        const isUserPresent = await user.findOne({email});
         if(isUserPresent) return res.send("User already Present, login please");
         const hash = await bcrypt.hash(password,8);

         const newUser = new user({name,email, password: hash});

         await newUser.save();

         res.send("Signup Successful")

    } catch(err) {
          
        res.send(err.message);
    }
  });



  // login user
userRouter.post("/login", async (req, res) => {
    
    try {
         
        const {email, password} = req.body;
        const isUserPresent  = await user.findOne({email});
        if(!isUserPresent) return res.send({msg :"user not present, Register please"});
        const isPasswordCorrect = await bcrypt.compare(password,isUserPresent.password);
        if(!isPasswordCorrect) return res.send({msg:"Invalid Credentials"});

        const token = await jwt.sign({userId:isUserPresent._id},process.env.JWT_SECRET, {expiresIn:"1hr"})

        res.send({msg: "Login Success", token});


    } catch(err) {
         res.send(err.message)
    }
  });


    // logout user
    userRouter.get("/logout", async (req, res) => {
        try{

            const token = req.headers?.authorization?.split(" ")[1];

            if(!token) return res.status(403).send({msg: "please provide token"});
            await redisClient.set(token,token);
            res.send("logout successful");
    
        }catch(err) {
            res.send(err.message)
        }
      });
    


  module.exports = userRouter;