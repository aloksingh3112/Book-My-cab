const express =require('express');
const jwt=require('jsonwebtoken');
const User=require('../model/user');



module.exports=async function(req,res,next) {
    
    const token=jwt.decode(req.headers.token);
  
    try{
    const user =await User.findOne({email:token.user.email});
   
    if(user.role==token.user.role){
        next(null,token);
    }
    else{
        return res.status(403).json({
            message:'you are not authorised'
        })
    }
   

   
    }
    catch(err){
        return res.status(501).json({
            err:err
        })
    }

  

}


