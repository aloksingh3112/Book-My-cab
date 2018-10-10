const mongoose=require('mongoose');

const DriverDetailsSchema=new mongoose.Schema({
    address:{type:String},
    licenceno:{type:String},
    cartype:{type:String},
    carmodel:{type:String},
    carname:{type:String},
    plan:{type:mongoose.Schema.Types.ObjectId,ref:'TarifModel'},
    ride:[{type:mongoose.Schema.Types.ObjectId,ref:'UserModel'}]
})


module.exports=mongoose.model('DriverDetailsModel',DriverDetailsSchema);