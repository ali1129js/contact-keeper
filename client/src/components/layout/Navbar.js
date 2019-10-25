/**
 * @Author: Ali
 * @Date:   2019-10-25T11:01:07+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-25T11:07:45+02:00
 */
import React from 'react'
import PropTypes from 'prop-types'
const Navbar = ({title,icon}) => {
  return (
    <div className="navbar bg-primary">
      <h1>  <i className={icon} /> {title}
      </h1>
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
