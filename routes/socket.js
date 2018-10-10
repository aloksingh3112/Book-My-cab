const express=require('express');
const User=require('../model/user');
const DriverDetails=require('../model/driverdetail');
const Tarif= require('../model/tarif');




 async function socketOperation(data){
   try{
   const driver=await User.findOne({email:data.message.user.email}).populate({
       path:'driver',
       populate:{
           path:'plan',
           model:'TarifModel'
       }
   })
   return driver;
}
catch(err){
    return null;
}

}





module.exports=socketOperation;