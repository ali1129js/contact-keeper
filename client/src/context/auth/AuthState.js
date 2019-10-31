/**
 * @Author: Ali
 * @Date:   2019-10-29T11:12:46+01:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-31T10:50:46+01:00
 */

 import React, { useReducer} from 'react'
 import axios from 'axios'
 import AuthContext from './authContext'
 import authReducer from './authReducer'
 import setAuthToken from '../../utils/setAuthToken'
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
   const loadUser = async () => {
     if(localStorage.token){
       setAuthToken(localStorage.token)
     }
     try {
      const res = await axios.get('/api/auth')

      dispatch({type:USER_LOADED,payload:res.data})
     } catch (e) {
       dispatch({
         type: AUTH_ERROR
       })
     }

   }
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
       loadUser()
     } catch (e) {
       dispatch({
         type:REGISTER_FAIL,
         payload: e.response.data.msg
       })
     }
   }
   //Login User
   const login = async formData => {
     //for axios
     const config ={
       headers: {
         'Content-Type':'application/json'
       }
     }
     try {
       const res = await axios.post('/api/auth',formData,config)
       dispatch({
         type:LOGIN_SUCCESS,
         payload: res.data
       })
       loadUser()
     } catch (e) {
       dispatch({
         type:LOGIN_FAIL,
         payload: e.response.data.msg
       })
     }
   }

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
