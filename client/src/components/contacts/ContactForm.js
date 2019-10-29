/**
 * @Author: Ali
 * @Date:   2019-10-28T09:23:53+01:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-29T10:07:13+01:00
 */
import React,{useState,useEffect,useContext} from 'react'
import ContactContext from '../../context/contact/contactContext'

const ContactForm = () => {
  const contactContext = useContext(ContactContext)

  const {addContact,clearCurrent,current} = contactContext

  const [contact,setContact] = useState({
    name:'',
    email:'',
    phone:'',
    type:'personal'
  })

  const {name,email,phone,type} = contact

  const onChange = e => setContact({...contact,[e.target.name]:e.target.value})

  const onSubmit = e => {
    e.preventDefault()
    addContact(contact)
    setContact({
      name:'',
      email:'',
      phone:'',
      type:'personal'
    })
  }
  useEffect(()=>{
    if(current !== null){
      setContact(current)
    } else {
      setContact({
        name:'',
        email:'',
        phone:'',
        type:'personal'
      })
    }
  },[contactContext,current])
  const clearAll = () => {
    clearCurrent()
  }
  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-primary"> {contact ? "Edit Contact" : 'Add Contact'} </h2>
      <input type="text" placeholder="Name" name='name' value={name} onChange={onChange} />
      <input type="email" placeholder="Email" name='email' value={email} onChange={onChange} />
      <input type="text" placeholder="Phone" name='phone' value={phone} onChange={onChange} />
      <h5> Contact Type </h5>
      <input
        type="radio"
        name="type"
        value='personal'
        onChange={onChange}
        checked={type === 'personal'} /> Personal{' '}
      <input
        type="radio"
        name="type"
        value='proffessional'
        onChange={onChange}
        checked={type === 'proffessional'} /> Proffessional
      <div className="">
        <input type="submit" value={current ? 'Update Contact' : 'Add Contact'} className="btn btn-primary btn-block"/>
      </div>
      {current && (
        <div>
          <button className="btn btn-light btn-block" onClick={clearAll}>
          <strong>  Clear</strong></button>
        </div>)}
    </form>
  )
}
export default ContactForm
