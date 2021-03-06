/**
 * @Author: Ali
 * @Date:   2019-10-27T10:23:31+01:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-29T10:31:54+01:00
 */
import {ADD_CONTACT,DELETE_CONTACT,SET_CURRENT,CLEAR_CURRENT,UPDATE_CURRENT,FILTER_CONTACTS,CLEAR_FILTER,UPDATE_CONTACT} from '../types'

export default (state,action) => {
  switch(action.type){
    case ADD_CONTACT:
    return {
      ...state,
      contacts:[...state.contacts,action.payload]
    }
    case UPDATE_CONTACT:
    return {
      ...state,
      contacts: state.contacts.map(contact => contact.id === action.payload.id ? action.payload : contact)
    }
    case DELETE_CONTACT:
    return {
      ...state,
      contacts:state.contacts.filter(contact => contact.id !== action.payload)
    }
    case SET_CURRENT:
    return {
      ...state,
      current:action.payload
    }
    case CLEAR_CURRENT :
    return {
      ...state,
      current:null
    }
    case FILTER_CONTACTS :
    return {
      ...state,
      filtered:state.contacts.filter(contact => {
        const regex = new RegExp(`${action.payload}`,'gi')
        return contact.name.match(regex) || contact.email.match(regex)
      })
    }
    case CLEAR_FILTER :
    return {
      ...state,
      filtered:null
    }
    default:
    return state
  }
}
