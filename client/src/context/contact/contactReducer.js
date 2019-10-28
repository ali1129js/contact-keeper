/**
 * @Author: Ali
 * @Date:   2019-10-27T10:23:31+01:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-28T11:00:29+01:00
 */
import {ADD_CONTACT,DELETE_CONTACT,SET_CURRENT,CLEAR_CURRENT,UPDATE_CURRENT,FILTER_CONTACTS,CLEAR_FILTER} from '../types'

export default (state,action) => {
  switch(action.type){
    case ADD_CONTACT:
    return {
      ...state,
      contacts:[...state.contacts,action.payload]
    }
    default:
    return state
  }
}
