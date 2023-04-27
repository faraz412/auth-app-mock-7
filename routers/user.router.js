const express=require("express");
const { UserModel } = require("../models/user.model");
require("dotenv").config();
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const { authenticate } = require("../middlewares/authenticate.mw");

const userRouter=express.Router();

userRouter.post("/register", async(req,res)=>{
    const {imageURL,name,bio,phone,email,password}=req.body;
    try{
        const check=await UserModel.find({email});
        if(check.length>0){
            res.send({"msg":"Please login"});
        }else{
            bcrypt.hash(password,7,async(err,hash)=>{
                if(err){
                    res.send({"msg":"bcrypt hashing error"});
                }else{
                    const user=new UserModel({imageURL,name,bio,phone,email,password:hash});
                    await user.save();
                    res.send({"msg":"Successfully registered"});
                }
            })
        }
    }catch(err){
        res.send({"msg":"Error in registering user"});
    }
});

userRouter.post("/login", async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await UserModel.find({email});
        if(user.length==0){
            res.send({"msg":"Invalid credentials"});
        }else{
            bcrypt.compare(password,user[0].password,async(err,result)=>{
                if(err){
                    res.send({"msg":"bcrypt compare error"});
                }else{
                    const token=jwt.sign({userID:user[0]._id},process.env.key);
                    res.send({"msg":"Login successfull","token":token,"name":user[0].name,"imageURL":user[0].imageURL});
                }
            })
        }
    }catch(err){
        res.send({"msg":"Error in logging in user"});
    }
});

userRouter.get("/getProfile", authenticate, async(req,res)=>{
    let id=req.body.userID;
    try{
        const user=await UserModel.findById(id);
        res.send(user);
    }catch(err){
        res.send({"msg":"Erorr in getting user details"});
    }
})

userRouter.patch("/editProfile",authenticate,async(req,res)=>{
    const payload=req.body;
    for(let key in payload){
        if(!payload[key]){
            delete payload[key];
        }
    }
    console.log(payload);
    let id=req.body.userID;
    try{
        if(payload.password){
            bcrypt.hash(payload.password,7,async(err,hash)=>{
                if(err){
                    res.send({"msg":"bcrypt hashing error"});
                }else{
                    payload.password=hash;
                    await UserModel.findByIdAndUpdate(id,payload);
                    res.send({"msg":"Profile details updated"});
                }
            })
        }else{
            await UserModel.findByIdAndUpdate(id,payload);
            res.send({"msg":"Profile details updated"});
        }
    }catch(err){
        res.send({"msg":"Error in updating profile details"});
    }
})


module.exports={userRouter};