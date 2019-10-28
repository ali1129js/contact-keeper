/**
 * @Author: Ali
 * @Date:   2019-10-27T10:47:27+01:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-28T09:10:36+01:00
 */
import React,{useContext} from 'react'
import ContactItem from './ContactItem'
import ContactContext from '../../context/contact/contactContext'
const Contacts = () => {
  const contactContext = useContext(ContactContext)
  const { contacts } = contactContext
  return(
  <>{contacts.map(contact =>
    <ContactItem contact={contact} key={contact.id}/>
     )}
  </>
  )
}
export default Contacts
