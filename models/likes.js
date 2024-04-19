const mongoose = require('mongoose');

const commentSchma = mongoose.Schema({
  


post:{type:mongoose.Schema.Types.ObjectId,ref:'Post'},
users:[{type:mongoose.Types.ObjectId,ref:'user'}]

})

module.exports=mongoose.model('like',commentSchma)
