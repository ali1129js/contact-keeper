/**
 * @Author: Ali
 * @Date:   2019-10-21T16:58:03+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-21T17:14:29+02:00
 */
const express = require('express');

const router = express.Router()
// @route   POST api/users
// @Desc    Register a users
// @acess   Public
router.post('/',(req,res)=>{
  res.send('Register a user')
})
module.exports = router
