const mongoose = require('mongoose');

const commentSchma = mongoose.Schema({
  
text:String,

sender:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
Post:{type:mongoose.Schema.Types.ObjectId,ref:'Post'},

})

module.exports=mongoose.model('comment',commentSchma)
