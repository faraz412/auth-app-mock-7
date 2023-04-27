const jwt=require("jsonwebtoken");
require("dotenv").config();

const authenticate=(req,res,next)=>{
    const token=req.headers.authorization.split(" ")[1];

    if(token){
        jwt.verify(token,process.env.key,(err,decoded)=>{
            if(err){
                res.send({"msg":"Not Authorized","error":err.message});
            }else{
                req.body.userID=decoded.userID;
                next();
            }
        })
    }else{
        res.send({"msg":"Not Authorized"});
    }
}

module.exports={authenticate};