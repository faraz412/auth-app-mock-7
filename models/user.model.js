const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    imageURL:{type:String, required:true},
    name:{type:String, required:true},
    bio:{type:String, required:true},
    phone:{type:Number, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true}
},{versionKey:false});

const UserModel=mongoose.model("/user",userSchema);

module.exports={UserModel};