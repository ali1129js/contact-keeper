/**
 * @Author: Ali
 * @Date:   2019-10-21T17:28:56+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-22T11:54:24+02:00
 */
const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI')

const connectDB = () => {
  mongoose.connect(db,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true
  }).then(()=>console.log("MongoDb Connected")).catch(err=>{console.error(err.message);
  process.exit(1)}
)
}
module.exports = connectDB
