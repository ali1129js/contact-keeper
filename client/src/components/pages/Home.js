/**
 * @Author: Ali
 * @Date:   2019-10-25T11:22:37+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-29T10:44:03+01:00
 */
 import React from 'react'
 import Contacts from '../contacts/Contacts'
 import ContactForm from '../contacts/ContactForm'
 import ContactFilter from '../contacts/ContactFilter'

 const Home = () => {
   return(
     <div className="grid-2">
       <div>
       <ContactForm />
       </div>
       <div className="">
       <ContactFilter />  
         <Contacts />
       </div>
   </div>
   )
 }
 export default Home
