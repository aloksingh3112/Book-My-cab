const mongoose=require('mongoose');


const AdminDetailsSchema=new mongoose.Schema({
    tarifplan:[{type:mongoose.Schema.Types.ObjectId,ref:'TarifModel'}], 
    driverDetails:[{type:mongoose.Schema.Types.ObjectId,ref:'UserModel'}]
})

const AdminDetailsModel=mongoose.model('AdminDetailsModel',AdminDetailsSchema);

module.exports=AdminDetailsModel;