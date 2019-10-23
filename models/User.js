/**
 * @Author: Ali
 * @Date:   2019-10-23T07:42:52+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-23T07:57:01+02:00
 */
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  name:{
    type:String,
    require:true
  },
  email:{
    type:String,
    require:true,
    unique:true
  },
  password:{
    type:String,
    require:true
  },
  date:{
    type:Date,
    default:Date.now
  },
})
module.exports = mongoose.model('user',UserSchema)
