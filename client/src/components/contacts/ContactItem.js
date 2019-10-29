/**
 * @Author: Ali
 * @Date:   2019-10-27T10:47:48+01:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-29T09:43:05+01:00
 */
import React,{useContext} from 'react'
import PropTypes from 'prop-types'
import ContactContext from '../../context/contact/contactContext'

const ContactItem = ({contact}) => {
  const contactContext = useContext(ContactContext)
  const {deleteContact, setCurrent,clearCurrent} = contactContext
  const {id,name,email,phone,type} = contact

  const onDelete = () => {
    deleteContact(id)
    clearCurrent()
  }
  return (
    <div className="card bg-light">
      <h3 className="text-primary text-left">
        {name}{' '}
        <span style={{ float:"right" }}
          className={'badge ' + (type === 'proffessional' ? 'badge-success' : 'badge-primary')}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </h3>
      <ul className='list'>
        {email && (<li> <i className="fas fa-envelope-open" /> {email}</li>)}
        {phone && (<li> <i className="fas fa-phone" /> {phone}</li>)}
      </ul>
      <p>
        <button className="btn btn-dark btn-sm" onClick={()=>setCurrent(contact)}> Edit </button>
        <button className="btn btn-danger btn-sm" onClick={onDelete}> Delete </button>
      </p>
    </div>
  )
}
ContactItem.propTypes = {
  contact: PropTypes.object.isRequired
}
export default ContactItem
