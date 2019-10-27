/**
 * @Author: Ali
 * @Date:   2019-10-27T10:47:27+01:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-27T11:17:55+01:00
 */
import React,{useContext} from 'react'
import ContactContext from '../../context/contact/contactContext'
const Contacts = () => {
  const contactContext = useContext(ContactContext)
  const { contacts } = contactContext
  return(
<> {contacts.map(contact => <h3>{contact.name}</h3>)} </>
  )
}
export default Contacts
