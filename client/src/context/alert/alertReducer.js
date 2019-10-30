/**
 * @Author: Ali
 * @Date:   2019-10-30T05:04:23+01:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-30T06:50:04+01:00
 */
 import {SET_ALERT,REMOVE_ALERT} from '../types'

 export default (state,action) => {
   switch (action.type) {
     case SET_ALERT:
       return [...state,action.payload];
     case REMOVE_ALERT:
       return state.filter(alert => alert.id !== action.payload)
     default:
     return state
   }
 }
