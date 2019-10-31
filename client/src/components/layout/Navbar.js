/**
 * @Author: Ali
 * @Date:   2019-10-25T11:01:07+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-31T11:14:27+01:00
 */
import React,{useContext} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import AuthContext from '../../context/auth/authContext'


const Navbar = ({title,icon}) => {
  const authContext = useContext(AuthContext)
  const {isAuthenticated, logout, user} = authContext

  const authLinks = (
    <>
     <li> Hello {user && user.name}</li>
     <li>
        <a href="#!">
          <i className="fas fa-sign-out-alt"></i>
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </>
  )

  const guestLinks = (
    <>
    <li><Link to='/register'> Register </Link></li>
    <li><Link to='/login'> Login </Link></li>
    </>
  )
  return (
    <div className="navbar bg-primary">
      <h1>  <i className={icon} /> {title}
      </h1>
      <ul>
{isAuthenticated ? authLinks : guestLinks}
      </ul>
    </div>
  )
}
Navbar.propTypes = {
  title:PropTypes.string.isRequired,
  icon:PropTypes.string
}
Navbar.defaultProps = {
  title:'Contact Keeper',
  icon:'fas fa-id-card-alt'
}
export default Navbar
