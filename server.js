/**
 * @Author: Ali
 * @Date:   2019-10-21T16:25:24+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-23T08:00:56+02:00
 */
const express = require('express');
const connectDB = require('./config/db')
const app = express()
const PORT = process.env.PORT || 5000
//Connect Database
connectDB()

//Init Middleware
app.use(express.json({extended:false}))

app.get('/',(req,res)=>res.send('Hello World'))
//Define Routes
app.use('/api/users',require('./routes/users'))
app.use('/api/auth',require('./routes/auth'))
app.use('/api/contacts',require('./routes/contacts'))

app.listen(PORT,()=> console.log(`Server started on port ${PORT}`))
