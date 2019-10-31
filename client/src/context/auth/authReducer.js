/**
 * @Author: Ali
 * @Date:   2019-10-29T11:13:12+01:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-31T10:51:53+01:00
 */
import {CLEAR_ERRORS,LOGOUT,LOGIN_FAIL,LOGIN_SUCCESS,AUTH_ERROR,USER_LOADED,REGISTER_FAIL,REGISTER_SUCCESS} from '../types'

export default (state,action) => {
  switch (action.type) {
    case USER_LOADED :
    return {
      ...state,
      isAuthenticated:true,
      loading:false,
      user:action.payload
    }

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS :
    localStorage.setItem('token',action.payload.token)
      return {
        ...state,
        ...action.payload,
        isAuthenticated:true,
        loading:false
      }
    case REGISTER_FAIL:
    case AUTH_ERROR :
    case LOGIN_FAIL :
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
