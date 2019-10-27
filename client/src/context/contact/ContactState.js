/**
 * @Author: Ali
 * @Date:   2019-10-27T09:59:48+01:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-27T12:09:34+01:00
 */
import React, { useReducer} from 'react'
import uuid from 'uuid'
import ContactContext from './contactContext'
import contactReducer from './contactReducer'

import {ADD_CONTACT,DELETE_CONTACT,SET_CURRENT,CLEAR_CURRENT,UPDATE_CURRENT,FILTER_CONTACTS,CLEAR_FILTER} from '../types'

const ContactState = props => {
  const initialState = {
    contacts: [
      {
        id:1,
        name:'Jill Hojnwson',
        email:'jill@gmaol.com',
        phone:'111-111-1111',
        type:'personal'
      },{id:2,
      name:'Sara Watson',
      email:'sarah@gmail.com',
      phone:'222-222-2222',
      type:'personal'},
      {id:3,
      name:'Harry White',
      email:'harry@gmail.com',
      phone:'333-333-3333',
      type:'proffessional'}
    ]
  }
  const [state,dispatch] = useReducer(contactReducer,initialState)
  // Add Contact

  // Delete Contact

  // Set Current Contact

  // Clear current Contact

  // Update Contact

  //Filter Contacts

  //Clear Filter

  return (
    <ContactContext.Provider
      value={{
        contacts:state.contacts
      }}
    >
      {props.children}
    </ContactContext.Provider>
  )
}

export default ContactState
