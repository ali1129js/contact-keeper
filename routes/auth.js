/**
 * @Author: Ali
 * @Date:   2019-10-21T16:58:11+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-21T17:16:07+02:00
 */
 const express = require('express');

 const router = express.Router()
 // @route   GET api/auth
 // @Desc    Get logged in user
 // @acess   Private
 router.get('/',(req,res)=>{
   res.send('Get logged in user')
 })
 // @route   POST api/auth
 // @Desc    auth user and get token
 // @acess   Public
 router.post('/',(req,res)=>{
   res.send('log in user')
 })
 module.exports = router
