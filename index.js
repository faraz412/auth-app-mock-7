const express=require("express");
const cors=require("cors");
require("dotenv").config();
const {connection}=require("./config/db.js");
const { userRouter } = require("./routers/user.router.js");

const app=express();

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);

app.get("/", (req,res)=>{
    res.send("Welcome to Authentication app Home Page");
});

app.listen(process.env.port, async()=>{
    try{
        await connection;
        console.log("Connected to DB");
    }catch(err){
        console.log("Error connectiong to DB");
    }
    console.log(`Listening on port ${process.env.port}`);
})