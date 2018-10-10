const express =require('express');
const jwt=require('jsonwebtoken');



module.exports=function(req,res,next) {
     
    jwt.verify(req.headers.token,'aloksingh',function (err,decode){
        if(err){
            return res.status(401).json({
                message:'not authorize',
                 err:err
            })
        }
        else{
            next();
        }
    })

  

}


