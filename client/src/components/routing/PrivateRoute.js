/**
 * @Author: Ali
 * @Date:   2019-10-31T11:20:14+01:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-31T11:34:23+01:00
 */
import React,{useContext} from 'react'
import {Route,Redirect} from 'react-router-dom'
import AuthContext from '../../context/auth/authContext'

// standard React Private route

const PrivateRoute = ({component:Component,...rest}) => {
  const authContext = useContext(AuthContext)
  const {isAuthenticated,loading} = authContext

  return (
    <Route {...rest}
     render={props => !isAuthenticated && !loading ? (
       <Redirect to='/login' />
     ): (
       <Component {...props} />
     )} />
  )
}
export default PrivateRoute
