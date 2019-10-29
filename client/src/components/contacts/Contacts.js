/**
 * @Author: Ali
 * @Date:   2019-10-27T10:47:27+01:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-29T11:10:06+01:00
 */
import React,{useContext} from 'react'
import {CSSTransition,TransitionGroup} from 'react-transition-group'
import ContactItem from './ContactItem'
import ContactContext from '../../context/contact/contactContext'
const Contacts = () => {
  const contactContext = useContext(ContactContext)
  const { contacts,filtered } = contactContext
  if(contacts.length === 0){
    return <h4>Please add a contact</h4>
  }
  return(
  <TransitionGroup>

    {filtered !== null
      ? filtered.map(contact => (
        <CSSTransition key={contact.id} timeout={500} classNames="item">
          <ContactItem contact={contact} />
        </CSSTransition>)
      )
      : contacts.map(contact =>
        (<CSSTransition key={contact.id} timeout={500} classNames="item">
          <ContactItem contact={contact} />
        </CSSTransition>)
      )}
  </TransitionGroup>
  )
}
export default Contacts
