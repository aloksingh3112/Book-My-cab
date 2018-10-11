const mongoose=require('mongoose');

const RideSchema=new mongoose.Schema({
    driverDetails:{type:mongoose.Schema.Types.ObjectId,ref:'UserModel'},
    pickuplocation:{type:String},
    destination:{type:String},
    totalfare:{type:Number},
    distance:{type:Number},
    
})

module.export=mongoose.model('RideModel',RideSchema);

