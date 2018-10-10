const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    firstname:{type:String,required:true},
    lastname:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    contact:{type:Number,required:true},
    role:{type:Number,default:0},
   
    
    admin:[{type:mongoose.Schema.Types.ObjectId,ref:'AdminDetailsModel'}],
    driver:[{type:mongoose.Schema.Types.ObjectId,ref:'DriverDetailsModel'}] ,
    user:[{type:mongoose.Schema.Types.ObjectId,ref:'UserDetailsModel'}]
    
   
})


module.exports=mongoose.model('UserModel',UserSchema);


