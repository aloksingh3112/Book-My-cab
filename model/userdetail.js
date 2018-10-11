const mongoose=require('mongoose');

const UserDetailsSchema=new mongoose.Schema({
    yourride:{type:mongoose.Schema.Types.ObjectId,ref:'RideModel'},
});

const UserDetailsModel=mongoose.model('UserDetailsModel',UserDetailsSchema);


module.exports=UserDetailsModel;
