const mongoose = require('mongoose');

const PostSchma = mongoose.Schema({
  
title:String,
content:String,
author:{type:mongoose.Types.ObjectId,ref:'user'},
comment:[{type:mongoose.Types.ObjectId,ref:'comment'}],
like:{type:mongoose.Types.ObjectId,ref:'like'}

})

module.exports=mongoose.model('Post',PostSchma)
