/**
 * @Author: Ali
 * @Date:   2019-10-29T11:12:46+01:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-29T11:23:39+01:00
 */

 import React, { useReducer} from 'react'
 import AuthContext from './authContext'
 import authReducer from './authReducer'
 import {
   REGISTER_SUCCESS,
   REGISTER_FAIL,
   USER_LOADED,
   AUTH_ERROR,
   LOGIN_SUCCESS,
   LOGIN_FAIL,
   LOGOUT,
   CLEAR_ERRORS
 } from '../types'

 const AuthState = props => {
   const initialState = {
     user: null,
     token:localStorage.getItem('token'),
     isAuthenticated:null,
     loading:true,
     error:null
   }
   const [state,dispatch] = useReducer(authReducer,initialState)
   //Load User

   //Register User

   //Login User

   //Logout

   //Clear CLEAR_ERRORS

   return (
     <AuthContext.Provider
       value={{
         token:state.token,
         isAuthenticated:state.isAuthenticated,
         user:state.user,
         loading:state.loading,
         error:state.error,
       }}
     >
       {props.children}
     </AuthContext.Provider>
   )
 }
 export default AuthState
