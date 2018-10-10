const mongoose=require('mongoose');


const TarifSchema=new mongoose.Schema({
    cartype:{type:String},
    normalhourrate:{type:Number},
    peakhourrate:{type:String},
    endpeaktime:{type:String},
    startpeaktime:{type:String}
});


module.exports=mongoose.model('TarifModel',TarifSchema);