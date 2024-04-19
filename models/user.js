const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  
name:{
    type:String,
    unique:true,
},
bio:String,
Posts:[{type:mongoose.Types.ObjectId,ref:'Post'}]

})

module.exports=mongoose.model('user',userSchema)
