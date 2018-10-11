const express=require('express');
const Tarif=require('../model/tarif');
const User=require('../model/user');
const UserDetail=require('../model/userdetail');
const Ride=require('../model/ride');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const router=express.Router();


router.get('/tarif/:cartype',async (req,res)=>{
    const cartype=req.params.cartype;
    try{
    const tarif=await Tarif.findOne({cartype:cartype});
    if(!tarif){
       return  res.status(501).json({
            message:'car type does not exist'
        })
    }

    return res.status(200).json({
        cartype:tarif
        
    })
   }
   catch(err){
       res.status(501).json({
           message:'some error occured',
           err:err
       })
   }
})




module.exports=router