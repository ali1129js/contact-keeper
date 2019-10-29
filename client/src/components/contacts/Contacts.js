/**
 * @Author: Ali
 * @Date:   2019-10-27T10:47:27+01:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-29T10:49:10+01:00
 */
import React,{useContext} from 'react'
import ContactItem from './ContactItem'
import ContactContext from '../../context/contact/contactContext'
const Contacts = () => {
  const contactContext = useContext(ContactContext)
  const { contacts,filtered } = contactContext
  if(contacts.length === 0){
    return <h4>Please add a contact</h4>
  }
  return(
  <>
  {filtered !== null
    ? filtered.map(contact => (<ContactItem contact={contact} key={contact.id}/>)
      )
    : contacts.map(contact =>
    (<ContactItem contact={contact} key={contact.id}/>)
     )}

  </>
  )
}
export default Contacts
