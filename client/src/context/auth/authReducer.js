/**
 * @Author: Ali
 * @Date:   2019-10-29T11:13:12+01:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-30T15:31:07+01:00
 */
import {CLEAR_ERRORS,LOGOUT,LOGIN_FAIL,LOGIN_SUCCESS,AUTH_ERROR,USER_LOADED,REGISTER_FAIL,REGISTER_SUCCESS} from '../types'

export default (state,action) => {
  switch (action.type) {
    case REGISTER_SUCCESS:
    localStorage.setItem('token',action.payload.token)
      return {
        ...state,
        ...action.payload,
        isAuthenticated:true,
        loading:false
      }
    case REGISTER_FAIL:
    localStorage.removeItem('token')
      return {
        ...state,
        token:null,
        isAuthenticated:false,
        loading:false,
        user:null,
        error:action.payload
      }
    case CLEAR_ERRORS :
    return {
      ...state,
      error:null
    }
    default:
    return state
  }
}
