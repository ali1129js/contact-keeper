/**
 * @Author: Ali
 * @Date:   2019-10-29T11:12:46+01:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-30T15:31:12+01:00
 */

 import React, { useReducer} from 'react'
 import axios from 'axios'
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
   const loadUser = () => console.log('l');
   //Register User
   const register = async formData => {
     //for axios
     const config ={
       headers: {
         'Content-Type':'application/json'
       }
     }
     try {
       const res = await axios.post('/api/users',formData,config)
       dispatch({
         type:REGISTER_SUCCESS,
         payload: res.data
       })
     } catch (e) {
       dispatch({
         type:REGISTER_FAIL,
         payload: e.response.data.msg
       })
     }
   }
   //Login User
   const login = () => console.log('l');

   //Logout
   const logout = () => console.log('l');

   //Clear CLEAR_ERRORS
   const clearErrors = () => dispatch({type:CLEAR_ERRORS})

   return (
     <AuthContext.Provider
       value={{
         token:state.token,
         isAuthenticated:state.isAuthenticated,
         user:state.user,
         loading:state.loading,
         error:state.error,
         register,
         loadUser,
         login,
         logout,
         clearErrors
       }}
     >
       {props.children}
     </AuthContext.Provider>
   )
 }
 export default AuthState
