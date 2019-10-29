/**
 * @Author: Ali
 * @Date:   2019-10-29T10:33:00+01:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-29T10:56:50+01:00
 */
 import React, { useContext, useRef, useEffect } from 'react';
 import ContactContext from '../../context/contact/contactContext';

 const ContactFilter = () => {
   const contactContext = useContext(ContactContext);
   const text = useRef('');

   const { filterContacts, clearFilter, filtered } = contactContext;

   useEffect(() => {
     if (filtered === null) {
       text.current.value = '';
     }
   });

   const onChange = e => {
     if (text.current.value !== '') {
       filterContacts(e.target.value);
     } else {
       clearFilter();
     }
   };

   return (
     <form>
       <input
         ref={text}
         type='text'
         placeholder='Filter Contacts...'
         onChange={onChange}
       />
     </form>
   );
 };

 export default ContactFilter;
