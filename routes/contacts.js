/**
 * @Author: Ali
 * @Date:   2019-10-21T16:57:50+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-21T17:18:48+02:00
 */
 const express = require('express');

 const router = express.Router()
 // @route   Get api/contacts
 // @Desc    Get all user's contacts
 // @acess   Private
 router.get('/',(req,res)=>{
   res.send('Get all contacts')
 })
 // @route   POST api/contacts
 // @Desc    Add new contact
 // @acess   Private
 router.post('/',(req,res)=>{
   res.send('add a contact')
 })
 // @route   PUT api/contacts/:id
 // @Desc    update a contact
 // @acess   Private
 router.put('/:id',(req,res)=>{
   res.send('update a contact')
 })
 // @route   DELETE api/contacts/:id
 // @Desc    DELETE a contact
 // @acess   Private
 router.delete('/:id',(req,res)=>{
   res.send('delete a contact')
 })
 module.exports = router
